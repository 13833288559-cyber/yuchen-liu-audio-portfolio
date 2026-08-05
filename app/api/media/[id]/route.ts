import { env } from "cloudflare:workers";
import { ensureSchema } from "../../../../lib/data";

export const dynamic = "force-dynamic";

export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const db=env.DB as D1Database|undefined;const bucket=env.MEDIA as R2Bucket|undefined;if(!db||!bucket)return new Response("Unavailable",{status:503});await ensureSchema(db);const item=await db.prepare("SELECT media_key AS mediaKey,media_type AS mediaType,file_name AS fileName FROM portfolio_items WHERE id=?").bind(Number(id)).first<{mediaKey:string,mediaType:string,fileName:string}>();if(!item)return new Response("Not found",{status:404});const obj=await bucket.get(item.mediaKey);if(!obj)return new Response("Not found",{status:404});const headers=new Headers();obj.writeHttpMetadata(headers);headers.set("content-type",item.mediaType);headers.set("cache-control","public, max-age=3600");headers.set("content-disposition",`inline; filename*=UTF-8''${encodeURIComponent(item.fileName)}`);return new Response(obj.body,{headers})}
