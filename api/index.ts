import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../server';

let appPromise: Promise<any> | null = null;

function getApp() {
  if (!appPromise) {
    appPromise = createApp({ serveStatic: false }).catch((err) => {
      appPromise = null;
      console.error('[api] createApp failed:', err);
      throw err;
    });
  }
  return appPromise;
}

async function runDebug(): Promise<Record<string, any>> {
  const info: Record<string, any> = {
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    hasDbUrl: Boolean(process.env.DATABASE_URL),
    dbHost: process.env.DATABASE_URL ? safeHost(process.env.DATABASE_URL) : null,
    appUrl: process.env.APP_URL,
    authSecretLen: process.env.AUTH_SECRET ? process.env.AUTH_SECRET.length : 0,
    adminPwLen: process.env.ADMIN_INITIAL_PASSWORD ? process.env.ADMIN_INITIAL_PASSWORD.length : 0,
    databaseSsl: process.env.DATABASE_SSL,
  };
  try {
    const { ProductionDB } = await import('../backend/production-db');
    const db = await ProductionDB.create();
    await db.ping();
    info.dbPing = 'ok';
    info.dbType = db.persistent ? 'postgresql' : 'memory';
  } catch (e: any) {
    info.dbError = e?.message;
    info.dbStack = String(e?.stack || '').split('\n').slice(0, 6);
  }
  return info;
}

function safeHost(url: string) {
  try { return new URL(url).host; } catch { return url.slice(0, 40); }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const path = String(req.url || '').split('?')[0];
  if (path === '/api/__debug') {
    try {
      const info = await runDebug();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(info, null, 2));
    } catch (e: any) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ fatal: e?.message, stack: String(e?.stack || '').split('\n').slice(0, 6) }, null, 2));
    }
    return;
  }
  try {
    const app = await getApp();
    return app(req, res);
  } catch (err: any) {
    console.error('[api] request handler failed:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err?.message || 'Function initialization failed', stack: process.env.NODE_ENV !== 'production' ? err?.stack : undefined }));
  }
}
