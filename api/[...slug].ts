import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../server';

let appPromise: Promise<any> | null = null;

function getApp() {
  if (!appPromise) {
    appPromise = createApp({ serveStatic: false });
  }
  return appPromise;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await getApp();
  return app(req, res);
}
