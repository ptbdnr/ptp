

# Developer Guide


### Ensure you have node.js

ref: https://nodejs.org/en/download


## Copy the environment variables to the project root (next to .gitignore)

source: ask!

```shell
cat << EOF > .env.local
KEY1=VALUE1
KEY2=VALUE2
EOF
```


### Change directory to correct folder and evaluate dependencies
```shell
cd front
(ls .env.local && echo 'INFO: Found .env.local') || echo 'CRITICAL: Missing .env.local'
(ls package.json && echo 'INFO: Found package.json') || echo 'CRITICAL: Missing package.json'
```


### Install dependencies

```shell
npm install
```

### 🏃 Running

```shell
npm run test-ui
```