import { Injectable } from '@angular/core';
import {RuntimeEnv} from './runtime-env';
import {environment} from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EnvVarsConfig {

  constructor(private runtimeEnv: RuntimeEnv) {
  }

  private useRuntime(): boolean {
    // Decide whether to use runtime env (Netlify) or build-time env
    return !!(window as any).__RUNTIME_ENV__; // true if deployed with plugin
  }

  get AUTH_API_URL(): string {
    return this.useRuntime()
      ? this.runtimeEnv.get('AUTH_API_URL')!
      : environment.AUTH_API_URL;
  }

  get DOCUMENTS_API_URL(): string {
    return this.useRuntime()
      ? this.runtimeEnv.get('DOCUMENTS_API_URL')!
      : environment.DOCUMENTS_API_URL;
  }

  get AGENT_API_URL(): string {
    return this.useRuntime()
      ? this.runtimeEnv.get('AGENT_API_URL')!
      : environment.AGENT_API_URL;
  }
}
