#!/usr/bin/env bash

export NODE_ENV=development

# Set node version
~/.nvm/nvm.sh use 

# Install modules
npm i 

# Create, Migrate and Seed the development database
node_modules/.bin/sequelize db:create
node_modules/.bin/sequelize db:migrate
node_modules/.bin/sequelize db:seed --seed `ls -1 src/db/seeders/development`
