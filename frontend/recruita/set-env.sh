#!/bin/bash

# Create assets folder if it doesn't exist
mkdir -p src/assets

# Use default empty string if env var is not set
AUTH_API_URL="${AUTH_API_URL:-}"
DOCUMENTS_API_URL="${DOCUMENTS_API_URL:-}"
AGENT_API_URL="${AGENT_API_URL:-}"

# Generate env.js
echo "window._env_ = {
  AUTH_API_URL: '$AUTH_API_URL',
  DOCUMENTS_API_URL: '$DOCUMENTS_API_URL',
  AGENT_API_URL: '$AGENT_API_URL'
};" > src/assets/env.js
