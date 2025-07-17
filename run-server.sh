#!/bin/bash

# Load NVM environment
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Add Node.js to PATH explicitly
export PATH="/home/pakkio/.nvm/versions/node/v22.16.0/bin:$PATH"

# Change to the server directory
cd /home/pakkio/IdeaProjects/oslsl

# Run the server
node dist/index.js
