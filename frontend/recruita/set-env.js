// ./frontend/recruita/setenv.js

const fs = require('fs');
const path = require('path');

// --- Configuration ---
// TARGET the file where your environment configuration is stored.
// If your Angular 20 project uses a file other than 'environment.ts' for production
// configuration, adjust this path accordingly.
const targetPath = path.resolve(__dirname, 'src/environments/environment.ts');

// Fallback values for local development (if variables are missing)
const defaultAgentApi = 'http://localhost:8002';
const defaultAuthApi = 'http://localhost:8000';
const defaultDocumentsApi = 'http://localhost:8001';
// --------------------

// 1. Read the variables from the GitHub Actions runner process (process.env)
const agentApiUrl = process.env.AGENT_API_URL || defaultAgentApi;
const authApiUrl = process.env.AUTH_API_URL || defaultAuthApi;
const documentsApiUrl = process.env.DOCUMENTS_API_URL || defaultDocumentsApi;

// 2. Create the content for the environment file
// IMPORTANT: This script will OVERWRITE the existing environment.ts file during the build.
// Ensure the structure matches what your application expects.
const envContent = `export const environment = {
  production: true,
  // INJECTED API ENDPOINTS
  AGENT_API_URL: '${agentApiUrl}',
  AUTH_API_URL: '${authApiUrl}',
  DOCUMENTS_API_URL: '${documentsApiUrl}',
};
`;

// 3. Write the new content to the environment file
fs.writeFileSync(targetPath, envContent, { encoding: 'utf-8' });

console.log('Successfully generated environment.ts with dynamic API URLs for production build.');
