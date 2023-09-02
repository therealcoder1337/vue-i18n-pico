#!/bin/sh

# copy shim and fix reference path
cp src/component-shim.d.ts dist/src
sed -i 's|../src/component-shim.d.ts|./src/component-shim.d.ts|g' dist/index.d.ts
