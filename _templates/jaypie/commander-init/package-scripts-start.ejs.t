---
inject: true
to: package.json
after: scripts
skip_if: '"start":'
sh: |
  if jq -e '.scripts["format:package"]' package.json > /dev/null; then
    npm run format:package 2> /dev/null || true
  fi
---
"start": "node <%= commandPath %>",