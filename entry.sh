#!/bin/bash

npm run typeorm:run-migrations

if [ "$NODE_ENV" == "production" ]
then
    npm run start:prod
else
    npm run start
fi
