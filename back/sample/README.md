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
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt
```

## Run the server

```shell
cd ./src
uvicorn main:app --reload
```

Access the interactive API documentation at `http://localhost:8000/docs`

quick test
```shell
curl http://127.0.0.1:8000/recommend -X POST
```
