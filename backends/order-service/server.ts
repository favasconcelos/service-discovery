import cors from 'cors';
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { discovery } from '@workspace/discovery-library';
import { getUser } from '@workspace/user-library';
import { version } from './package.json';

interface Order {
  id: string;
  userId: string;
}

const orders: Array<Order> = [
  {
    id: 'f2ce2c08-e665-4fc1-93ed-b360de6155be',
    userId: '27ad9820-c0d6-4e80-9f1e-d61bfc4c990f',
  },
];
const service = {
  name: 'user-service',
  host: 'localhost',
  port: process.env.PORT ? Number(process.env.PORT) : 9002,
  version,
};

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use((_req, res, next) => {
  res.set('X-Service-Version', service.version);
  res.set('Vary', 'X-Service-Version');
  next();
});

app.get('/order', (_: Request, res: Response) => {
  res.status(200).json(orders);
});

app.get('/order/:id', async (req: Request, res: Response) => {
  const order = orders.find(({ id }) => id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'User not found' });
  }
  try {
    const user = await getUser({ userId: order.userId });
    res.status(200).json({
      ...order,
      user,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

await discovery.listen(app, service);

console.log(`Order service listening on port http://${service.host}:${service.port}`);
