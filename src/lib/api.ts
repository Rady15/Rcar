const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const DEFAULT_TIMEOUT = 15000;

export async function api<T>(path:string, options:RequestInit={}) : Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type','application/json');
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(), DEFAULT_TIMEOUT);
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials:'include', signal:controller.signal });
    const text = await res.text();
    let data:any = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (typeof data === 'string') throw new Error(`Invalid (non-JSON) response from ${path}`);
    if(!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
    return data as T;
  } catch (err:any) {
    if (err?.name === 'AbortError') throw new Error(`Request timed out (${path})`);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const apiGet = <T>(path:string)=>api<T>(path);
export const apiPost = <T>(path:string, body:any, headers:Record<string,string>={})=>api<T>(path,{method:'POST',body:JSON.stringify(body),headers});
export const apiPut = <T>(path:string, body:any)=>api<T>(path,{method:'PUT',body:JSON.stringify(body)});
export const apiPatch = <T>(path:string, body:any)=>api<T>(path,{method:'PATCH',body:JSON.stringify(body)});
export const apiDelete = <T>(path:string)=>api<T>(path,{method:'DELETE'});
