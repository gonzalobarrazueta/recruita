import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RuntimeEnv {
  get(key: string): string | undefined {
    return (window as any).__RUNTIME_ENV__?.[key];
  }
}
