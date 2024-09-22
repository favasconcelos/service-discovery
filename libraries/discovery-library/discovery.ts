import type { Application } from 'express';
import cron from 'node-cron';

import { DISCOVERY_SERVICE, HEARTBEAT_CRON } from './constants';
import http from './http';

interface Service {
  name: string;
  host: string;
  port: number;
  version: string;
}

export function register(service: Service) {
  return http.post({ service: DISCOVERY_SERVICE, path: 'register', payload: service });
}

export function heartbeat(service: Service) {
  return http.post({ service: DISCOVERY_SERVICE, path: 'heartbeat', payload: service });
}

export async function startHeartbeat(service: Service) {
  cron.schedule(HEARTBEAT_CRON, async () => {
    try {
      await heartbeat(service);
    } catch {
      await register(service);
    }
  });
}

export async function listen(app: Application, service: Service) {
  await new Promise<void>((resolve) => app.listen(service.port, resolve));
  await register(service);
  startHeartbeat(service);
}
