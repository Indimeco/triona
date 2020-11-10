#!/bin/bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
mkdir triona
cd triona
npm install @indimeco/triona
node node_modules/@indimeco/triona