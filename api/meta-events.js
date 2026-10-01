import {sendMeta,validContext} from '../lib/meta.js';
const counts=new Map();
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({success:false});}
 const origins=['https://www.lancamentosousaandrade.com.br','https://lancamentosousaandrade.com.br','http://127.0.0.1:4173'];
 if(!origins.includes(req.headers?.origin))return res.status(403).json({success:false});
 let b;try{b=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return res.status(400).json({success:false});}
 if(JSON.stringify(b||{}).length>4096||!['PageView','ViewContent'].includes(b?.event_name)||!validContext(b?.context))return res.status(400).json({success:false});
 const key=(req.headers?.['x-vercel-forwarded-for']||req.headers?.['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0];
 const minute=Math.floor(Date.now()/60000);let count=counts.get(key);if(count?.minute!==minute)count={minute,n:0};counts.set(key,count);if(++count.n>30)return res.status(429).json({success:false});
 if(counts.size>10000)for(const [k,v]of counts)if(v.minute!==minute)counts.delete(k);
 const result=await sendMeta(req,b.event_name,b.context);
 return res.status(result.sent?200:result.reason==='not_configured'?503:202).json({success:result.sent});
}
