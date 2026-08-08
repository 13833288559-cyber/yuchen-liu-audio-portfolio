import { verifyAdmin } from "../../../../lib/data";
export const dynamic="force-dynamic";

export async function POST(request:Request){
  const auth=await verifyAdmin(request);if(!auth)return Response.json({error:"forbidden"},{status:403});
  const body=await request.json() as Record<string,unknown>;const key=String(body.path||"");if(!key.startsWith("portfolio/"))return Response.json({error:"bad path"},{status:400});
  const row={title:String(body.title||body.fileName||"未命名作品").slice(0,180),category:String(body.category||"其他").slice(0,80),description:String(body.description||"").slice(0,3000),media_key:key,media_type:String(body.mediaType||"application/octet-stream").slice(0,120),file_name:String(body.fileName||"media").slice(0,300),placement:String(body.placement||"archive").slice(0,40)};
  const {error}=await auth.client.rdb().from("portfolio_items").insert(row);if(error){await auth.client.storage.from("portfolio").remove([key]);return Response.json({error:error.message},{status:500})}
  return Response.json({ok:true});
}

export async function DELETE(request:Request){
  const auth=await verifyAdmin(request);if(!auth)return Response.json({error:"forbidden"},{status:403});
  const id=Number(new URL(request.url).searchParams.get("id"));if(!Number.isInteger(id))return Response.json({error:"bad id"},{status:400});
  const {data:item}=await auth.client.rdb().from("portfolio_items").select("media_key").eq("id",id).single();
  if(item){await auth.client.storage.from("portfolio").remove([(item as {media_key:string}).media_key]);await auth.client.rdb().from("portfolio_items").delete().eq("id",id)}
  return Response.json({ok:true});
}
