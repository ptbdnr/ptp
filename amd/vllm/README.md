
## :wrench: Developer Guide

### Clone the repo

Connect your host to GitHub
1. [Create a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
    * `ssh-keygen -t ed25519 -C "your_email@example.com"`
    * `eval "$(ssh-agent -s)"`
    * `ssh-add ~/.ssh/id_ed25519`
2. [Add a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
    * `cat ~/.ssh/id_ed25519.pub`
    * In GitHub, Settings / Access section, click  SSH and GPG keys. Click New SSH key or Add SSH key. In the "Title" field be creative. In the "Key" field, paste your public key.

```shell
git clone git@github.com:ptbdnr/ptp.git
```
```shell
ssh root@$HOST
```

### Ensure you have python3-venv

On Debian/Ubuntu
```shell
sudo apt-get update
sudo apt install -y python3-dev
sudo apt install -y python3.12-venv
sudo apt install -y python3-pytest
```

### Create Python environment and install dependencies

```shell
cd /path/to/project
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt
```

### Download the model

in your browser, go to https://huggingface.co/settings/tokens/new?tokenType=write and create a new token

```shell
# login using the token
huggingface-cli login
```

if you choose model `meta-llama/Llama-3.3-70B-Instruct`, you need to request access to the model:
1. in your browser, go to https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct 
2. request access to the model, it can take a few hours to get access

```shell
# download the model
huggingface-cli download $REPO/$MODEL_NAME
# example1: huggingface-cli download meta-llama/Llama-3.3-70B-Instruct
# example2: huggingface-cli download deepseek-ai/DeepSeek-R1-Distill-Qwen-32B

# list the downloaded models
huggingface-cli scan-cache -v
```

### Serve the model with vLLM

```shell
# serve the model
export VLLM_LOGGING_LEVEL=DEBUG
vllm serve $REPO/$MODEL_NAME -port 8000
# example1: vllm serve meta-llama/Llama-3f.3-70B-Instruct --port 8000
# example2: vllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-32B --port 8000
```

```shell
# test POST /v1/completions
# replace model value with $REPO/$MODEL_NAME based on the model you are using
curl -X POST \
  http://$HOST:8006/v1/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "meta-llama/Llama-3.3-70B-Instruct",
    "prompt": "Hello, how are you?",
    "max_tokens": 50
}'
# test POST /v1/chat/completions
curl -X POST \
  http://$HOST:8006/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "meta-llama/Llama-3.3-70B-Instruct",
    "messages": [
      {"role": "user", "content": "Hello, how are you?"}
    ],
    "max_tokens": 50
}'
```
