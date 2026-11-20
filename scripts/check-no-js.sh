#!/usr/bin/env bash
# Fails if any plain JavaScript source remains under src/. All app code must be TypeScript.
set -euo pipefail

offenders=$(find src -type f \( -name '*.js' -o -name '*.jsx' \) | sort)

if [ -n "$offenders" ]; then
  echo "Plain JavaScript is not allowed in src/. Convert these to .ts/.tsx:" >&2
  echo "$offenders" | sed 's/^/  /' >&2
  exit 1
fi
echo "No .js/.jsx files in src/."
