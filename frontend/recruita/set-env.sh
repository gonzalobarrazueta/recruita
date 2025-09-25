#!/bin/bash

# Generate src/assets/env.js from Netlify environment variables
echo "window._env_ = {
  AUTH_API_URL: '$AUTH_API_URL',
  DOCUMENTS_API_URL: '$DOCUMENTS_API_URL',
  AGENT_API_URL: '$AGENT_API_URL'
};" > src/assets/env.js
