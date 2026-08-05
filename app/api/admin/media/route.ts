import { verifyAdmin } from "../../../../lib/data";
export const dynamic="force-dynamic";

export async function POST(request:Request){
  const auth=await verifyAdmin(request);if(!auth)return Response.json({error:"forbidden"},{status:403});
  const form=await request.formData();const file=form.get("file");
  if(!(file instanceof File)||file.size===0)return Response.json({error:"file required"},{status:400});
  if(!/^(audio|video|image)\//.test(file.type))return Response.json({error:"unsupported type"},{status:400});
  const key=`portfolio/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;
  const {error:uploadError}=await auth.client.storage.from("portfolio").upload(key,file,{contentType:file.type,upsert:false});
  if(uploadError)return Response.json({error:uploadError.message},{status:500});
  const placement=String(form.get("placement")||"archive").slice(0,40);
  const row={title:String(form.get("title")||file.name).slice(0,180),category:String(form.get("category")||"其他").slice(0,80),description:String(form.get("description")||"").slice(0,3000),media_key:key,media_type:file.type,file_name:file.name,placement};
  const {error}=await auth.client.from("portfolio_items").insert(row);if(error){await auth.client.storage.from("portfolio").remove([key]);return Response.json({error:error.message},{status:500})}
  return Response.json({ok:true});
}

export async function DELETE(request:Request){
  const auth=await verifyAdmin(request);if(!auth)return Response.json({error:"forbidden"},{status:403});
  const id=Number(new URL(request.url).searchParams.get("id"));if(!Number.isInteger(id))return Response.json({error:"bad id"},{status:400});
  const {data:item}=await auth.client.from("portfolio_items").select("media_key").eq("id",id).single();
  if(item){await auth.client.storage.from("portfolio").remove([item.media_key]);await auth.client.from("portfolio_items").delete().eq("id",id)}
  return Response.json({ok:true});
}
