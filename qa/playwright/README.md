

## :wrench: Developer Guide


### Ensure you have node.js

ref: https://nodejs.org/en/download


### Copy the environment variables to the project root

source: ask!

for sample: see `path/to/repo_root/.env.sample`

```shell
ln path/to/repo_root/.env.local /path/to/project_root/.env.local
```

or

```shell
cat << EOF > .env.local
KEY1=VALUE1
KEY2=VALUE2
EOF
```


### Change directory to correct folder and evaluate dependencies

```shell
cd playwright
(ls .env.local && echo 'INFO: Found .env.local') || echo 'CRITICAL: Missing .env.local'
(ls package.json && echo 'INFO: Found package.json') || echo 'CRITICAL: Missing package.json'
```


### Install dependencies

```shell
npm install
```

### 🏃 Running Locallys

```shell
npm run test-ui
```
