import express from 'express';
import type { Request, Response } from 'express';

import { createProxyMiddleware } from 'http-proxy-middleware';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

process.on('unhandledRejection', (reason: any, promise) => {
  console.error('🔥 Unhandled Rejection at:', promise);
  console.error('🚨 Reason:', reason.stack || reason);
});

app.prepare().then(() => {
  const server = express();

  // Security headers
  server.use((req, res, next) => {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  server.disable('x-powered-by');

  // Block OPTIONS method (you may remove this if unnecessary)
  server.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.status(405).send('Method Not Allowed');
    } else {
      next();
    }
  });

  // Log proxy path
  server.use('/external-api', (req, res, next) => {
    next();
  });

  // PROXY middleware
  server.use(
    '/external-api',
    createProxyMiddleware({
      target: `${process.env.NEXT_PUBLIC_API_PROXY_URL}`,
      changeOrigin: true,
      pathRewrite: { '^/external-api': '' },
      secure: false,
    })
  );

  server.use((req: Request, res: Response) => {
    req.url = req.url.replace('/testing', '');
    return handle(req, res);
  });

  const port = process.env.PORT || 3002;
  server.listen(port, (err?: any) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
