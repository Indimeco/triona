#!/bin/bash

sudo -u ubuntu bash <<EOSU
# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
source ~/.bashrc
nvm install node

cd ~
mkdir triona
cd triona

# install artifact
npm install @indimeco/triona
echo "BOT_TOKEN=${BOT_TOKEN}" > .env
node node_modules/@indimeco/triona
EOSU