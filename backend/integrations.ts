import crypto from 'node:crypto';

export type IntegrationResult = { ok: true; reference?: string; data?: any } | { ok: false; status: number; error: string };

async function postJson(url: string, payload: any, headers: Record<string,string> = {}, timeoutMs = 10000): Promise<IntegrationResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json', ...headers}, body:JSON.stringify(payload), signal:controller.signal });
    const text = await res.text();
    let data:any = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) return { ok:false, status:res.status, error:data?.message || data?.error || `Integration request failed (${res.status})` };
    return { ok:true, reference:data?.reference || data?.id || data?.transactionId, data };
  } catch (e:any) {
    return { ok:false, status:e?.name === 'AbortError' ? 504 : 502, error:e?.name === 'AbortError' ? 'Integration timeout' : 'Integration unavailable' };
  } finally { clearTimeout(timer); }
}

export async function createPaymentIntent(payload:any, config?:{apiUrl?:string;apiKey?:string}): Promise<IntegrationResult> {
  const url = config?.apiUrl || process.env.PAYMENT_API_URL;
  const key = config?.apiKey || process.env.PAYMENT_API_KEY;
  if (!url || !key) return { ok:false, status:501, error:'Online payment provider is not configured' };
  return postJson(url, payload, { Authorization:`Bearer ${key}`, 'Idempotency-Key':String(payload.idempotencyKey || crypto.randomUUID()) });
}

export async function callTamm(payload:any): Promise<IntegrationResult> {
  const url = process.env.TAMM_API_URL;
  const key = process.env.TAMM_API_KEY;
  if (!url || !key) return { ok:false, status:501, error:'TAMM integration is not configured' };
  return postJson(url, payload, { Authorization:`Bearer ${key}`, 'X-Correlation-ID':String(payload.correlationId || crypto.randomUUID()) });
}

export async function submitZatca(payload:any): Promise<IntegrationResult> {
  const url = process.env.ZATCA_API_URL;
  const key = process.env.ZATCA_API_KEY;
  if (!url || !key) return { ok:false, status:501, error:'ZATCA integration is not configured' };
  return postJson(url, payload, { Authorization:`Bearer ${key}`, 'X-Correlation-ID':String(payload.correlationId || crypto.randomUUID()) });
}

export function verifyWebhookSignature(rawBody:string, signature:string|undefined, secret:string|undefined): boolean {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(signature.replace(/^sha256=/,''), 'utf8');
  const b = Buffer.from(expected, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a,b);
}
