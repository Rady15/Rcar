import { config as loadEnv } from 'dotenv';
loadEnv();
import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { createServer as createViteServer } from 'vite';
import { ProductionDB } from './backend/production-db';
import { AlRufqahDataStore } from './backend/db';
import type { AppUser, BookingDetails, Car, BlogPost, Branch, RoadsideTicket, InspectionReport, CorporateInquiry, SystemAuditLog, ContactMessage, Category } from './src/types';
import { PROTECTION_PLANS, ADDON_OPTIONS, CARS_DATA } from './src/data/cars';
import { OFFERS_DATA } from './src/data/offers';
import { USED_CARS_DATA, LOYALTY_TIERS, SUBSCRIPTIONS_DATA, FAQ_DATA } from './src/data/extra';
import { INITIAL_GLOBAL_SEO, INITIAL_PAGE_SEO_CONFIGS, INITIAL_SCHEMA_CONFIG, INITIAL_ROBOTS_CONFIG, INITIAL_KEYWORD_RANKINGS } from './src/data/seoData';

const PORT = Number(process.env.PORT || 3000);
const PAYMENT_WEBHOOK_SECRET_MESSAGE = 'PAYMENT_WEBHOOK_SECRET is required';
const isProd = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.AUTH_SECRET || (isProd ? '' : 'dev-only-change-me');
if (isProd && JWT_SECRET.length < 32) throw new Error('AUTH_SECRET must be at least 32 characters in production');

const STRIPE_API = 'https://api.stripe.com/v1';

async function createStripeCheckoutSession(booking: any): Promise<any> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return { ok: false, status: 501, error: 'Stripe is not configured' };
  const amount = Math.round(Number(booking?.payment?.totalAmount || 0) * 100);
  if (amount <= 0) return { ok: false, status: 400, error: 'No amount to charge' };
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const body = new URLSearchParams();
  body.set('mode', 'payment');
  body.set('locale', 'auto');
  body.set('client_reference_id', String(booking.bookingId || ''));
  body.set('customer_email', String(booking.customer?.email || ''));
  body.set('line_items[0][quantity]', '1');
  body.set('line_items[0][price_data][currency]', 'sar');
  body.set('line_items[0][price_data][unit_amount]', String(amount));
  body.set('line_items[0][price_data][product_data][name]', `Al-Rufqah Rental | ${booking.bookingId}`);
  body.set('success_url', `${appUrl}/manage-booking?booking=${encodeURIComponent(booking.bookingId)}`);
  body.set('cancel_url', `${appUrl}/`);
  try {
    const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${secret}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    const data: any = await res.json();
    if (!res.ok) return { ok: false, status: res.status, error: data?.error?.message || `Stripe error (${res.status})` };
    return { ok: true, reference: String(data.id), data: { checkoutUrl: data.url, sessionId: data.id } };
  } catch {
    return { ok: false, status: 502, error: 'Stripe is unreachable' };
  }
}

function verifyStripeWebhookSignature(raw: string, signature?: string): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const parts: Record<string, string> = {};
  for (const piece of String(signature).split(',')) {
    const idx = piece.indexOf('=');
    if (idx > 0) parts[piece.slice(0, idx)] = piece.slice(idx + 1);
  }
  if (!parts.t || !parts.v1) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${parts.t}.${raw}`).digest();
  const given = Buffer.from(parts.v1, 'hex');
  const matches = given.length === expected.length && crypto.timingSafeEqual(given, expected);
  const ageSec = Math.abs(Math.floor(Date.now() / 1000) - Number(parts.t));
  return matches && ageSec <= 300;
}

const app = express();
let runtimeDb: ProductionDB | null = null;
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use((req,res,next)=>{
  const requestId = String(req.headers['x-request-id'] || crypto.randomUUID()).slice(0,100);
  (req as any).requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});
app.use(express.json({ limit: '1mb', verify:(req:any,_res,buf)=>{ req.rawBody = buf.toString('utf8'); } }));
app.use((req,res,next)=>{
  if(req.path.startsWith('/api/')) res.setHeader('Cache-Control','no-store');
  const origin = process.env.APP_URL;
  if (origin && req.headers.origin === origin) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary','Origin'); res.setHeader('Access-Control-Allow-Credentials','true'); }
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=(self)');
  if (isProd) {
    res.setHeader('Strict-Transport-Security','max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data: https:; font-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline'; connect-src 'self' https:;");
  }
  if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');return res.sendStatus(204)}
  next();
});

app.use((req,res,next)=>{
  if(['POST','PUT','PATCH','DELETE'].includes(req.method) && req.headers.cookie?.includes('alrufqah_session=') && process.env.APP_URL){
    const origin=req.headers.origin;
    if(origin && origin !== process.env.APP_URL) return res.status(403).json({error:'Cross-site request blocked'});
  }
  next();
});

function rateLimit(limit:number, windowMs:number){ return async (req:Request,res:Response,next:NextFunction)=>{
  try {
    const key=`${req.ip}:${req.method}:${req.path}`;
    if (!runtimeDb) return next();
    const result = await runtimeDb.consumeRateLimit(key, limit, windowMs);
    if (!result.allowed) {
      res.setHeader('Retry-After', Math.max(1, Math.ceil(result.retryAfterMs / 1000)));
      return res.status(429).json({error:'Too many requests. Please try again later.'});
    }
    next();
  } catch {
    return res.status(503).json({error:'Rate limiting service unavailable'});
  }
}; }

function hashSessionToken(token:string){ return crypto.createHash('sha256').update(token).digest('hex'); }
function createSessionToken(){ return crypto.randomBytes(32).toString('base64url'); }
function getBearer(req:Request){const h=req.headers.authorization;return h?.startsWith('Bearer ')?h.slice(7):undefined}
function auth(required=true){return async (req:Request,res:Response,next:NextFunction)=>{try{const token=getBearer(req) || (req.headers.cookie?.match(/(?:^|; )alrufqah_session=([^;]+)/)?.[1]);if(!token||!runtimeDb){if(required)return res.status(401).json({error:'Authentication required'});(req as any).user=null;return next();}const session=await runtimeDb.getSession(hashSessionToken(token));if(!session){if(required)return res.status(401).json({error:'Authentication required'});(req as any).user=null;return next();}const fresh=(await runtimeDb.users()).find((u:any)=>u.id===session.userId && u.isActive);if(!fresh){await runtimeDb.revokeSession(hashSessionToken(token));if(required)return res.status(401).json({error:'Authentication required'});(req as any).user=null;return next();}(req as any).user={sub:fresh.id,role:fresh.role,email:fresh.email,branchId:fresh.branchId};next();}catch(e){if(required)return res.status(401).json({error:'Authentication required'});(req as any).user=null;next();}}}
function role(...roles:string[]){return (req:Request,res:Response,next:NextFunction)=>{if(!roles.includes((req as any).user?.role))return res.status(403).json({error:'Insufficient permissions'});next()}}
function cleanString(v:any,max=500){return typeof v==='string'?v.trim().slice(0,max):''}
function id(){return crypto.randomUUID()}
function bookingRef(){return `RUF-${crypto.randomInt(10000,99999)}`}
function safeUser(u:any){const {passwordHash,googleId,...safe}=u; return safe}
function parseCookies(req:Request){const raw=String(req.headers.cookie||''); return Object.fromEntries(raw.split(';').map(x=>x.trim()).filter(Boolean).map(x=>{const i=x.indexOf('='); return [i<0?x:x.slice(0,i), i<0?'':decodeURIComponent(x.slice(i+1))]}));}
function setCookie(res:Response,name:string,value:string,maxAge:number,options={httpOnly:true,sameSite:'Lax' as const,path:'/'} as any){const parts=[`${name}=${encodeURIComponent(value)}`,`Max-Age=${Math.floor(maxAge/1000)}`,`Path=${options.path||'/'}`,`SameSite=${options.sameSite||'Lax'}`]; if(options.httpOnly)parts.push('HttpOnly'); if(isProd)parts.push('Secure'); res.append('Set-Cookie',parts.join('; '));}
function clearCookie(res:Response,name:string){res.append('Set-Cookie',`${name}=; Max-Age=0; Path=/; SameSite=Lax${isProd?'; Secure':''}${name==='alrufqah_session'?'; HttpOnly':''}`)}
function googleConfig(){return {clientId:String(process.env.GOOGLE_CLIENT_ID||process.env.VITE_GOOGLE_CLIENT_ID||''),clientSecret:String(process.env.GOOGLE_CLIENT_SECRET||''),redirectUri:String(process.env.GOOGLE_REDIRECT_URI||`${process.env.APP_URL||`http://localhost:${PORT}`}/api/auth/google/callback`)}}

function secretKey(){return crypto.createHash('sha256').update(JWT_SECRET || 'dev-only-change-me').digest()}
function encryptSecret(value:string){const iv=crypto.randomBytes(12);const cipher=crypto.createCipheriv('aes-256-gcm',secretKey(),iv);const encrypted=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);return `enc:${iv.toString('base64url')}:${cipher.getAuthTag().toString('base64url')}:${encrypted.toString('base64url')}`}
function decryptSecret(value:string){if(!value) return ''; if(!value.startsWith('enc:')) return value; try{const [,iv,tag,data]=value.split(':');const decipher=crypto.createDecipheriv('aes-256-gcm',secretKey(),Buffer.from(iv,'base64url'));decipher.setAuthTag(Buffer.from(tag,'base64url'));return Buffer.concat([decipher.update(Buffer.from(data,'base64url')),decipher.final()]).toString('utf8')}catch{return ''}}

function hashPassword(password:string){return new Promise<string>((resolve,reject)=>{const salt=crypto.randomBytes(16);crypto.scrypt(password,salt,64,(err,key)=>err?reject(err):resolve(`scrypt$${salt.toString('hex')}$${Buffer.from(key).toString('hex')}`))})}
function verifyPassword(password:string,encoded:string){return new Promise<boolean>((resolve,reject)=>{const [kind,saltHex,keyHex]=String(encoded||'').split('$');if(kind!=='scrypt'||!saltHex||!keyHex)return resolve(false);crypto.scrypt(password,Buffer.from(saltHex,'hex'),64,(err,key)=>{if(err)return reject(err);const a=Buffer.from(keyHex,'hex'),b=Buffer.from(key);resolve(a.length===b.length&&crypto.timingSafeEqual(a,b))})})}

function assertAllowedOrigin(req:Request){
  if(!process.env.APP_URL) return true;
  const origin=req.headers.origin;
  return !origin || origin===process.env.APP_URL;
}
function sanitizeCar(body:any, existing?:any){
  const allowed=['name','brand','category','image','dailyPrice','weeklyPrice','monthlyPrice','seats','luggage','doors','transmission','fuelType','engineCapacity','features','isPopular','isSpecialOffer','discountPercentage','availableQuantity','minDriverAge','depositRequired','includedMileagePerDay','status','plateNumber','modelYear','currentBranchId','currentOdometer'];
  const out:any={...(existing||{})}; for(const k of allowed) if(body?.[k]!==undefined) out[k]=body[k]; return out;
}
function sanitizeBranch(body:any, existing?:any){
  const allowed=['name','city','type','terminal','address','phone','workingHours','is24Hours','hasSelfServiceKiosk','hasVipLounge','coordinates','latitude','longitude','rating','googleMapUrl','image','status'];
  // normalize coordinates from latitude/longitude if provided
  const out:any={...(existing||{})}; for(const k of allowed) if(body?.[k]!==undefined) out[k]=body[k];
  if(body?.latitude!==undefined || body?.longitude!==undefined){
    out.latitude = Number(body.latitude ?? out.latitude ?? 24.7136);
    out.longitude = Number(body.longitude ?? out.longitude ?? 46.6753);
    out.coordinates = { lat: out.latitude, lng: out.longitude };
  }
  if(body?.coordinates) out.coordinates = body.coordinates;
  return out;
}
function sanitizeBlog(body:any, existing?:any){
  const allowed=['slug','title','excerpt','content','category','coverImage','author','readTimeMinutes','isFeatured','isPublished','tags'];
  const out:any={...(existing||{})}; for(const k of allowed) if(body?.[k]!==undefined) out[k]=body[k]; return out;
}
function sanitizeCategory(body:any, existing?:any){
  const out:any={...(existing||{})};
  if(body?.slug!==undefined) out.slug=cleanString(body.slug,60).toLowerCase().replace(/[^a-z0-9-_]/g,'-');
  if(body?.name!==undefined) out.name=body.name;
  if(body?.description!==undefined) out.description=body.description;
  if(body?.icon!==undefined) out.icon=cleanString(body.icon,40);
  if(body?.color!==undefined) out.color=cleanString(body.color,20);
  if(body?.sortOrder!==undefined) out.sortOrder=Number(body.sortOrder)||0;
  if(body?.isActive!==undefined) out.isActive=Boolean(body.isActive);
  return out;
}
const DEFAULT_CATEGORIES: Category[] = [
  { id:'brand-toyota', slug:'toyota', name:{ar:'تويوتا',en:'Toyota'}, description:{ar:'سيارات تويوتا اليابانية',en:'Toyota vehicles'}, icon:'Car', color:'#EB0A1E', sortOrder:1, isActive:true },
  { id:'brand-hyundai', slug:'hyundai', name:{ar:'هيونداي',en:'Hyundai'}, description:{ar:'سيارات هيونداي الكورية',en:'Hyundai vehicles'}, icon:'Car', color:'#002C5F', sortOrder:2, isActive:true },
  { id:'brand-kia', slug:'kia', name:{ar:'كيا',en:'Kia'}, description:{ar:'سيارات كيا',en:'Kia vehicles'}, icon:'Car', color:'#05141F', sortOrder:3, isActive:true },
  { id:'brand-nissan', slug:'nissan', name:{ar:'نيسان',en:'Nissan'}, description:{ar:'سيارات نيسان',en:'Nissan vehicles'}, icon:'Truck', color:'#C3002F', sortOrder:4, isActive:true },
  { id:'brand-mercedes', slug:'mercedes-benz', name:{ar:'مرسيدس-بنز',en:'Mercedes-Benz'}, description:{ar:'سيارات مرسيدس الفاخرة',en:'Mercedes luxury'}, icon:'Crown', color:'#1A1A1A', sortOrder:5, isActive:true },
  { id:'brand-bmw', slug:'bmw', name:{ar:'بي إم دبليو',en:'BMW'}, description:{ar:'سيارات بي إم دبليو',en:'BMW vehicles'}, icon:'Crown', color:'#0066B1', sortOrder:6, isActive:true },
  { id:'brand-lexus', slug:'lexus', name:{ar:'لكزس',en:'Lexus'}, description:{ar:'سيارات لكزس الفاخرة',en:'Lexus luxury'}, icon:'Crown', color:'#1A1A1A', sortOrder:7, isActive:true },
  { id:'brand-cadillac', slug:'cadillac', name:{ar:'كاديلاك',en:'Cadillac'}, description:{ar:'سيارات كاديلاك الأمريكية',en:'Cadillac vehicles'}, icon:'Crown', color:'#0F0F0F', sortOrder:8, isActive:true },
  { id:'brand-porsche', slug:'porsche', name:{ar:'بورش',en:'Porsche'}, description:{ar:'سيارات بورش الرياضية',en:'Porsche sports'}, icon:'Zap', color:'#B12B28', sortOrder:9, isActive:true },
  { id:'brand-gmc', slug:'gmc', name:{ar:'جي إم سي',en:'GMC'}, description:{ar:'سيارات جي إم سي',en:'GMC vehicles'}, icon:'Truck', color:'#CC0000', sortOrder:10, isActive:true },
  { id:'brand-chevrolet', slug:'chevrolet', name:{ar:'شفروليه',en:'Chevrolet'}, description:{ar:'سيارات شفروليه',en:'Chevrolet vehicles'}, icon:'Truck', color:'#FCC200', sortOrder:11, isActive:true },
];


async function getPaymentConfig(){
  if(!runtimeDb) return {};
  const rows:any[]=await runtimeDb.content('paymentSettings');
  const v=rows.find(x=>x.id==='default')?.value;
  if(!v) return {enabled:Boolean(process.env.STRIPE_SECRET_KEY),secretKey:process.env.STRIPE_SECRET_KEY,webhookSecret:process.env.STRIPE_WEBHOOK_SECRET};
  return { enabled:v.enabled===true, secretKey:decryptSecret(v.apiKey)||process.env.STRIPE_SECRET_KEY, webhookSecret:decryptSecret(v.webhookSecret)||process.env.STRIPE_WEBHOOK_SECRET };
}

async function start(){
  const db=await ProductionDB.create();
  runtimeDb = db;
  if (isProd && process.env.APP_URL && !/^https:\/\//i.test(process.env.APP_URL)) throw new Error('APP_URL must use HTTPS in production');
  const seed=new AlRufqahDataStore();
  // Only the real product catalogue (fleet, branches, content) is bootstrapped. No demo customers,
  // bookings or operational records are ever created.
  if (process.env.SEED_CATALOG !== 'false') {
    // Public catalog/content only; no customer PII or booking history.
    const existingCars = await db.cars();
    const existingBranches = await db.branches();
    const existingBlog = await db.blog();
    if (!existingCars.length) for (const x of seed.cars) await db.saveCar({ ...x, status: x.status || 'available' });
    if (!existingBranches.length) for (const x of seed.branches) await db.saveBranch(x);
    if (!existingBlog.length) for (const x of seed.blogPosts) await db.saveBlog(x);
    const contentSeeds:any = { offer: OFFERS_DATA, usedCar: USED_CARS_DATA, loyaltyTier: LOYALTY_TIERS, subscription: SUBSCRIPTIONS_DATA, faq: FAQ_DATA, protectionPlan: PROTECTION_PLANS, addon: ADDON_OPTIONS };
    for (const [type, items] of Object.entries(contentSeeds)) { if (!(await db.content(type as any)).length) for (const x of items as any[]) await db.saveContent(type as any, x); }
     if (!(await db.content('seo')).length) {
      const configuredBase = String(process.env.APP_URL || '').replace(/\/$/, '');
      if (!configuredBase && isProd) throw new Error('APP_URL is required in production before SEO configuration can be seeded');
      const seoBase = configuredBase || 'http://localhost:3000';
      const globalSeo = { ...INITIAL_GLOBAL_SEO, canonicalBaseUrl: seoBase };
      const pageSeo = INITIAL_PAGE_SEO_CONFIGS.map((page:any) => ({ ...page, canonicalSlug: page.canonicalSlug }));
      const robots = { ...INITIAL_ROBOTS_CONFIG, sitemapUrl: `${seoBase}/sitemap.xml`, customRobotsTxt: String(INITIAL_ROBOTS_CONFIG.customRobotsTxt || '').replace(/https?:\/\/[^\s/]+/g, seoBase) };
      const keywords = INITIAL_KEYWORD_RANKINGS.map((item:any) => ({ ...item, targetUrl: String(item.targetUrl || '').replace(/https?:\/\/[^\s/]+/g, seoBase) }));
      await db.saveContent('seo', { id:'global', key:'global', value:globalSeo });
      await db.saveContent('seo', { id:'pages', key:'pages', value:pageSeo });
      await db.saveContent('seo', { id:'schema', key:'schema', value:INITIAL_SCHEMA_CONFIG });
      await db.saveContent('seo', { id:'robots', key:'robots', value:robots });
      await db.saveContent('seo', { id:'keywords', key:'keywords', value:keywords });
    }
    if (!(await db.categories()).length) {
      for (const cat of DEFAULT_CATEGORIES) await db.saveCategory({ ...cat, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() });
    }
  }
  if (!process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD.length < 12) {
    if (isProd) throw new Error('ADMIN_INITIAL_PASSWORD must be configured and at least 12 characters in production');
  } else {
    const admins = await db.users();
    let admin = admins.find((u:any)=>u.email.toLowerCase() === (process.env.ADMIN_EMAIL || 'admin@alrufqah.sa').toLowerCase());
    if (!admin) {
      admin = { id:`usr-${id()}`, fullName:process.env.ADMIN_NAME || 'System Administrator', email:(process.env.ADMIN_EMAIL || 'admin@alrufqah.sa').toLowerCase(), phone:process.env.ADMIN_PHONE || '', role:'admin', idType:'national_id', idNumber:'', nationality:'', licenseNumber:'', loyaltyTier:'platinum', loyaltyPoints:0, avatar:'', isActive:true, totalRentalsCount:0, createdAt:new Date().toISOString().slice(0,10), passwordHash:await hashPassword(process.env.ADMIN_INITIAL_PASSWORD) } as any;
      await db.saveUser(admin);
    }
  }

  const calculateQuote = async (input:any) => {
    const car = (await db.cars()).find(c=>c.id===input.carId); if(!car) throw Object.assign(new Error('Vehicle not found'),{status:404});
    const pickupDate=String(input.pickupDate||''), returnDate=String(input.returnDate||'');
    const pickupTime=String(input.pickupTime||'10:00'), returnTime=String(input.returnTime||'10:00');
    const pickup=`${pickupDate}T${pickupTime}:00+03:00`, ret=`${returnDate}T${returnTime}:00+03:00`;
    if(!/^\d{4}-\d{2}-\d{2}$/.test(pickupDate)||!/^\d{4}-\d{2}-\d{2}$/.test(returnDate)||new Date(ret)<=new Date(pickup)) throw Object.assign(new Error('Invalid rental dates'),{status:400});
    const days=Math.max(1,Math.ceil((new Date(ret).getTime()-new Date(pickup).getTime())/86400000));
    if(days>365) throw Object.assign(new Error('Rental period cannot exceed 365 days'),{status:400});
    if(!(await db.hasAvailability(car.id,pickup,ret,input.excludeBookingId))) return {available:false,numberOfDays:days,baseAmount:0,protectionAmount:0,addonsAmount:0,intercityFee:0,discountAmount:0,vatAmount:0,totalAmount:0,currency:'SAR'};
    const base=Number(car.dailyPrice)*days;
    const plans=await db.content('protectionPlan'); const plan=plans.find((p:any)=>p.id===input.protectionPlanId) || plans[0] || PROTECTION_PLANS[0];
    const protectionAmount=Number(plan.pricePerDay)*days;
    const addons=input.selectedAddons || {}; const addonCatalog=await db.content('addon');
    const addonsAmount=Object.entries(addons).reduce((sum:any,[addonId,qty]:any)=>{const opt=(addonCatalog as any[]).find(o=>o.id===addonId) || ADDON_OPTIONS.find(o=>o.id===addonId);const q=Math.max(0,Math.min(Number(qty)||0,opt?.maxQuantity||1));return sum+(opt?opt.pricePerDay*q*days:0)},0);
    const branches=await db.branches();
    const pickupBranch=branches.find(b=>b.id===input.pickupBranchId); const returnBranch=branches.find(b=>b.id===input.returnBranchId);
    const intercityFee=input.returnToDifferentLocation && pickupBranch && returnBranch && pickupBranch.city.en!==returnBranch.city.en ? 150 : 0;
    const promo=String(input.promoCode||'').trim().toUpperCase();
    const promoRows=await db.content('offer'); const promoOffer:any=promoRows.find((o:any)=>String(o.code||'').toUpperCase()===promo && o.isActive!==false && (!o.validUntil || String(o.validUntil)>=new Date().toISOString().slice(0,10)));
    const parsedDiscount=promoOffer ? Number(String(promoOffer.discount||'').replace(/[^0-9.]/g,''))/100 : 0;
    const promoRates:Record<string,number>={WEEKEND20:0.20,AIRPORT15:0.15,EARLYBIRD:0.10,MONTHLY35:days>=25?0.35:0};
    const discountRate=promoOffer ? parsedDiscount : (promoRates[promo] ?? (Number(car.discountPercentage||0)/100));
    const discountAmount=Number((base*discountRate).toFixed(2));
    const subtotal=Math.max(0,base+protectionAmount+addonsAmount+intercityFee-discountAmount);
    const vatAmount=Number((subtotal*0.15).toFixed(2));
    return {available:true,numberOfDays:days,baseAmount:base,protectionAmount,addonsAmount,intercityFee,discountAmount,vatAmount,totalAmount:Number((subtotal+vatAmount).toFixed(2)),currency:'SAR',depositRequired:Number(car.depositRequired||0),includedMileage:Number(car.includedMileagePerDay||0)};
  };

  // Internal-only operational status: a vehicle is automatically moved from 'available' to
  // 'reserved' when it has a live reservation and to 'rented' once the rental is in progress.
  // It returns to 'available' when the reservation is cancelled or completed. No external
  // government or third-party system is consulted.
  const OCCUPIED_BOOKING_STATUSES = ['pending_payment','payment_unknown','confirmed','ready_for_pickup','picked_up','active','return_pending'];
  const RENTED_BOOKING_STATUSES = ['ready_for_pickup','picked_up','active'];
  const reconcileCarStatus = async (carId:string) => {
    const car=(await db.cars()).find((c:any)=>c.id===carId); if(!car) return;
    const rows:any[]=await db.bookings();
    const live=rows.filter((b:any)=>b.car?.id===carId && OCCUPIED_BOOKING_STATUSES.includes(String(b.status)));
    const next = live.some((b:any)=>RENTED_BOOKING_STATUSES.includes(String(b.status))) ? 'rented' : live.length ? 'reserved' : 'available';
    if (next !== (car.status || 'available')) await db.saveCar({ ...car, status: next });
  };

  app.get('/api/health', async (_req,res)=>{try{await db.ping();res.json({status:'ok',database:db.persistent?'postgresql':'memory-dev',timestamp:new Date().toISOString(),version:'1.0.0'})}catch(e){res.status(503).json({status:'degraded',error:'database_unavailable'})}});
  app.get('/api/ready', async (_req,res)=>{try{await db.ping();res.json({ready:true})}catch{res.status(503).json({ready:false})}});

  // Durable notification worker. It is provider-agnostic: configure a channel URL/key and the worker
  // delivers queued messages with retries. No credentials means the queue remains safely pending.
  const notificationWorker = async()=>{
    try {
      const jobs=await db.claimNotifications(10);
      for(const job of jobs){
        const url=job.channel==='sms'?process.env.SMS_PROVIDER_URL:job.channel==='email'?process.env.EMAIL_PROVIDER_URL:process.env.WHATSAPP_PROVIDER_URL;
        const key=job.channel==='sms'?process.env.SMS_API_KEY:job.channel==='email'?process.env.EMAIL_API_KEY:process.env.WHATSAPP_API_KEY;
        if(!url||!key){await db.completeNotification(job.id,false,`${job.channel} provider not configured`);continue;}
        try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({to:job.recipient,template:job.template,payload:job.payload})});if(!r.ok)throw new Error(`provider ${r.status}`);await db.completeNotification(job.id,true);}catch(e:any){await db.completeNotification(job.id,false,e?.message||'delivery failed');}
      }
    } catch(e){ console.error('notification worker error',e); }
  };
  const workerTimer=setInterval(notificationWorker,5000); void workerTimer;


  app.post('/api/auth/register', rateLimit(6,15*60*1000), async (req,res)=>{
    try {
      const body=req.body||{}; const fullName=cleanString(body.fullName,160); const email=cleanString(body.email,254).toLowerCase(); const phone=cleanString(body.phone,30); const password=typeof body.password==='string'?body.password:'';
      if(fullName.length<2 || !/^\S+@\S+\.\S+$/.test(email) || phone.length<6 || password.length<12) return res.status(400).json({error:'Full name, valid email, phone and password of at least 12 characters are required'});
      const exists=(await db.users()).find((u:any)=>String(u.email||'').toLowerCase()===email); if(exists) return res.status(409).json({error:'An account with this email already exists'});
      const value:any={id:`usr-${id()}`,fullName,email,phone,role:'user',idType:'national_id',idNumber:'',nationality:'',licenseNumber:'',loyaltyTier:'silver',loyaltyPoints:0,isActive:true,totalRentalsCount:0,createdAt:new Date().toISOString().slice(0,10),passwordHash:await hashPassword(password)};
      await db.saveUser(value); const token=createSessionToken(); await db.createSession(hashSessionToken(token),value.id,value.role,8*60*60*1000); setCookie(res,'alrufqah_session',token,8*60*60*1000); res.status(201).json({user:safeUser(value)});
    } catch(e){ console.error(e); res.status(500).json({error:'Unable to create account'}); }
  });

  app.get('/api/auth/google', rateLimit(20,15*60*1000), async (req,res)=>{
    const {clientId,clientSecret,redirectUri}=googleConfig(); if(!clientId || !clientSecret) return res.status(503).json({error:'Google Sign-In is not configured'});
    const state=crypto.randomBytes(32).toString('base64url'); setCookie(res,'alrufqah_google_state',state,10*60*1000);
    const params=new URLSearchParams({client_id:clientId,redirect_uri:redirectUri,response_type:'code',scope:'openid email profile',state,access_type:'online',prompt:'select_account'}); res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  });

  app.get('/api/auth/google/callback', rateLimit(20,15*60*1000), async (req,res)=>{
    try {
      const {clientId,clientSecret,redirectUri}=googleConfig(); const cookies=parseCookies(req); const state=String(req.query.state||'');
      if(!clientId || !clientSecret) return res.redirect('/login?error=google_not_configured');
      if(!state || state!==cookies.alrufqah_google_state) return res.redirect('/login?error=google_state');
      clearCookie(res,'alrufqah_google_state'); const code=String(req.query.code||''); if(!code) return res.redirect('/login?error=google_cancelled');
      const tokenRes=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({code,client_id:clientId,client_secret:clientSecret,redirect_uri:redirectUri,grant_type:'authorization_code'})});
      if(!tokenRes.ok) return res.redirect('/login?error=google_token'); const tokens:any=await tokenRes.json(); if(!tokens.id_token) return res.redirect('/login?error=google_identity');
      const verifyRes=await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokens.id_token)}`); if(!verifyRes.ok) return res.redirect('/login?error=google_identity'); const profile:any=await verifyRes.json();
      if(profile.aud!==clientId || profile.iss!=='https://accounts.google.com' || profile.email_verified!=='true') return res.redirect('/login?error=google_identity');
      const email=String(profile.email||'').toLowerCase(); if(!email) return res.redirect('/login?error=google_email');
      let user:any=(await db.users()).find((u:any)=>String(u.email||'').toLowerCase()===email);
      if(!user){ user={id:`usr-${id()}`,fullName:cleanString(profile.name||email.split('@')[0],160),email,phone:'',role:'user',idType:'national_id',idNumber:'',nationality:'',licenseNumber:'',loyaltyTier:'silver',loyaltyPoints:0,isActive:true,totalRentalsCount:0,createdAt:new Date().toISOString().slice(0,10),avatar:cleanString(profile.picture||'',1000),googleId:cleanString(profile.sub,200)}; await db.saveUser(user); }
      else if(!user.googleId){ user={...user,googleId:cleanString(profile.sub,200),avatar:user.avatar||cleanString(profile.picture||'',1000)}; await db.saveUser(user); }
      if(!user.isActive) return res.redirect('/login?error=account_disabled'); const token=createSessionToken(); await db.createSession(hashSessionToken(token),user.id,user.role,8*60*60*1000); setCookie(res,'alrufqah_session',token,8*60*60*1000); res.redirect('/dashboard');
    } catch(e){ console.error('Google OAuth error',e); res.redirect('/login?error=google_failed'); }
  });

  app.post('/api/auth/login', rateLimit(8,15*60*1000), async (req,res)=>{
    const email=cleanString(req.body?.email,254).toLowerCase(); const password=typeof req.body?.password==='string'?req.body.password:'';
    if(!email||password.length<8)return res.status(400).json({error:'Email and password are required'});
    const users=await db.users(); const user:any=users.find(u=>u.email.toLowerCase()===email&&u.isActive);
    if(!user) return res.status(401).json({error:'Invalid credentials'});
    let valid = false;
    if(user.passwordHash) valid = await verifyPassword(password,user.passwordHash);
    else if(user.role==='admin' && process.env.ADMIN_INITIAL_PASSWORD && password === process.env.ADMIN_INITIAL_PASSWORD) { user.passwordHash = await hashPassword(password); await db.saveUser(user); valid = true; }
    if(!valid) return res.status(401).json({error:'Invalid credentials'});
    const token=createSessionToken();
    await db.createSession(hashSessionToken(token), user.id, user.role, 8*60*60*1000);
    res.setHeader('Set-Cookie',`alrufqah_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800${isProd?'; Secure':''}`);
    res.json({user:safeUser(user)});
  });
  app.post('/api/auth/logout', auth(false), async (req,res)=>{const token=getBearer(req) || (req.headers.cookie?.match(/(?:^|; )alrufqah_session=([^;]+)/)?.[1]); if(token) await db.revokeSession(hashSessionToken(token)); res.setHeader('Set-Cookie','alrufqah_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');res.json({success:true})});
  app.get('/api/auth/me', auth(false), async (req,res)=>{const u=(req as any).user;if(!u)return res.status(401).json({error:'Unauthenticated'});const user=(await db.users()).find(x=>x.id===u.sub);if(!user)return res.status(401).json({error:'User not found'});res.json({user:safeUser(user)})});

  app.patch('/api/auth/me', auth(), async (req,res)=>{
    const u=(req as any).user; if(!u) return res.status(401).json({error:'Unauthenticated'});
    const rows:any[]=await db.users(); const user=rows.find((x:any)=>x.id===u.sub);
    if(!user) return res.status(404).json({error:'User not found'});
    const body=req.body||{};
    const next:any={...user};
    if(typeof body.fullName==='string') next.fullName=cleanString(body.fullName,120)||user.fullName;
    if(typeof body.phone==='string') next.phone=cleanString(body.phone,30);
    const newPassword=typeof body.newPassword==='string'?body.newPassword:'';
    if(newPassword){
      if(newPassword.length<8) return res.status(400).json({error:'New password must be at least 8 characters'});
      const current=typeof body.currentPassword==='string'?body.currentPassword:'';
      let valid=false;
      if(user.passwordHash) valid=await verifyPassword(current,user.passwordHash);
      else if(user.role==='admin' && process.env.ADMIN_INITIAL_PASSWORD) valid=current===process.env.ADMIN_INITIAL_PASSWORD;
      if(!valid) return res.status(400).json({error:'Current password is incorrect'});
      next.passwordHash=await hashPassword(newPassword);
    }
    await db.saveUser(next);
    await db.saveAudit({ id:`log-${id()}`, timestamp:new Date().toISOString(), actor:`${next.fullName||user.fullName} (${user.email})`, action:user.role==='admin'?'تعديل الملف الشخصي':'Profile updated', category:'auth', details:newPassword?'تم تغيير كلمة المرور':user.role==='admin'?'تم تحديث بيانات الحساب':'Account details updated' });
    res.json({user:safeUser(next)});
  });

  app.get('/api/cars', async (req,res)=>{let cars=await db.cars();const q=cleanString(req.query.search,100).toLowerCase();if(q)cars=cars.filter(c=>`${c.brand} ${c.name.ar} ${c.name.en} ${c.plateNumber||''}`.toLowerCase().includes(q));const category=cleanString(req.query.category,30);if(category&&category!=='all')cars=cars.filter(c=>c.category===category);res.json(cars)});
  app.post('/api/cars', auth(), role('admin','staff'), async(req,res)=>{const car=sanitizeCar(req.body);if(!car.brand||!car.name?.ar||!car.name?.en) return res.status(400).json({error:'Invalid vehicle payload'});const value={...car,status:car.status||'available',id:`car-${id()}`};await db.saveCar(value);res.status(201).json(value)});
  app.put('/api/cars/:id', auth(), role('admin','staff'), async(req,res)=>{const cars=await db.cars();const old=cars.find(c=>c.id===req.params.id);if(!old)return res.status(404).json({error:'Car not found'});const value=sanitizeCar(req.body,old); value.id=old.id; await db.saveCar(value);res.json(value)});
  app.delete('/api/cars/:id', auth(), role('admin'), async(req,res)=>{if(!(await db.deleteCar(req.params.id)))return res.status(404).json({error:'Car not found'});res.json({success:true})});

  app.get('/api/branches', async(_req,res)=>res.json(await db.branches()));
  app.post('/api/branches',auth(),role('admin'),async(req,res)=>{const value={...sanitizeBranch(req.body),id:`branch-${id()}`};await db.saveBranch(value);res.status(201).json(value)});
  app.put('/api/branches/:id',auth(),role('admin'),async(req,res)=>{const old=(await db.branches()).find(b=>b.id===req.params.id);if(!old)return res.status(404).json({error:'Branch not found'});const value={...sanitizeBranch(req.body,old),id:old.id};await db.saveBranch(value);res.json(value)});
  app.delete('/api/branches/:id',auth(),role('admin'),async(req,res)=>{if(!(await db.deleteBranch(req.params.id)))return res.status(404).json({error:'Branch not found'});res.json({success:true})});

  // Categories CRUD - public read, admin write
  app.get('/api/categories', async(_req,res)=>res.json(await db.categories()));
  app.get('/api/categories/:id', async(req,res)=>{const cat=(await db.categories()).find((c:any)=>c.id===req.params.id || c.slug===req.params.id);if(!cat) return res.status(404).json({error:'Category not found'});res.json(cat)});
  app.post('/api/categories', auth(), role('admin'), async(req,res)=>{
    const body=req.body||{};
    if(!body.name?.ar || !body.name?.en) return res.status(400).json({error:'Arabic and English names are required'});
    const slug = cleanString(body.slug || body.name.en,60).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || `cat-${id().slice(0,6)}`;
    const exists = (await db.categories()).some((c:any)=>c.slug===slug);
    if(exists) return res.status(409).json({error:'Category slug already exists'});
    const value:any={ id:`cat-${id()}`, slug, name:{ar:cleanString(body.name.ar,60),en:cleanString(body.name.en,60)}, description: body.description?{ar:cleanString(body.description.ar,200),en:cleanString(body.description.en,200)}:undefined, icon:cleanString(body.icon,40)||'Tag', color:cleanString(body.color,20)||'#DFAB44', sortOrder:Number(body.sortOrder)||0, isActive:body.isActive!==false, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() };
    await db.saveCategory(value); res.status(201).json(value);
  });
  app.put('/api/categories/:id', auth(), role('admin'), async(req,res)=>{
    const old:any=(await db.categories()).find((c:any)=>c.id===req.params.id); if(!old) return res.status(404).json({error:'Category not found'});
    const patch=sanitizeCategory(req.body, old);
    if(patch.name?.ar) patch.name.ar=cleanString(patch.name.ar,60);
    if(patch.name?.en) patch.name.en=cleanString(patch.name.en,60);
    if(patch.slug){
      const dup=(await db.categories()).some((c:any)=>c.id!==old.id && c.slug===patch.slug);
      if(dup) return res.status(409).json({error:'Category slug already exists'});
    }
    const value={...old, ...patch, id:old.id, updatedAt:new Date().toISOString()};
    // ensure name stays object
    if(req.body?.name) value.name={ar:cleanString(req.body.name.ar||old.name.ar,60),en:cleanString(req.body.name.en||old.name.en,60)};
    if(req.body?.description) value.description={ar:cleanString(req.body.description.ar||'',200),en:cleanString(req.body.description.en||'',200)};
    await db.saveCategory(value); res.json(value);
  });
  app.delete('/api/categories/:id', auth(), role('admin'), async(req,res)=>{
    const cats=await db.categories(); const target=cats.find((c:any)=>c.id===req.params.id); if(!target) return res.status(404).json({error:'Category not found'});
    const cars=await db.cars(); const used=cars.some((car:any)=>car.brand?.toLowerCase()===target.slug.toLowerCase() || car.brand?.toLowerCase()===String(target.name?.en||'').toLowerCase());
    if(used) return res.status(409).json({error:'Cannot delete brand in use by vehicles. Reassign vehicles first.'});
    if(!(await db.deleteCategory(req.params.id))) return res.status(404).json({error:'Category not found'}); res.json({success:true});
  });

  app.get('/api/bookings',auth(),role('admin','staff'),async(req,res)=>{let rows=await db.bookings();const actor=(req as any).user;if(actor?.role==='staff'&&actor.branchId)rows=rows.filter((b:any)=>b.searchCriteria?.pickupBranchId===actor.branchId||b.searchCriteria?.returnBranchId===actor.branchId);const status=cleanString(req.query.status,30);if(status)rows=rows.filter(b=>b.status===status);res.json(rows)});
  app.get('/api/bookings/my', auth(), async(req,res)=>{
    const actor=(req as any).user; if(!actor) return res.status(401).json({error:'Authentication required'});
    const rows=await db.bookings();
    const email=String(actor.email||'').toLowerCase().trim();
    const phone=String(actor.phone||'').trim();
    const mine=rows.filter((b:any)=> String(b.customer?.email||'').toLowerCase().trim()===email || Boolean(phone && String(b.customer?.phone||'').trim()===phone) || Boolean(actor.sub && String(b.userId||'')===String(actor.sub)));
    res.json(mine.sort((a:any,b:any)=>String(b.createdAt||'').localeCompare(String(a.createdAt||''))));
  });
  app.post('/api/bookings/lookup',rateLimit(12,10*60*1000),async(req,res)=>{const bookingId=cleanString(req.body?.bookingId,50);const secret=cleanString(req.body?.secret,100);if(!bookingId||!secret)return res.status(400).json({error:'Booking reference and registered mobile number are required'});const b=await db.findBooking(bookingId,secret);if(!b)return res.status(404).json({error:'Booking not found'});res.json(b)});
  app.post('/api/bookings/quote',rateLimit(30,5*60*1000),async(req,res)=>{try{const quote=await calculateQuote(req.body||{});res.json(quote)}catch(e:any){res.status(e.status||500).json({error:e.message||'Unable to calculate quote'})}});
  app.post('/api/bookings',rateLimit(20,10*60*1000),auth(false),async(req,res)=>{
    try {
      const booking=req.body as BookingDetails;
      if(!booking?.car?.id||!booking.searchCriteria?.pickupDate||!booking.searchCriteria?.returnDate||!booking.customer?.email||!booking.customer?.phone) return res.status(400).json({error:'Required booking fields are missing'});
      const requestIdempotency=cleanString(req.headers['idempotency-key'],120);
      if(requestIdempotency && !/^[A-Za-z0-9._:-]{8,120}$/.test(requestIdempotency)) return res.status(400).json({error:'Invalid Idempotency-Key'});
      const idempotencyClaim=requestIdempotency ? await db.claimIdempotency(requestIdempotency,'booking-create') : {claimed:true,response:null};
      if(!idempotencyClaim.claimed) {
        if(idempotencyClaim.response) return res.status(200).json(idempotencyClaim.response);
        return res.status(409).json({error:'A request with this Idempotency-Key is already being processed. Please retry with the same key.'});
      }
      const authoritativeCar=(await db.cars()).find(c=>c.id===booking.car.id);
      if(!authoritativeCar) return res.status(404).json({error:'Vehicle not found'});
      const quote=await calculateQuote({carId:authoritativeCar.id,...booking.searchCriteria,protectionPlanId:booking.protectionPlan?.id,selectedAddons:booking.selectedAddons});
      if(!quote.available) return res.status(409).json({error:'Vehicle is no longer available for the selected time'});
      const paymentMethod=booking.payment?.method || 'pay_on_arrival';
      if(paymentMethod!=='pay_on_arrival' && !process.env.STRIPE_SECRET_KEY) return res.status(501).json({error:'Online payment provider is not configured'});
      const final={...booking,car:authoritativeCar,bookingId:booking.bookingId||bookingRef(),createdAt:new Date().toISOString(),userId:(req as any).user?.sub || booking.userId,status:paymentMethod==='pay_on_arrival'?'confirmed':'pending_payment',payment:{...booking.payment,...quote,isPaid:false,method:paymentMethod}} as BookingDetails;
      const saved=await db.createBookingAtomic(final);
      if(!saved) return res.status(409).json({error:'Vehicle is no longer available for the selected time'});
      if(paymentMethod!=='pay_on_arrival') {
        const payment=await createStripeCheckoutSession(saved);
        if(!payment.ok) { const failure:any=payment; const unresolved = failure.status>=500 ? 'payment_unknown' : 'cancelled'; await db.saveBooking({...saved,status:unresolved} as BookingDetails); return res.status(failure.status).json({error:failure.error,bookingStatus:unresolved}); }
        const response={...saved,paymentIntent:{reference:payment.reference,data:payment.data}}; await reconcileCarStatus(saved.car.id); if(requestIdempotency) await db.completeIdempotency(requestIdempotency,response); return res.status(201).json(response);
      }
      await reconcileCarStatus(saved.car.id);
      if(requestIdempotency) await db.completeIdempotency(requestIdempotency,saved);
      res.status(201).json(saved);
    } catch(e:any) { res.status(e.status||500).json({error:e.message||'Booking failed'}); }
  });
  app.post('/api/bookings/:id/cancel',rateLimit(10,10*60*1000),async(req,res)=>{
    const actor=(req as any).user; const secret=cleanString(req.body?.secret,100);
    const booking=await db.findBooking(req.params.id,secret);
    if(!booking) return res.status(404).json({error:'Booking not found'});
    const allowedOwner=Boolean(actor && (actor.role==='admin'||actor.role==='staff'||actor.sub===booking.userId));
    if(!allowedOwner && !secret) return res.status(400).json({error:'Registered mobile number is required'});
    if(!['confirmed','pending_payment','payment_unknown'].includes(booking.status)) return res.status(409).json({error:'This booking cannot be cancelled in its current status'});
    const value={...booking,status:'cancelled'} as BookingDetails; await db.saveBooking(value);
    await reconcileCarStatus(booking.car?.id);
    await db.enqueueNotification('email', booking.customer.email, 'booking.cancelled', {bookingId:booking.bookingId});
    res.json(value);
  });

  app.put('/api/bookings/:id/status',auth(),role('admin','staff'),async(req,res)=>{
    const all=await db.bookings(); const old=all.find(b=>b.bookingId===req.params.id); const next=String(req.body?.status||'');
    const transitions:any={pending_payment:['cancelled','confirmed','payment_unknown'],payment_unknown:['confirmed','cancelled'],confirmed:['active','cancelled','no_show'],active:['return_pending','completed'],return_pending:['completed'],completed:[],cancelled:[],no_show:[]};
    if(!old||!transitions[old.status]?.includes(next)) return res.status(409).json({error:'Invalid booking state transition'});
    const value={...old,status:next} as BookingDetails; await db.saveBooking(value); await reconcileCarStatus(old.car?.id); res.json(value);
  });
  app.post('/api/payments/intents', rateLimit(20,10*60*1000), auth(false), async (req,res)=>{
    const { bookingId, secret } = req.body || {};
    if(!bookingId) return res.status(400).json({error:'Invalid payment intent'});
    const booking=(await db.bookings()).find(b=>b.bookingId===bookingId);
    if(!booking) return res.status(404).json({error:'Booking not found'});
    const requester=(req as any).user; if(!requester && cleanString(secret,100)!==cleanString(booking.customer?.phone,100)) return res.status(404).json({error:'Booking not found'});
    if(booking.status !== 'pending_payment') return res.status(409).json({error:'Booking is not awaiting payment'});
    const amount=Number(booking.payment?.totalAmount || 0); if(amount<=0) return res.status(400).json({error:'Booking has no payable amount'});
    const result=await createStripeCheckoutSession(booking);
    if(!result.ok) { const failure:any=result; return res.status(failure.status).json({error:failure.error}); }
    res.status(201).json({status:'pending',reference:result.reference,data:result.data});
  });

  app.post('/api/payments/webhook', async (req,res)=>{
    const raw=(req as any).rawBody || JSON.stringify(req.body || {});
    if(!verifyStripeWebhookSignature(raw, String(req.headers['stripe-signature'] || ''))) return res.status(401).json({error:'Invalid webhook signature'});
    const event=req.body || {}; const obj=event.data?.object || {};
    const providerEventId=String(event.id || '').trim();
    if(!providerEventId) return res.status(400).json({error:'Missing provider event id'});
    const bookingId=String(event.type==='checkout.session.completed' ? obj?.client_reference_id : '').trim();
    const paymentStatus=event.type==='checkout.session.completed' ? 'succeeded' : '';
    const paidStatus=['checkout.session.completed','payment_intent.succeeded'].includes(event.type) ? 'succeeded' : '';
    const freshEvent=await db.recordPaymentEvent('stripe',providerEventId,bookingId,paymentStatus,event);
    if(!freshEvent) return res.json({received:true,duplicate:true});
    if(bookingId && paidStatus==='succeeded') {
      const booking=(await db.bookings()).find(b=>b.bookingId===bookingId);
      if(booking){
        const value={...booking,payment:{...booking.payment,isPaid:true,providerReference:obj?.id || providerEventId,provider:'stripe'},status:booking.status==='pending_payment'?'confirmed':booking.status} as BookingDetails;
        await db.saveBooking(value); await reconcileCarStatus(booking.car?.id);
      }
    }
    res.json({received:true});
  });

  app.put('/api/bookings/:id/tamm',auth(),role('admin','staff'),async(req,res)=>{
    const booking=(await db.bookings()).find(b=>b.bookingId===req.params.id); if(!booking) return res.status(404).json({error:'Booking not found'});
    const value={...booking,tammAuthorized:true,tammAuthorizationNumber:`AR-${booking.bookingId}`} as BookingDetails; await db.saveBooking(value); res.json(value);
  });

  app.delete('/api/bookings/:id',auth(),role('admin'),async(req,res)=>{
    const booking=(await db.bookings()).find(b=>b.bookingId===req.params.id); if(!booking) return res.status(404).json({error:'Booking not found'});
    await db.deleteBooking(req.params.id); await reconcileCarStatus(booking.car?.id);
    res.json({success:true});
  });

  app.post('/api/bookings/:id/reinstate',auth(),role('admin'),async(req,res)=>{
    const old=(await db.bookings()).find(b=>b.bookingId===req.params.id); if(!old) return res.status(404).json({error:'Booking not found'});
    if(!['cancelled','no_show'].includes(old.status)) return res.status(409).json({error:'Booking can only be restored from cancelled or no-show state'});
    const value={...old,status:'confirmed'} as BookingDetails; await db.saveBooking(value); await reconcileCarStatus(old.car?.id);
    res.json(value);
  });

  app.post('/api/invoices/:bookingId/submit-zatca',auth(),role('admin','staff'),async(req,res)=>{
    const booking=(await db.bookings()).find(b=>b.bookingId===req.params.bookingId); if(!booking) return res.status(404).json({error:'Booking not found'});
    const invoice={invoiceNumber:`INV-${booking.bookingId}`,issueDate:new Date().toISOString(),currency:'SAR',vatRate:0.15,customer:booking.customer,total:booking.payment?.totalAmount || 0,issuedBy:'Al-Rufqah Internal',internal:true};
    res.json({submitted:true,reference:`INV-${booking.bookingId}`,invoice,data:{mode:'internal',externalIntegration:false}});
  });

  app.get('/api/users',auth(),role('admin','staff'),async(_req,res)=>res.json((await db.users()).map(safeUser)));
  app.post('/api/users',auth(),role('admin'),async(req,res)=>{const body=req.body||{};if(!body.fullName||!body.email||!body.phone||!body.role)return res.status(400).json({error:'Invalid user payload'});if(!['admin','staff','user'].includes(body.role))return res.status(400).json({error:'Invalid role'});const value:any={id:`usr-${id()}`,fullName:cleanString(body.fullName,160),email:cleanString(body.email,254).toLowerCase(),phone:cleanString(body.phone,30),role:body.role,idType:body.idType||'national_id',idNumber:cleanString(body.idNumber,80),nationality:cleanString(body.nationality,100),licenseNumber:cleanString(body.licenseNumber,80),loyaltyTier:body.loyaltyTier||'silver',loyaltyPoints:Number(body.role==='user'?500:0),avatar:cleanString(body.avatar,1000),branchId:cleanString(body.branchId,80)||undefined,isActive:true,totalRentalsCount:0,createdAt:new Date().toISOString().slice(0,10)};if(body.password){if(typeof body.password!=='string'||body.password.length<12)return res.status(400).json({error:'Password must be at least 12 characters'});value.passwordHash=await hashPassword(body.password);}await db.saveUser(value);res.status(201).json(safeUser(value))});
app.put('/api/users/:id',auth(),role('admin'),async(req,res)=>{
    const old:any=(await db.users()).find(u=>u.id===req.params.id); if(!old)return res.status(404).json({error:'User not found'});
    const allowed=['fullName','email','phone','role','branchId','isActive','idType','idNumber','nationality','licenseNumber','loyaltyTier','loyaltyPoints','avatar'];
    const patch:any={}; for(const key of allowed) if(req.body?.[key]!==undefined) patch[key]=req.body[key];
    if(patch.role && !['admin','staff','user'].includes(patch.role)) return res.status(400).json({error:'Invalid role'});
    const value={...old,...patch,id:old.id}; await db.saveUser(value); res.json(safeUser(value));
  });
  // DELETE user
  app.delete('/api/users/:id',auth(),role('admin'),async(req,res)=>{
    if(!(await db.deleteUser(req.params.id))) return res.status(404).json({error:'User not found'}); res.json({success:true});
  });
  
  app.get('/api/blog',async(_req,res)=>res.json(await db.blog()));
  app.post('/api/blog',auth(),role('admin','staff'),async(req,res)=>{const value={...sanitizeBlog(req.body),id:`post-${id()}`,views:0,likes:0,publishedAt:new Date().toISOString().slice(0,10)};await db.saveBlog(value);res.status(201).json(value)});
  app.put('/api/blog/:id',auth(),role('admin','staff'),async(req,res)=>{const old=(await db.blog()).find(p=>p.id===req.params.id);if(!old)return res.status(404).json({error:'Post not found'});const value={...sanitizeBlog(req.body,old),id:old.id};await db.saveBlog(value);res.json(value)});
  app.delete('/api/blog/:id',auth(),role('admin'),async(req,res)=>{if(!(await db.deleteBlog(req.params.id)))return res.status(404).json({error:'Post not found'});res.json({success:true})});
  app.post('/api/blog/:id/like',rateLimit(60,60*60*1000),async(req,res)=>{const old=(await db.blog()).find(p=>p.id===req.params.id);if(!old)return res.status(404).json({error:'Post not found'});const value={...old,likes:old.likes+1};await db.saveBlog(value);res.json({likes:value.likes})});

  app.get('/api/roadside',auth(),role('admin','staff'),async(_req,res)=>res.json(await db.roadside()));
  app.post('/api/roadside',rateLimit(10,10*60*1000),async(req,res)=>{const value:any={callerName:cleanString(req.body?.callerName,120),callerPhone:cleanString(req.body?.callerPhone,30),carModel:cleanString(req.body?.carModel,120),plateNumber:cleanString(req.body?.plateNumber,40),issueType:cleanString(req.body?.issueType,40),city:cleanString(req.body?.city,80),locationDescription:cleanString(req.body?.locationDescription,500),coordinates:req.body?.coordinates,notes:cleanString(req.body?.notes,1000),id:`sos-${id()}`,ticketNumber:`SOS-${crypto.randomInt(10000,99999)}`,createdAt:new Date().toISOString(),status:'pending'};await db.saveRoadside(value);res.status(201).json(value)});
  app.put('/api/roadside/:id',auth(),role('admin','staff'),async(req,res)=>{const old=(await db.roadside()).find(t=>t.id===req.params.id);if(!old)return res.status(404).json({error:'Ticket not found'});const allowed=['status','priority','assignedUnit','notes','locationDescription','coordinates'];const patch:any={};for(const k of allowed)if(req.body?.[k]!==undefined)patch[k]=req.body[k];const value={...old,...patch,id:old.id};await db.saveRoadside(value);res.json(value)});
  app.get('/api/inspections',auth(),role('admin','staff'),async(_req,res)=>res.json(await db.inspections()));
  app.post('/api/inspections',auth(),role('admin','staff'),async(req,res)=>{const allowed=['bookingId','carId','inspectionType','inspectorName','odometer','fuelLevel','cleanliness','tiresCondition','acWorking','spareTirePresent','scratchesOrDents','signatureUrl','notes'];const value:any={id:`insp-${id()}`,date:new Date().toISOString()};for(const k of allowed)if(req.body?.[k]!==undefined)value[k]=req.body[k];await db.saveInspection(value);res.status(201).json(value)});
  app.get('/api/corporate',auth(),role('admin','staff'),async(_req,res)=>res.json(await db.corporate()));
  app.post('/api/corporate',rateLimit(10,10*60*1000),async(req,res)=>{const value:any={companyName:cleanString(req.body?.companyName,200),contactPerson:cleanString(req.body?.contactPerson,160),phone:cleanString(req.body?.phone,30),email:cleanString(req.body?.email,254).toLowerCase(),fleetSize:cleanString(req.body?.fleetSize,100),rentalDuration:cleanString(req.body?.rentalDuration,100),city:cleanString(req.body?.city,100),notes:cleanString(req.body?.notes,1500),id:`corp-${id()}`,status:'new',createdAt:new Date().toISOString().slice(0,10)};await db.saveCorporate(value);res.status(201).json(value)});
  app.put('/api/corporate/:id',auth(),role('admin','staff'),async(req,res)=>{const old=(await db.corporate()).find(x=>x.id===req.params.id);if(!old)return res.status(404).json({error:'Inquiry not found'});const allowed=['companyName','contactPerson','phone','email','fleetSize','rentalDuration','city','notes','status'];const patch:any={};for(const k of allowed)if(req.body?.[k]!==undefined)patch[k]=req.body[k];const value={...old,...patch,id:old.id};await db.saveCorporate(value);res.json(value)});

  app.get('/api/contact',auth(),role('admin','staff'),async(_req,res)=>res.json(await db.contacts()));
  app.post('/api/contact',rateLimit(10,10*60*1000),async(req,res)=>{
    const value:any={
      id:`contact-${id()}`,
      name:cleanString(req.body?.name,120),
      phone:cleanString(req.body?.phone,30),
      email:cleanString(req.body?.email,254).toLowerCase() || undefined,
      subject:cleanString(req.body?.subject,80) || 'general',
      message:cleanString(req.body?.message,2000),
      status:'new',
      createdAt:new Date().toISOString()
    };
    if(!value.name || !value.phone || !value.message) return res.status(400).json({error:'Name, phone and message are required'});
    await db.saveContact(value);res.status(201).json(value);
  });
  app.put('/api/contact/:id',auth(),role('admin','staff'),async(req,res)=>{
    const old=(await db.contacts()).find(x=>x.id===req.params.id);if(!old)return res.status(404).json({error:'Message not found'});
    const allowed=['name','phone','email','subject','message','status'];const patch:any={};for(const k of allowed)if(req.body?.[k]!==undefined)patch[k]=req.body[k];
    const value={...old,...patch,id:old.id};await db.saveContact(value);res.json(value);
  });
  app.delete('/api/contact/:id',auth(),role('admin'),async(req,res)=>{if(!(await db.deleteContact(req.params.id)))return res.status(404).json({error:'Message not found'});res.json({success:true})});
  app.get('/api/logs',auth(),role('admin','staff'),async(_req,res)=>res.json(await db.audits()));
  app.post('/api/logs',auth(),role('admin','staff'),async(req,res)=>{const value:any={...req.body,id:`log-${id()}`,timestamp:new Date().toISOString()};await db.saveAudit(value);res.status(201).json(value)});
  app.get('/api/stats',auth(),role('admin','staff'),async(_req,res)=>{const [cars,bookings]=await Promise.all([db.cars(),db.bookings()]);const paid=bookings.reduce((s,b)=>s+(b.payment?.isPaid?Number(b.payment.totalAmount||0):0),0);const active=bookings.filter(b=>['active','confirmed','ready_for_pickup','picked_up'].includes(String(b.status))).length;const total=cars.length;const byCity=new Map<string,number>();for(const b of bookings)byCity.set(b.searchCriteria?.pickupCity||'Unknown',(byCity.get(b.searchCriteria?.pickupCity||'Unknown')||0)+Number(b.payment?.isPaid?b.payment.totalAmount||0:0));const monthly=new Map<string,number>();for(const b of bookings){const d=String(b.createdAt||'').slice(0,7)||'unknown';monthly.set(d,(monthly.get(d)||0)+Number(b.payment?.isPaid?b.payment.totalAmount||0:0));}res.json({totalRevenue:paid,activeRentals:active,totalFleet:total,occupancyRate:total?Math.min(100,Math.round(active/total*100)):0,satisfactionRating:null,revenueByCity:[...byCity].map(([name,value])=>({name,value})),monthlyTrends:[...monthly].sort(([a],[b])=>a.localeCompare(b)).map(([month,revenue])=>({month,revenue})),fleetStatusBreakdown:[{name:'available',value:cars.filter(c=>c.status==='available').length},{name:'rented',value:cars.filter(c=>c.status==='rented').length},{name:'maintenance',value:cars.filter(c=>c.status==='maintenance').length},{name:'reserved',value:cars.filter(c=>c.status==='reserved').length}]})});

  // Unified CMS/content API. Public reads; admin writes.
  const contentTypeMap:any = { offers:'offer', 'used-cars':'usedCar', loyalty:'loyaltyTier', subscriptions:'subscription', faq:'faq', seo:'seo', 'used-car-leads':'usedCarLead', 'protection-plans':'protectionPlan', addons:'addon' };
  app.post('/api/content/used-cars/test-drive', rateLimit(10,10*60*1000), async(req,res)=>{
    const body=req.body||{}; if(!body.usedCarId||!cleanString(body.customerName,160)||!cleanString(body.customerPhone,30)||!cleanString(body.preferredDate,30)) return res.status(400).json({error:'Customer name, phone, vehicle and preferred date are required'});
    const value:any={id:`lead-${id()}`,usedCarId:cleanString(body.usedCarId,100),customerName:cleanString(body.customerName,160),customerPhone:cleanString(body.customerPhone,30),preferredDate:cleanString(body.preferredDate,30),status:'new',createdAt:new Date().toISOString()}; await db.saveContent('usedCarLead',value); res.status(201).json(value);
  });
  app.get('/api/content/used-car-leads', auth(), role('admin','staff'), async(_req,res)=>res.json(await db.content('usedCarLead')));
  app.get('/api/content/:type', async(req,res)=>{
    const type=contentTypeMap[String(req.params.type)];
    if(!type) return res.status(404).json({error:'Unknown content type'});
    res.json(await db.content(type));
  });
  app.post('/api/content/:type', auth(), role('admin'), async(req,res)=>{
    const type=contentTypeMap[String(req.params.type)]; if(!type) return res.status(404).json({error:'Unknown content type'});
    const value={...(req.body||{}),id:String(req.body?.id||`${type}-${id()}`)};
    await db.saveContent(type,value); res.status(201).json(value);
  });
  app.put('/api/content/:type/:id', auth(), role('admin'), async(req,res)=>{
    const type=contentTypeMap[String(req.params.type)]; if(!type) return res.status(404).json({error:'Unknown content type'});
    const rows=await db.content(type); const old:any=rows.find((x:any)=>String(x.id)===String(req.params.id));
    if(!old) return res.status(404).json({error:'Content item not found'});
    const value={...old,...(req.body||{}),id:old.id}; await db.saveContent(type,value); res.json(value);
  });
  app.delete('/api/content/:type/:id', auth(), role('admin'), async(req,res)=>{
    const type=contentTypeMap[String(req.params.type)]; if(!type) return res.status(404).json({error:'Unknown content type'});
    if(!(await db.deleteContent(type,req.params.id))) return res.status(404).json({error:'Content item not found'}); res.json({success:true});
  });
  app.get('/api/settings/payments', auth(), role('admin'), async(_req,res)=>{
    const rows:any[]=await db.content('paymentSettings'); const x=rows.find(v=>v.id==='default'); const v=x?.value||{};
    res.json({provider:v.provider||'generic',enabled:Boolean(v.enabled),environment:v.environment||'test',apiUrl:v.apiUrl||'',publicKey:v.publicKey||'',hasApiKey:Boolean(decryptSecret(v.apiKey)),hasWebhookSecret:Boolean(decryptSecret(v.webhookSecret))});
  });
  app.put('/api/settings/payments', auth(), role('admin'), async(req,res)=>{
    const body=req.body||{}; const rows:any[]=await db.content('paymentSettings'); const old:any=rows.find(v=>v.id==='default'); const prev=old?.value||{};
    const value={...prev,provider:cleanString(body.provider,50)||'generic',enabled:Boolean(body.enabled),environment:body.environment==='live'?'live':'test',apiUrl:cleanString(body.apiUrl,500),publicKey:cleanString(body.publicKey,1000)};
    if(typeof body.apiKey==='string' && body.apiKey.trim()) value.apiKey=encryptSecret(body.apiKey.trim());
    if(typeof body.webhookSecret==='string' && body.webhookSecret.trim()) value.webhookSecret=encryptSecret(body.webhookSecret.trim());
    await db.saveContent('paymentSettings',{id:'default',key:'default',value});
    res.json({provider:value.provider,enabled:value.enabled,environment:value.environment,apiUrl:value.apiUrl,publicKey:value.publicKey,hasApiKey:Boolean(value.apiKey),hasWebhookSecret:Boolean(value.webhookSecret)});
  });

  app.get('/robots.txt',(_req,res)=>{res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /dashboard\nDisallow: /login\nSitemap: ${process.env.APP_URL || 'http://localhost:3000'}/sitemap.xml\n`) });
  app.get('/sitemap.xml',(_req,res)=>{const base=(process.env.APP_URL||'http://localhost:3000').replace(/\/$/,'');const pages=['/','/fleet','/branches','/offers','/corporate','/subscription','/used-cars','/loyalty','/manage-booking','/about','/faq','/contact','/blog'];const urls=pages.map(p=>`<url><loc>${base}${p}</loc><changefreq>weekly</changefreq><priority>${p==='/'?'1.0':'0.7'}</priority></url>`).join('');res.type('application/xml').send(`<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">${urls}</urlset>`) });

  if(!isProd){const vite=await createViteServer({server:{middlewareMode:true},appType:'spa'});app.use(vite.middlewares)}else{const distPath=path.join(process.cwd(),'dist');app.use(express.static(distPath,{maxAge:'1y',index:false}));app.get('*',(req,res)=>{const site=String(process.env.APP_URL||'').replace(/\/$/,''); const file=path.join(distPath,'index.html'); if(!site) return res.sendFile(file); return res.type('html').send(fs.readFileSync(file,'utf8').replaceAll('__SITE_URL__',site));})}
  app.use((err:any,req:Request,res:Response,_next:NextFunction)=>{console.error({requestId:(req as any).requestId,error:err});if(!res.headersSent)res.status(500).json({error:'Internal server error'})});
  app.listen(PORT,'0.0.0.0',()=>console.log(`[Al-Rufqah] ${isProd?'production':'development'} server listening on :${PORT} | db=${db.persistent?'postgresql':'memory-dev'}`));
}
start().catch(err=>{console.error('Fatal startup error',err);process.exit(1)});
