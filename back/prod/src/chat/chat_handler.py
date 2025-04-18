from __future__ import annotations

import logging
import os
from typing import Optional, List, Dict, AsyncGenerator

from mistralai import Mistral
from mistralai.models.chat_completion import ChatMessage

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)

class ChatHandler:
    """Handle chat interactions with Mistral AI."""

    mistral_client: Mistral
    mistral_model_name: str

    def __init__(
        self,
        mistral_api_key: Optional[str] = None,
        mistral_model_name: Optional[str] = None,
    ) -> None:
        """Initialize the chat handler."""
        mistral_api_key = mistral_api_key or os.getenv("MISTRAL_API_KEY")
        self.mistral_model_name = mistral_model_name or os.getenv("MISTRAL_MODEL_NAME", "mistral-medium")

        if not mistral_api_key:
            raise ValueError("MISTRAL_API_KEY environment variable is required")

        self.mistral_client = Mistral(api_key=mistral_api_key)
        logger.debug("Mistral client initialized for chat")

    async def chat_complete(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        stream: bool = False,
    ) -> str | AsyncGenerator[str, None]:
        """Get chat completion from Mistral.
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'
            temperature: Controls randomness in the response (0.0 to 1.0)
            max_tokens: Maximum number of tokens to generate
            stream: Whether to stream the response
            
        Returns:
            Complete response string or async generator for streaming
        """
        try:
            chat_response = self.mistral_client.chat.complete(
                model=self.mistral_model_name,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=stream
            )
            
            if stream:
                # Return a generator for streaming responses
                async def response_generator():
                    async for chunk in chat_response:
                        if chunk.choices[0].delta.content is not None:
                            yield chunk.choices[0].delta.content
                return response_generator()
            else:
                # Return complete response
                return chat_response.choices[0].message.content

        except Exception as e:
            logger.error(f"Error in chat completion: {str(e)}")
            raise 