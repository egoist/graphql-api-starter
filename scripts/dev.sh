rm -rf dist
tsc-watch -p tsconfig.build.json --onSuccess "node dist/main"