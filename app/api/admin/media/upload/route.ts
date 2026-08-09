import {verifyAdmin} from "../../../../../lib/data";
import {appendFile,mkdir,readFile,rm,writeFile} from "node:fs/promises";

export const dynamic="force-dynamic";
export const runtime="nodejs";

type UploadMeta={fileName:string;contentType:string;fileSize:number;received:number;nextIndex:number};
const uploadRoot="/tmp/yuchen-portfolio-uploads";
const validId=(value:string)=>/^[a-f0-9-]{36}$/.test(value);
const paths=(id:string)=>({data:`${uploadRoot}/${id}.part`,meta:`${uploadRoot}/${id}.json`});

export async function POST(request:Request){
 const auth=await verifyAdmin(request);
 if(!auth)return Response.json({error:"forbidden"},{status:403});
 const url=new URL(request.url);
 const action=url.searchParams.get("action");
 await mkdir(uploadRoot,{recursive:true});
 if(action==="init"){
  const body=await request.json() as Partial<UploadMeta>;
  if(!body.fileName||!body.contentType||!/^(audio|video|image)\//.test(body.contentType))return Response.json({error:"文件信息无效"},{status:400});
  const fileSize=Number(body.fileSize||0);
  if(!Number.isFinite(fileSize)||fileSize<=0||fileSize>500*1024*1024)return Response.json({error:"文件不能超过 500MB"},{status:413});
  const uploadId=crypto.randomUUID();const target=paths(uploadId);const meta:UploadMeta={fileName:body.fileName,contentType:body.contentType,fileSize,received:0,nextIndex:0};
  await writeFile(target.meta,JSON.stringify(meta));return Response.json({uploadId});
 }
 const uploadId=url.searchParams.get("uploadId")||"";
 if(!validId(uploadId))return Response.json({error:"上传任务无效"},{status:400});
 const target=paths(uploadId);let meta:UploadMeta;
 try{meta=JSON.parse(await readFile(target.meta,"utf8")) as UploadMeta}catch{return Response.json({error:"上传会话已失效，请重新上传"},{status:409})}
 if(action==="chunk"){
  const index=Number(url.searchParams.get("index"));if(index!==meta.nextIndex||!request.body)return Response.json({error:"分片顺序错误，请重新上传"},{status:409});
  const chunk=Buffer.from(await request.arrayBuffer());if(!chunk.length||chunk.length>2*1024*1024)return Response.json({error:"分片大小无效"},{status:413});
  if(index===0)await writeFile(target.data,chunk);else await appendFile(target.data,chunk);meta.received+=chunk.length;meta.nextIndex++;await writeFile(target.meta,JSON.stringify(meta));return Response.json({received:meta.received});
 }
 if(action!=="complete")return Response.json({error:"未知上传操作"},{status:400});
 if(meta.received!==meta.fileSize)return Response.json({error:"文件分片不完整，请重新上传"},{status:409});
 const safe=meta.fileName.replace(/[^a-zA-Z0-9._-]/g,"_");
 const path=`portfolio/${crypto.randomUUID()}-${safe}`;
 const{data,error}=await auth.client.storage.from("portfolio").createSignedUploadUrl(path);
 if(error||!data)return Response.json({error:error?.message||"无法创建上传任务"},{status:500});
 const rawUrl="fullSignedURL" in data?String(data.fullSignedURL):"";
 if(!rawUrl)return Response.json({error:"腾讯云没有返回上传地址"},{status:500});
 const signedUrl=rawUrl.replace("/v1/storages/v1/storages/","/v1/storages/");
 const mergedFile=await readFile(target.data);
 const init:RequestInit={method:"PUT",headers:{"Content-Type":meta.contentType,"Content-Length":String(meta.fileSize)},body:mergedFile};
 try{const uploaded=await fetch(signedUrl,init);if(!uploaded.ok)return Response.json({error:`腾讯云存储返回 HTTP ${uploaded.status}`},{status:502});return Response.json({path:data.path})}finally{await rm(target.data,{force:true});await rm(target.meta,{force:true})}
}
