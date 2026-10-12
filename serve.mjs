// Serve this folder so the page can read the template beside it.
//   node serve.mjs [port]      default 5400
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const T={'.html':'text/html;charset=utf-8','.js':'text/javascript','.svg':'image/svg+xml','.mp4':'video/mp4','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'};
const ROOT=path.resolve('.'), PORT=Number(process.argv[2]||5400);
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]); if(p==='/')p='/index.html';
  const f=path.join(ROOT,p);
  if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('not found')}
  const type=T[path.extname(f).toLowerCase()]||'application/octet-stream', size=fs.statSync(f).size;
  // Byte ranges, because Safari will not play a video from a server that
  // cannot do them. GitHub Pages can, so without this the preloader would
  // look broken locally and fine once deployed — the worst way round.
  const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range||'');
  if(m&&(m[1]||m[2])){
    const start=m[1]?Number(m[1]):size-Number(m[2]), end=m[1]&&m[2]?Number(m[2]):size-1;
    if(start>=0&&end<size&&start<=end){
      res.writeHead(206,{'Content-Type':type,'Content-Range':`bytes ${start}-${end}/${size}`,
        'Accept-Ranges':'bytes','Content-Length':end-start+1,'Cache-Control':'no-store'});
      return fs.createReadStream(f,{start,end}).pipe(res);
    }
  }
  res.writeHead(200,{'Content-Type':type,'Content-Length':size,'Accept-Ranges':'bytes','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
}).listen(PORT,()=>console.log('  http://localhost:'+PORT+'/'));
