import { mkdir, writeFile } from 'node:fs/promises';
export async function POST(req: Request) {
 if(process.env.NODE_ENV !== 'development') return new Response(null,{status:404});
 const name=new URL(req.url).searchParams.get('name');
 if(!name || !/^[a-z0-9-]+$/.test(name)) return new Response(null,{status:400});
 await mkdir('/tmp/reziyume-visual-pdfs',{recursive:true});
 await writeFile(`/tmp/reziyume-visual-pdfs/${name}.pdf`,Buffer.from(await req.arrayBuffer()));
 return Response.json({ok:true});
}
