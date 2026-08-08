import { cloudbaseAdmin } from "../../../../lib/data";
export const dynamic="force-dynamic";
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;const client=cloudbaseAdmin();if(!client)return new Response("Unavailable",{status:503});
  const {data:item}=await client.rdb().from("portfolio_items").select("media_key").eq("id",Number(id)).single();if(!item)return new Response("Not found",{status:404});
  const {data}=client.storage.from("portfolio").getPublicUrl((item as {media_key:string}).media_key);return Response.redirect(data.publicUrl,307);
}
