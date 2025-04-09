A Python FastAPI server that implements the OpenAPI specification for the Picture-to-Palatable API. 
This includes all the endpoints defined in the spec with their corresponding request/response models.

> [!IMPORTANT]
>
> OpenAPI specification: [YAML](https://github.com/ptbdnr/ptp/blob/main/assets/openapi_v1.0.0.yaml)
>
> version: `v1.0.0`

This implementation includes:

* Pydantic models that match the schemas defined in the OpenAPI spec
* Endpoint implementations for all the paths in the specification:
    * `/recommend` - Generate recipe recommendations
    * `/users/{userId}/ingredients` - Get/update user's ingredient inventory
    * `/users/{userId}/equipments` - Get/update user's kitchen equipment
    * `/users/{userId}/preferences` - Get/update user's dietary preferences
* In-memory database to store user data for demonstration purposes (in a production application, you'd use a proper database)
* Error handling for cases like `user not found`

This implementation provides a solid foundation that you can extend with actual business logic, database integration, and AI-powered recommendation functionality.

# Developer Guide

## Requirements

* Python3.11
* Docker
* Vultr account with:
    * Container Registry
    * Compute instance

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

## Copy the environment variables to the project root (next to .gitignore)

source: ask!

```shell
cat << EOF > .env.local
KEY1=VALUE1
KEY2=VALUE2
EOF
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

## Run the server

```shell
cd /path/to/project
cd ./src
uvicorn main:app --reload
```

Access the interactive API documentation at `http://localhost:8000/docs`

quick test
```shell
curl http://127.0.0.1:8000/recommend -X POST
```

### Deploy to VM with Docker

Ensure Docker daemon is running on your machine.

```shell
# Build the image
docker build -t ptp/$IMAGE_NAME:$TAG .
```

```shell
# Log into Vultr Container Registry 
docker login https://ams.vultrcr.com/ptpcrtstnl001 -u $CR_USER -p $CR_PASS

# [OPTIONAL] Pull yout latest image if not already on the machine
docker pull ptp/$IMAGE_NAME:latest
# on macOS you might need the suffix `--platform linux/x86_64`

# Tag and Push your image to Vults Container Registry
docker tag $IMAGE_NAME:latest ams.vultrcr.com/ptpcrtstnl001/$IMAGE_NAME:latest
docker push ams.vultrcr.com/ptpcrtstnl001/$IMAGE_NAME:latest
```

On the server ensure docker is installed

```shell
apt  install docker.io

# create a docker group
usermod --append --groups docker $ADMIN_USER

# switch to the `docker` user
su - docker
```

```shell
# Log into Vultr Container Registry 
docker login https://ams.vultrcr.com/ptpcrtstnl001 -u $CR_USER -p $CR_PASS

# Pull yout latest image
docker pull ams.vultrcr.com/ptpcrtstnl001/$IMAGE_NAME:latest
# on macOS you might need the suffix `--platform linux/x86_64`

# Run image in detached mode
docker run -d --name $CONTAINER_NAME -p 80:80 ams.vultrcr.com/ptpcrtstnl001/$IMAGE_NAME
```
