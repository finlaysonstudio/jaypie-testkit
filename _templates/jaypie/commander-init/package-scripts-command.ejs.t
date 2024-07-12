---
inject: true
to: package.json
after: scripts
skip_if: '"command":'
sh: |
  if jq -e '.scripts["format:package"]' package.json > /dev/null; then
    npm run format:package 2> /dev/null || true
  fi
---
"command": "node <%= commandPath %>",