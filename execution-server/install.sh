#!/bin/bash
set -e

apt-get install -y python3 python3-pip
apt-get install -y g++ build-essential
apt-get install -y dotnet-sdk-8.0
apt-get install -y nodejs npm
npm install -g @babel/core @babel/cli @babel/preset-react @babel/preset-env
