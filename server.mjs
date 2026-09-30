// Local preview server with HTTP range support for scroll-controlled video.
// /api/leads relays real submissions; tests must mock outbound requests.
import http from 'node:http';
import { loadEnvFile } from 'node:process';
try { loadEnvFile('.env.local'); } catch (error) { if(error.code !== 'ENOENT') throw error; }
import leadHandler from './api/leads.js';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('./dist/', import.meta.url));
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.mp4':'video/mp4', '.ttf':'font/ttf' };
const server = http.createServer(async (req,res) => {
  if (new URL(req.url,'http://localhost').pathname === '/api/leads') {
    let raw='';
    for await (const chunk of req) {raw+=chunk;if(raw.length>32768){res.writeHead(413).end();return;}}
    req.body=raw;
    res.status=code=>{res.statusCode=code;return res;};
    res.json=data=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));};
    return leadHandler(req,res);
  }
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405).end();return; }
  try {
    const url = new URL(req.url, 'http://localhost');
    const target = path.resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname === '/confirmacao-vip' ? '/confirmacao-vip.html' : url.pathname === '/politica-de-privacidade' ? '/politica-de-privacidade.html' : url.pathname));
    if (!target.startsWith(root)) { res.writeHead(403).end();return; }
    const info=await stat(target); if(!info.isFile()){res.writeHead(404).end();return;}
    const headers={'Content-Type':types[path.extname(target)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache'};
    let start=0,end=info.size-1,status=200;
    if(req.headers.range){
      const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if(!match || (!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return;}
      start=match[1]?Number(match[1]):Math.max(0,info.size-Number(match[2]));
      end=match[1]&&match[2]?Math.min(Number(match[2]),end):end;
      if(start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return;}
      status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
    }
    headers['Content-Length']=end-start+1;res.writeHead(status,headers);
    if(req.method==='HEAD'){res.end();return;}
    const stream=createReadStream(target,{start,end});stream.on('error',()=>res.destroy());req.on('close',()=>stream.destroy());stream.pipe(res);
  }catch{res.writeHead(404).end('Not found');}
});
server.listen(4173,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4173'));
