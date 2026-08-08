import {verifyAdmin} from "../../../../../lib/data";

export const dynamic="force-dynamic";
export const runtime="nodejs";

export async function POST(request:Request){
 const auth=await verifyAdmin(request);
 if(!auth)return Response.json({error:"forbidden"},{status:403});
 const url=new URL(request.url);
 const fileName=url.searchParams.get("fileName")||"";
 const contentType=url.searchParams.get("contentType")||"";
 const fileSize=Number(url.searchParams.get("fileSize")||0);
 if(!fileName||!/^(audio|video|image)\//.test(contentType)||!request.body)return Response.json({error:"文件信息无效"},{status:400});
 if(!Number.isFinite(fileSize)||fileSize<=0||fileSize>500*1024*1024)return Response.json({error:"文件不能超过 500MB"},{status:413});
 const safe=fileName.replace(/[^a-zA-Z0-9._-]/g,"_");
 const path=`portfolio/${crypto.randomUUID()}-${safe}`;
 const{data,error}=await auth.client.storage.from("portfolio").createSignedUploadUrl(path);
 if(error||!data)return Response.json({error:error?.message||"无法创建上传任务"},{status:500});
 const rawUrl="fullSignedURL" in data?String(data.fullSignedURL):"";
 if(!rawUrl)return Response.json({error:"腾讯云没有返回上传地址"},{status:500});
 const signedUrl=rawUrl.replace("/v1/storages/v1/storages/","/v1/storages/");
 const init:RequestInit&{duplex:"half"}={method:"PUT",headers:{"Content-Type":contentType,"Content-Length":String(fileSize)},body:request.body,duplex:"half"};
 const uploaded=await fetch(signedUrl,init);
 if(!uploaded.ok)return Response.json({error:`腾讯云存储返回 HTTP ${uploaded.status}`},{status:502});
 return Response.json({path:data.path});
}
