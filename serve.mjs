// Serve this folder so the page can read the template beside it.
//   node serve.mjs [port]      default 5400
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const T={'.html':'text/html;charset=utf-8','.js':'text/javascript','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'};
const ROOT=path.resolve('.'), PORT=Number(process.argv[2]||5400);
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]); if(p==='/')p='/validator.html';
  const f=path.join(ROOT,p);
  if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('not found')}
  res.writeHead(200,{'Content-Type':T[path.extname(f).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
}).listen(PORT,()=>console.log('  http://localhost:'+PORT+'/'));
