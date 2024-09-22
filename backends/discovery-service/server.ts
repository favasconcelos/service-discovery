import querystring from 'node:querystring';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { version } from './package.json';
import type { CustomRequest, HeartbeatDTO, RegisterServiceDTO, ServiceRegistration } from './types';

const services: Record<string, ServiceRegistration> = {};
const service = {
  name: 'discovery-service',
  host: 'localhost',
  version: version,
  port: process.env.PORT ? Number(process.env.PORT) : 9000,
};

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.use((_req, res, next) => {
  res.set('X-Service-Version', service.version);
  res.set('Vary', 'X-Service-Version');
  next();
});

app.get('/discovery', (_: Request, res: Response) => {
  res.status(200).json(services);
});

app.post('/discovery/register', (req: CustomRequest<RegisterServiceDTO>, res: Response) => {
  const service = req.body;
  services[service.name] = {
    name: service.name,
    version: service.version,
    url: `http://${service.host}:${service.port}`,
    timestamp: new Date(),
  };
  res.status(200).json([service.name]);
});

app.post('/discovery/heartbeat', (req: CustomRequest<HeartbeatDTO>, res: Response) => {
  const { name } = req.body;
  const service = services[name];
  if (!service) {
    return res.status(404).json({ message: 'Service not found.' });
  }
  console.log(`Received heartbeat from ${name}`);
  service.timestamp = new Date();
  res.status(200).json(service);
});

app.all('/discovery/*', (req: Request, res: Response) => {
  const discoveryPath = req.params[0];
  const [serviceName, ...rest] = discoveryPath.split('/');
  const service = services[serviceName];
  if (!service) {
    return res.status(404).json({ message: 'Service not found.' });
  }

  const url = `${service.url}/${rest.join('/')}`;
  res.redirect(302, url);
});

app.listen(service.port, () =>
  console.log(`Discovery service listening on port http://${service.host}:${service.port}`),
);
