#!/bin/bash

rm build -r -f &&
npm run build-dist &&
npm test &&
cd build &&
npm publish