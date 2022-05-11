#!/usr/bin/env bash

export NODE_ENV=development

# run dev server
nodemon -q --exec "babel-node --inspect ./src/bin/start-server.js --color"