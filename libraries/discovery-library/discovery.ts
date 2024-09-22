import type { Application } from 'express';
import cron from 'node-cron';

import { request } from './request';

interface Service {
  name: string;
  host: string;
  port: number;
  version: string;
}

export function register(service: Service) {
  return request({
    url: 'http://localhost:9000/discovery/register',
    method: 'POST',
    payload: service,
  });
}

export function heartbeat(service: Service) {
  return request({
    url: 'http://localhost:9000/discovery/heartbeat',
    method: 'POST',
    payload: service,
  });
}

export async function startHeartbeat(service: Service) {
  cron.schedule('*/5 * * * * *', async () => {
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
