#!/bin/sh
set -e

if [ "${SEED_ON_START:-true}" = "true" ]; then
  echo "Running database seed..."
  node src/seed.js
fi

exec "$@"
