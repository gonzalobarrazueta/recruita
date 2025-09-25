// src/environments/environment.ts
declare global {
  interface Window { _env_: any; }
}

export const environment = {
  AUTH_API_URL: window._env_?.AUTH_API_URL || '',
  DOCUMENTS_API_URL: window._env_?.DOCUMENTS_API_URL || '',
  AGENT_API_URL: window._env_?.AGENT_API_URL || ''
};
