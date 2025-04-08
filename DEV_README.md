# Blob Storage

storage name: `ptpblobtstnl001`
location: Amsterdam, NL
tier: Premium	 

hostname: `ams1.vultrobjects.com`


# Container Registry

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
