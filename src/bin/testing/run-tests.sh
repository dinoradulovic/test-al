#!/usr/bin/env bash

export NODE_ENV=test

THIS_DIR="$(dirname "$0")"

# It gets all the env variables from ENV file
source $THIS_DIR/../../../.env

# Drop the test database
node_modules/.bin/sequelize db:drop

if [ $? -eq 0 ];
then
	echo "Resetting Test database..."

	node_modules/.bin/sequelize db:create
	node_modules/.bin/sequelize db:migrate
	node_modules/.bin/sequelize db:seed --seed `ls -1 src/db/seeders/test`
	echo "Test database created!"
	
	cat <<- END

		|                                                    |
		|                                                    |
		|                     TESTING                        |                            
		|                                                    |
		|                                                    |
	END

	mocha "./src/testing/tests.js" --timeout 10000 --require ./node_modules/@babel/register --exit
else
  echo FAIL
	echo "1. Please disconnect from the database and run the script again"
	echo "2. If that doesn't work, it might be that database doesn't exist. Check the logs."
fi
