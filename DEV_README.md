# 📦 Storage

## Blob Storage

provider: Vultr

![image](https://github.com/user-attachments/assets/99b79296-5877-473d-8f79-f1c91a1e3b33)

| name              | hostname                | tier	  | location	     | cost/mo           |
|---	              |---                      |---	    |---	           |--:                |
| `ptpblobtstnl001` | `ams1.vultrobjects.com` | Premium	| Amsterdam, NL  | $36 + consumption |

Useful links:
* [Manage Credentials](https://docs.vultr.com/products/cloud-storage/object-storage/management/manage-credentials)
* [Python SDK](https://docs.vultr.com/how-to-use-vultr-object-storage-in-python)


## Vector Storage

provider: Pinecone

![image](https://github.com/user-attachments/assets/50cd1c0e-c852-45d0-af30-e99040c08789)

Useful links:
* [Manage Credentials](https://docs.pinecone.io/reference/api/authentication)


## Container Registry

provider: Vultr

![image](https://github.com/user-attachments/assets/99b79296-5877-473d-8f79-f1c91a1e3b33)

| url                                     | visibility  | tier	          | location	     | cost/mo |
|---	                                    |---          |---	            |---	           |--:      |
| `https://ams.vultrcr.com/ptpcrtstnl001` | public	    | 20480MB Storage	| Amsterdam, NL  | $5      |

You can log into your container registry with docker in the following way:

```shell
docker login https://ams.vultrcr.com/ptpcrtstnl001 -u $CR_USER -p $CR_PASS
```
Docker Push

A project has already been created for you using the name: `ptpcrtstnl001`

```shell
docker pull hello-world:latest
docker tag hello-world:latest ams.vultrcr.com/ptpcrtstnl001/hello-world:latest
docker push ams.vultrcr.com/ptpcrtstnl001/hello-world:latest
```

Useful links:
* [Manage Credentials](https://docs.vultr.com/products/container-registry/management/configurations/generate-docker-config)
* [FastAPI in Containers)(https://fastapi.tiangolo.com/deployment/docker/)


----------

# 🖥️ Compute

## Virtual Machine

provider: Vultr

![image](https://github.com/user-attachments/assets/99b79296-5877-473d-8f79-f1c91a1e3b33)

| label           | IPv4            | user	    | spec                                | OS         | location	      | cost/mo |
|---	            |---	            |---	      |---	                                |---         |---	            |--:	    |
| `ptpvmtstnl001` | `95.179.135.1`	| `root` 	  | 1 vCPU, 2GB RAM, 25GB NVMe, 4TB/mo  | Ubuntu 24  | Amsterdam, NL  | $28     |



----------


# 🤝 Service


## Reserved IP

provider: Vultr

![image](https://github.com/user-attachments/assets/99b79296-5877-473d-8f79-f1c91a1e3b33)


| label            | address          | IP Type	| location	     | cost/mo |
|---	             |---	              |---	    |---	           |--:      |
| `ptpriptstnl001` | `199.247.26.104`	| v4 	    | Amsterdam, NL  | $3      |


## LLM as a Service

provider: Mistral

![image](https://github.com/user-attachments/assets/fd98a2af-db5e-4617-a2b9-77c56ec46e90)

Useful links:
* [Manage Credentials](https://docs.mistral.ai/getting-started/quickstart/)
* [Console Access](https://console.mistral.ai)
* [Mistral AI Embeddings with Python SDK](https://docs.mistral.ai/capabilities/embeddings/)
