#!/usr/bin/env bash
ls
rm -rf dist/
mkdir ./dist
# Copy other files that are needed for the build
cp {package.json,package-lock.json,.env,.sequelizerc,.nvmrc} ./dist
# Run Babel to transpile all JS files
node_modules/.bin/babel src -d ./dist/build/ --verbose
