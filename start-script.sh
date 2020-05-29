#!/bin/bash/

concurrently "npm start --prefix ./server/" "npm run serve --prefix ./client/" -c bgBlue.black,bgGreen.black