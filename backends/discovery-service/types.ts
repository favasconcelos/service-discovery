import type { Request } from 'express';

export interface ServiceRegistration {
  name: string;
  url: string;
  version: string;
  timestamp: Date;
}

export interface HeartbeatDTO {
  name: string;
}

export interface RegisterServiceDTO {
  name: string;
  host: string;
  port: number;
  version: string;
}

export interface CustomRequest<T> extends Request {
  body: T;
}
