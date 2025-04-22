from __future__ import annotations

import logging
import os
import json
import aiohttp
import asyncio
from typing import Optional, List, Dict, AsyncGenerator, Any, Union

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

class ChatHandler:
    """Handle chat interactions with Mistral AI."""

    api_base: str
    api_key: str
    model_name: str

    def __init__(
        self,
        mistral_api_key: Optional[str] = None,
        mistral_model_name: Optional[str] = None,
    ) -> None:
        """Initialize the chat handler."""
        self.api_key = mistral_api_key or os.getenv("MISTRAL_API_KEY")
        self.model_name = mistral_model_name or os.getenv("MISTRAL_MODEL_NAME", "mistral-medium")
        self.api_base = "https://api.mistral.ai/v1"

        if not self.api_key:
            raise ValueError("MISTRAL_API_KEY environment variable is required")
        
        logger.debug("Mistral client initialized for chat")
    
    def _format_messages(self, messages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Convert messages to Mistral API format."""
        formatted = []
        
        for message in messages:
            role = message.get("role")
            
            # Convert complex messages with parts array
            if "parts" in message and isinstance(message["parts"], list):
                # For system and user roles, extract text
                if role in ["system", "user"]:
                    # Extract text content from parts
                    content = ""
                    for part in message["parts"]:
                        if part.get("type") == "text" and "text" in part:
                            content += part["text"]
                    
                    formatted.append({
                        "role": role,
                        "content": content
                    })
                # For assistant role, handle content/tool_calls
                elif role == "assistant":
                    assistant_msg = {"role": "assistant", "content": ""}
                    for part in message["parts"]:
                        if part.get("type") == "text" and "text" in part:
                            assistant_msg["content"] += part["text"]
                    formatted.append(assistant_msg)
            # Handle simple messages with direct content
            elif "content" in message:
                # Copy only the role and content fields
                formatted.append({
                    "role": role,
                    "content": message["content"]
                })
        
        logger.debug(f"Formatted messages: {formatted}")
        return formatted

    async def chat_complete(
        self,
        messages: List[Dict[str, Any]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        stream: bool = False,
    ) -> Union[str, AsyncGenerator[str, None]]:
        """Get chat completion from Mistral."""
        # Format messages to be compatible with Mistral API
        formatted_messages = self._format_messages(messages)
        # Inject system instruction to constrain the bot to nutrition and meal planning
        system_instruction = {
            "role": "system",
            "content": (
                "You are a helpful nutrition and meal planning assistant. "
                "Provide healthy meal suggestions, nutritional guidance, and weekly meal plans. "
                "If the user asks something outside of nutrition or meal planning, politely refuse and encourage them to ask nutrition-related questions."
            )
        }
        formatted_messages.insert(0, system_instruction)
        
        # Log the input and formatted messages
        logger.debug(f"Original messages: {json.dumps(messages)}")
        logger.debug(f"Formatted messages: {json.dumps(formatted_messages)}")
        
        if stream:
            return self._stream_chat_response(formatted_messages, temperature, max_tokens)
        else:
            return await self._complete_chat_response(formatted_messages, temperature, max_tokens)
    
    async def _complete_chat_response(
        self,
        formatted_messages: List[Dict[str, Any]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
    ) -> str:
        """Get complete (non-streaming) chat response."""
        url = f"{self.api_base}/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
            "User-Agent": "PictureToPlatable/1.0"
        }
        
        payload = {
            "model": self.model_name,
            "messages": formatted_messages,
            "temperature": temperature,
            "stream": False
        }
        
        if max_tokens:
            payload["max_tokens"] = max_tokens
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=payload) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"Mistral API error: {response.status} - {error_text}")
                    raise Exception(f"Mistral API error: {response.status} - {error_text}")
                
                data = await response.json()
                return data["choices"][0]["message"]["content"]
    
    async def _stream_chat_response(
        self,
        formatted_messages: List[Dict[str, Any]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
    ) -> AsyncGenerator[str, None]:
        """Stream chat responses using the requests library to avoid aiohttp SSE issues."""
        import requests
        import sseclient
        
        url = f"{self.api_base}/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
            "User-Agent": "PictureToPlatable/1.0",
            "Accept": "text/event-stream"
        }
        
        payload = {
            "model": self.model_name,
            "messages": formatted_messages,
            "temperature": temperature,
            "stream": True
        }
        
        if max_tokens:
            payload["max_tokens"] = max_tokens
        
        # Use a synchronous requests call within an executor to avoid blocking
        def make_request():
            logger.debug(f"Making request to {url}")
            return requests.post(
                url, 
                headers=headers, 
                json=payload,
                stream=True,
                timeout=60
            )
        
        try:
            # Run the blocking request in an executor
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, make_request)
            
            if response.status_code != 200:
                logger.error(f"Mistral API error: {response.status_code} - {response.text}")
                raise Exception(f"Mistral API error: {response.status_code} - {response.text}")
            
            # Create an SSE client from the response
            client = sseclient.SSEClient(response)
            
            # Process events
            for event in client.events():
                if event.data == "[DONE]":
                    logger.debug("Received [DONE] marker")
                    break
                
                try:
                    data = json.loads(event.data)
                    if ('choices' in data and 
                        data['choices'] and 
                        'delta' in data['choices'][0] and
                        'content' in data['choices'][0]['delta'] and
                        data['choices'][0]['delta']['content'] is not None):
                        
                        content = data['choices'][0]['delta']['content']
                        logger.debug(f"Yielding content: {content}")
                        yield content
                except json.JSONDecodeError:
                    logger.warning(f"Could not parse event data as JSON: {event.data}")
        
        except Exception as e:
            logger.error(f"Error in stream processing: {type(e).__name__}: {str(e)}")
            raise 