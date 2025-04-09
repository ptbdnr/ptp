# 📦 Storage

## Blob Storage

provider: Vultr

storage name: `ptpblobtstnl001`

location: Amsterdam, NL

tier: Premium	 

hostname: `ams1.vultrobjects.com`

Useful links:
* [Manage Credentials](https://docs.vultr.com/products/cloud-storage/object-storage/management/manage-credentials)
* [Python SDK](https://docs.vultr.com/how-to-use-vultr-object-storage-in-python)


## Vector Storage

provider: Pinecone

Useful links:
* [Manage Credentials](https://docs.pinecone.io/reference/api/authentication)


## Container Registry

provider: Vultr

url: `https://ams.vultrcr.com/ptpcrtstnl001`

location: Amsterdam, NL

visibility: public

tier: 20480MB Storage

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

| label           | IPv4            | user	    | spec                                | OS         | location	      | cost/mo |
|---	            |---	            |---	      |---	                                |---         |---	            |--:	    |
| `ptpvmtstnl001` | `95.179.135.1`	| `root` 	  | 1 vCPU, 2GB RAM, 25GB NVMe, 4TB/mo  | Ubuntu 24  | Amsterdam, NL  | $28     |



----------

# 🤝 Service

## Reserved IP

provider: Vultr

| label            | address          | IP Type	| location	     | cost/mo |
|---	             |---	              |---	    |---	           |--:      |
| `ptpriptstnl001` | `199.247.26.104`	| v4 	    | Amsterdam, NL  | $3      |

## Mistral

Useful links:
* [Manage Credentials](https://docs.mistral.ai/getting-started/quickstart/)
* [Console Access](https://console.mistral.ai)
* [Mistral AI Embeddings with Python SDK](https://docs.mistral.ai/capabilities/embeddings/)
