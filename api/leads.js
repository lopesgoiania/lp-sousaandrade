import {sendMeta} from '../lib/meta.js';
// Same-origin relay: destinations are fixed server-side, never accepted from clients.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow','POST');return res.status(405).json({success:false}); }
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({success:false}); }
  const {destination, payload:p,meta_context} = body || {};
  if (!['crm','n8n'].includes(destination) || !p || typeof p.nome !== 'string' || p.nome.trim().length<2 || p.nome.length>100 || typeof p.email !== 'string' || p.email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email) || typeof p.telefone !== 'string' || !/^\+[1-9]\d{7,14}$/.test(p.telefone) || p.consent !== true) return res.status(400).json({success:false});
  const url = destination === 'crm'
    ? process.env.CRM_WEBHOOK_URL || 'https://api.100bug.app/webhook/leads/9452e285-8aac-4255-90b1-2fd770075473'
    : process.env.N8N_WEBHOOK_URL || 'https://n8n.marketinglopes.com.br/webhook/captura-site-codex';
  const data = destination === 'crm' ? {
    name:p.nome,phone:p.telefone.replace(/\D/g,''),email:p.email,
    message:`Interesse no pré-lançamento Sousa Andrade — Flamboyant. Perfil: ${['morar','investir'].includes(p.lead_intent)?p.lead_intent:'não informado'}.`,
    ...(typeof p.attribution?.utm_campaign === 'string' ? {utm_campaign:p.attribution.utm_campaign.slice(0,500)} : {})
  } : p;
  try {
    const response = await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(12000),redirect:'error'});
    const result = await response.json().catch(()=>null);
    // CRM documentation specifies POST but no response schema. Accept HTTP success,
    // except explicit application errors. n8n retains its agreed acknowledgement.
    const success = response.ok && (destination==='n8n' ? result?.success===true : result?.success!==false && !result?.error);
    if(success && destination==='crm' && meta_context?.consent===true) {
      try { await sendMeta(req,'Lead',meta_context,p); } catch { /* CRM success is independent. */ }
    }
    return res.status(success?200:502).json({success});
  } catch { return res.status(502).json({success:false}); }
}
