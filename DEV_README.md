# 💾 Storage

## Blob Storage

<img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/vultr.svg" alt="Vultr" height="100"/>

| name              | hostname                | tier	  | location	     | cost/mo           |
|---	              |---                      |---	    |---	           |--:                |
| `ptpblobtstnl001` | `ams1.vultrobjects.com` | Premium	| Amsterdam, NL  | $36 + consumption |

Useful links:
* [Manage Credentials](https://docs.vultr.com/products/cloud-storage/object-storage/management/manage-credentials)
* [Python SDK](https://docs.vultr.com/how-to-use-vultr-object-storage-in-python)


## Vector Storage

<img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/vultr.svg" alt="Vultr" height="100"/>

Useful links:
* [Manage Credentials](https://docs.pinecone.io/reference/api/authentication)


## Container Registry

<img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/vultr.svg" alt="Vultr" height="100"/>

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
* [FastAPI in Containers](https://fastapi.tiangolo.com/deployment/docker/)


----------

# 🖥️ Compute

## Virtual Machine

<img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/vultr.svg" alt="Vultr" height="100"/>

| label           | IPv4            | user	    | spec                                | OS         | location	      | cost/mo |
|---	            |---	            |---	      |---	                                |---         |---	            |--:	    |
| `ptpvmtstnl001` | `95.179.135.1`	| `root` 	  | 1 vCPU, 2GB RAM, 25GB NVMe, 4TB/mo  | Ubuntu 24  | Amsterdam, NL  | $28     |
| `ptpvmtstnl002` | `95.179.158.91`	| `root` 	  | 2 vCPU, 8GB RAM, 50GB NVMe, 5TB/mo  | Ubuntu 22  | Amsterdam, NL  | $50     |

----------


# 🤝 Service


## Reserved IP

<img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/vultr.svg" alt="Vultr" height="100"/>


| label            | address          | IP Type	| location	     | cost/mo |
|---	             |---	              |---	    |---	           |--:      |
| `ptpriptstnl001` | `199.247.26.104`	| v4 	    | Amsterdam, NL  | $3      |


## Model as a Service

### Mistral

<img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/mistral.svg" alt="Mistral" height="100"/>

Useful links:
* [Manage Credentials](https://docs.mistral.ai/getting-started/quickstart/)
* [Console Access](https://console.mistral.ai)
* [Mistral AI Embeddings with Python SDK](https://docs.mistral.ai/capabilities/embeddings/)

### Luma Labs

<img src="https://github.com/ptbdnr/ptp/blob/main/assets/images/lumalabs.svg" alt="Mistral" height="40"/>

Useful links:
* [Dev Docs](https://docs.lumalabs.ai/docs/welcome)
* [Manage Credentials](https://lumalabs.ai/api/keys)
* [FinOps](https://lumalabs.ai/api/billing/overview)
* [Text-to-Image Python SDK](https://docs.lumalabs.ai/docs/python-image-generation)
* [Text-to-Video Python SDK](https://docs.lumalabs.ai/docs/python-video-generation)
