This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# :wrench: Developer Guide

## Requirements

* node v18 or later: https://nodejs.org/en/download
* Docker: https://docs.docker.com/get-docker/
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
cd nextjs_js
(ls .env.local && echo 'INFO: Found .env.local') || echo 'CRITICAL: Missing .env.local'
(ls package.json && echo 'INFO: Found package.json') || echo 'CRITICAL: Missing package.json'
```


### 🏃 Running Locally

```shell
npm install
# or
pnpm install
```

```shell
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


# Contribution

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


### Deploy to VM with Docker

Ensure the following is in the `next.config.js` file:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
};

export default nextConfig;
```

Ensure Docker daemon is running on your machine.

```shell
# Build the image, 
# optionally add `--no-cache` to force a fresh build
docker build --progress=plain -t ptp/$IMAGE_NAME:$TAG .
# Quick test
docker run -p 3000:3000 ptp/$IMAGE_NAME:$TAG
```

```shell
# [OPTIONAL] Pull yout latest image if not already on the machine
docker pull ptp/$IMAGE_NAME:latest
# on macOS you might need the suffix `--platform linux/x86_64`

# List all images available locally
docker images

# Log into Vultr Container Registry 
docker login https://ams.vultrcr.com/ptpcrtstnl001 -u $CR_USER -p $CR_PASS

# Tag and Push your image to Vults Container Registry
docker tag ptp/$IMAGE_NAME:latest ams.vultrcr.com/ptpcrtstnl001/$IMAGE_NAME:latest
docker push ams.vultrcr.com/ptpcrtstnl001/$IMAGE_NAME:latest
```

On the server, ensure Docker is installed

```shell
apt  install docker.io

# Below is Optional but recommended
# Create user `docker`
useradd -m -g users docker
# create user group `dockergroup`
sudo addgroup dockergroup
# add users to user group
usermod --append --groups dockergroup docker
usermod --append --groups dockergroup $ADMIN_USER
# switch to the `docker` user
su - docker
```

```shell
# Log into Vultr Container Registry 
docker login https://ams.vultrcr.com/ptpcrtstnl001 -u $CR_USER -p $CR_PASS

# Pull yout latest image
docker pull ams.vultrcr.com/ptpcrtstnl001/$IMAGE_NAME:latest
# on macOS you might need the suffix `--platform linux/x86_64`

# List all images available locally
docker images

# Run image in detached mode
docker run -d --name $CONTAINER_NAME -p 3000:3000 ams.vultrcr.com/ptpcrtstnl001/$IMAGE_NAME
```

