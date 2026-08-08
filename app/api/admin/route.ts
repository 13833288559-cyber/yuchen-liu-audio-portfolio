import { contentKeys, defaults, verifyAdmin } from "../../../lib/data";
export const dynamic="force-dynamic";

export async function GET(request:Request){
  const auth=await verifyAdmin(request);if(!auth)return Response.json({error:"forbidden"},{status:403});
  const [{data:settings},{data:items}]=await Promise.all([auth.client.rdb().from("settings").select("key,value"),auth.client.rdb().from("portfolio_items").select("id,title,category,description,file_name,media_type,placement").order("id",{ascending:false})]);
  const values=Object.fromEntries(((settings??[]) as Array<{key:string;value:string}>).map(x=>[x.key,x.value]));
  return Response.json({content:{...defaults,...values},items:((items??[]) as Array<Record<string,unknown>>).map(x=>({...x,fileName:x.file_name,mediaType:x.media_type}))});
}

export async function PUT(request:Request){
  const auth=await verifyAdmin(request);if(!auth)return Response.json({error:"forbidden"},{status:403});
  const body=await request.json() as Record<string,unknown>;
  const rows=contentKeys.filter(k=>typeof body[k]==="string").map(key=>({key,value:String(body[key]).slice(0,6000)}));
  const {error}=await auth.client.rdb().from("settings").upsert(rows);if(error)return Response.json({error:error.message},{status:500});
  return Response.json({ok:true});
}
