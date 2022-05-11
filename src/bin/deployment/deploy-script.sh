#!/usr/bin/env bash

THIS_DIR="$(dirname "$0")"
# It gets all the env variables from ENV file
source $THIS_DIR/../../../.env
DEPLOY_ENV=$1
ACTION=$2

# Colors
RED_COLOR=$'\033[0;31m'
GREEN_COLOR=$'\033[0;32m' 
NC=$'\033[0m' # No Color


if [[ $DEPLOY_ENV != "staging" && $DEPLOY_ENV != "production" ]]; then
  echo "Exiting..."
  echo
  echo "You didn't provide the correct deployment environment."
  exit 1
fi

function deploy() {
  # Update the Security Group with my IP
  source "$THIS_DIR/../aws/update-security-group.sh"

  # Build the app
  source "$THIS_DIR/../building/build.sh"

  # Create an archive of the build
  TIMESTAMP=`date -u +"%Y-%m-%d_%H-%M-%S"`
  ZIP_FILE_NAME=api-${DEPLOY_ENV}-build-${TIMESTAMP}.tar.gz
  tar -czvf ${ZIP_FILE_NAME} dist

  # Send the archive to the server
  scp -i $AWS_KEY_PAIR ${ZIP_FILE_NAME} ${AWS_USER}@${AWS_INSTANCE_IP}:~


  if  [[ $ACTION = init ]]; then
    echo "Deploying the App for the first time."

    ssh -i $AWS_KEY_PAIR ${AWS_USER}@${AWS_INSTANCE_IP} \
    "mkdir app
    tar -xvzf ${ZIP_FILE_NAME} -C ./app
    cd app/dist

    export NVM_DIR=~/.nvm
    . .nvm/nvm.sh
    nvm install 9.3.0
    nvm use
    npm i
    pwd
    NODE_ENV=${DEPLOY_ENV} node_modules/.bin/sequelize db:create
    NODE_ENV=${DEPLOY_ENV} node_modules/.bin/sequelize db:migrate
    NODE_ENV=${DEPLOY_ENV} node_modules/.bin/sequelize db:seed --seed \`ls -1 ./build/db/seeders/${DEPLOY_ENV}\`
    NODE_ENV=${DEPLOY_ENV} pm2 start ./build/bin/start-server.js --name 'api'"

    rm ${ZIP_FILE_NAME}
    exit 0
  elif [[ $ACTION = recreate ]]; then
    echo "Deploying and Recreating the database"

    ssh -i $AWS_KEY_PAIR ${AWS_USER}@${AWS_INSTANCE_IP} \
    "rm -rf app
    mkdir app
    tar -xvzf ${ZIP_FILE_NAME} -C ./app
    cd app/dist
    nvm use
    npm i
    NODE_ENV=${DEPLOY_ENV} node_modules/.bin/sequelize db:drop
    NODE_ENV=${DEPLOY_ENV} node_modules/.bin/sequelize db:create
    NODE_ENV=${DEPLOY_ENV} node_modules/.bin/sequelize db:migrate
    NODE_ENV=${DEPLOY_ENV} node_modules/.bin/sequelize db:seed --seed \`ls -1 ./build/db/seeders/${DEPLOY_ENV}\`
    pm2 reload api"

    rm ${ZIP_FILE_NAME}
    exit 0
  elif [[ $ACTION = reload ]]; then
    echo "Deploying and reloading the App."

    ssh -i $AWS_KEY_PAIR ${AWS_USER}@${AWS_INSTANCE_IP} \
    "pm2 delete api
    rm -rf app
    mkdir app
    tar -xvzf ${ZIP_FILE_NAME} -C ./app
    cd app/dist
    nvm use
    npm i
    NODE_ENV=${DEPLOY_ENV} pm2 start ./build/bin/start-server.js --name 'api'"
    
    rm ${ZIP_FILE_NAME}
    exit 0
  else 
    echo "Deploying the app."
    
    ssh -i $AWS_KEY_PAIR ${AWS_USER}@${AWS_INSTANCE_IP} \
    "rm -rf app
    mkdir app
    tar -xvzf ${ZIP_FILE_NAME} -C ./app
    cd app/dist
    npm i
    pm2 reload api"

    rm ${ZIP_FILE_NAME}
    exit 0
  fi
}

echo
echo " ▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄            ▄▄▄▄▄▄▄▄▄▄▄  ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄        ▄  ▄▄▄▄▄▄▄▄▄▄▄      "
echo "▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌          ▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░▌      ▐░▌▐░░░░░░░░░░░▌     "
echo "▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌▐░▌          ▐░█▀▀▀▀▀▀▀█░▌▐░▌       ▐░▌ ▀▀▀▀█░█▀▀▀▀ ▐░▌░▌     ▐░▌▐░█▀▀▀▀▀▀▀▀▀      "
echo "▐░▌       ▐░▌▐░▌          ▐░▌       ▐░▌▐░▌          ▐░▌       ▐░▌▐░▌       ▐░▌     ▐░▌     ▐░▌▐░▌    ▐░▌▐░▌               "
echo "▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌▐░▌          ▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄█░▌     ▐░▌     ▐░▌ ▐░▌   ▐░▌▐░▌ ▄▄▄▄▄▄▄▄      "
echo "▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌          ▐░▌       ▐░▌▐░░░░░░░░░░░▌     ▐░▌     ▐░▌  ▐░▌  ▐░▌▐░▌▐░░░░░░░░▌     "
echo "▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀ ▐░▌          ▐░▌       ▐░▌ ▀▀▀▀█░█▀▀▀▀      ▐░▌     ▐░▌   ▐░▌ ▐░▌▐░▌ ▀▀▀▀▀▀█░▌     "
echo "▐░▌       ▐░▌▐░▌          ▐░▌          ▐░▌          ▐░▌       ▐░▌     ▐░▌          ▐░▌     ▐░▌    ▐░▌▐░▌▐░▌       ▐░▌     "
echo "▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░▌          ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌     ▐░▌      ▄▄▄▄█░█▄▄▄▄ ▐░▌     ▐░▐░▌▐░█▄▄▄▄▄▄▄█░▌     "
echo "▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░▌          ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌     ▐░▌     ▐░░░░░░░░░░░▌▐░▌      ▐░░▌▐░░░░░░░░░░░▌     "
echo "▀▀▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀▀▀  ▀            ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀       ▀       ▀▀▀▀▀▀▀▀▀▀▀  ▀        ▀▀  ▀▀▀▀▀▀▀▀▀▀▀       "
echo 
printf "Last commit: ${GREEN_COLOR}" 
echo `git show --pretty=format:%s -s HEAD`
echo $NC
echo



# if [[ `git status --porcelain` ]]; then
#   echo "Exiting..."
#   echo
#   echo "You shouldn't deploy when you have uncommitted changes. This script will build your current changes regardless of your latest commited changes"
#   exit 1
# else
  deploy $1
# fi
