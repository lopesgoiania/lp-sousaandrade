import {createHash} from 'node:crypto';
import {isIP} from 'node:net';
export const PIXEL_ID='3195858410596854';
export const hash=value=>createHash('sha256').update(value).digest('hex');
const text=value=>typeof value==='string'?value.trim().slice(0,500):'';
const clean=value=>text(value).toLowerCase();
export function validContext(c){return c?.consent===true && /^[a-zA-Z0-9_-]{16,100}$/.test(c.event_id||'') && /^[a-zA-Z0-9_-]{16,100}$/.test(c.external_id||'');}
export function userData(req,c,lead){
 const u={external_id:[hash(c.external_id)]};
 const ip=text(req.headers?.['x-vercel-forwarded-for']||req.headers?.['x-forwarded-for']||req.socket?.remoteAddress).split(',')[0].trim();
 if(isIP(ip))u.client_ip_address=ip;
 const agent=text(req.headers?.['user-agent']);if(agent)u.client_user_agent=agent;
 for(const key of ['fbp','fbc'])if(/^fb\.\d+\.\d{10,13}\.[a-zA-Z0-9_-]+$/.test(c[key]||''))u[key]=c[key];
 if(lead){
  u.em=[hash(clean(lead.email))];u.ph=[hash(text(lead.telefone).replace(/\D/g,''))];
  const names=clean(lead.nome).split(/\s+/);if(names[0])u.fn=[hash(names[0])];if(names.length>1)u.ln=[hash(names.slice(1).join(' '))];
  if(/^[a-z]{2}$/i.test(lead.phone_country||''))u.country=[hash(lead.phone_country.toLowerCase())];
 }
 return u;
}
export async function sendMeta(req,eventName,c,lead){
 if(!validContext(c))return {sent:false,reason:'no_consent'};
 const token=process.env.META_ACCESS_TOKEN;
 if(!token)return {sent:false,reason:'not_configured'};
 const version=/^v\d+\.\d+$/.test(process.env.META_GRAPH_VERSION||'')?process.env.META_GRAPH_VERSION:'v23.0';
 const event={event_name:eventName,event_id:c.event_id,event_time:Math.floor(Date.now()/1000),action_source:'website',event_source_url:'https://www.lancamentosousaandrade.com.br/',user_data:userData(req,c,lead),custom_data:{content_name:'Sousa Andrade — Flamboyant'}};
 const payload={data:[event]};if(process.env.META_TEST_EVENT_CODE)payload.test_event_code=process.env.META_TEST_EVENT_CODE;
 try{
  const r=await fetch(`https://graph.facebook.com/${version}/${PIXEL_ID}/events`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(payload),signal:AbortSignal.timeout(2000),redirect:'error'});
  const result=await r.json().catch(()=>null);
  const sent=r.ok&&result?.events_received===1;
  if(!sent)console.warn('meta_delivery_failed',{event:eventName,status:r.status,code:result?.error?.code});
  return {sent,reason:sent?'accepted':'upstream'};
 }catch{console.warn('meta_delivery_failed',{event:eventName,reason:'network'});return {sent:false,reason:'network'};}
}
