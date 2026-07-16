#!/bin/bash

cd $(dirname "$0")
cd ..

command_exists(){
  command -v "$1" &> /dev/null
}

if ! command_exists "ncu"; then
    echo "npm-check-updates is not installed"
    npm i -g npm-check-updates
else
    echo "ncu is installed"
fi

function updateDependencies {
  echo "updating dependencies..."
  ncu -u --workspaces -x @types/node -x rollup -x typescript
  rm -rf node_modules packages/*/node_modules package-lock.json dist
  npm install
}

updateDependencies &&

echo "Great Success!"

sleep 2
