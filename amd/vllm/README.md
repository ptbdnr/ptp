
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

### Install vllm

in your browser, go to https://huggingface.co/settings/tokens/new?tokenType=write and create a new token

```shell
# login using the token
huggingface-cli login
```

in your browser, go to https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct and request access to the model

```shell
# download the model
huggingface-cli download meta-llama/Llama-3.3-70B-Instruct
# serve the model
vllm serve meta-llama/Llama-3.3-70B-Instruct --port 8006
```