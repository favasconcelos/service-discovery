import apicache from 'apicache';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { discovery } from '@workspace/discovery-library';
import { version } from './package.json';

interface User {
  id: string;
  name: string;
  address: string;
  age: number;
}

const users: Array<User> = [
  {
    id: '27ad9820-c0d6-4e80-9f1e-d61bfc4c990f',
    name: 'Felipe',
    address: 'Rua dos bobos, 0',
    age: 30,
  },
];
const service = {
  name: 'user-service',
  host: 'localhost',
  port: process.env.PORT ? Number(process.env.PORT) : 9001,
  version,
};

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(apicache.middleware('5 minutes'));

app.use((_req, res, next) => {
  res.set('X-Service-Version', service.version);
  res.set('Vary', 'X-Service-Version');
  next();
});

app.get('/user', (_: Request, res: Response) => {
  res.status(200).json(users);
});

app.get('/user/:id', (req: Request, res: Response) => {
  const user = users.find(({ id }) => id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(200).json(user);
});

await discovery.listen(app, service);

console.log(`User service listening on port http://${service.host}:${service.port}`);
