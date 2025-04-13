# :wrench: Developer Guide

## Requirements

* Python3.11
* Vultr account with:
    * Object Storage

## Clone the repo

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

## Copy the environment variables to the project root

source: ask!

```shell
cat << EOF > .env.local
KEY1=VALUE1
KEY2=VALUE2
EOF
```

### Evaluate dependencies

```shell
(ls .env.local && echo 'INFO: Found .env.local') || echo 'CRITICAL: Missing .env.local'
(ls requirements.txt && echo 'INFO: Found requirements.txt') || echo 'CRITICAL: Missing requirements.txt'
```

## Ensure you have python3-venv

On Debian/Ubuntu
```shell
sudo apt-get update
sudo apt install -y python3-dev
sudo apt install -y python3.12-venv
sudo apt install -y python3-pytest
```

## Create Python environment and install dependencies

```shell
cd /path/to/project
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt
```

## Create Vultr Object Storage bucket(s)

```shell
python3 main.py
```
