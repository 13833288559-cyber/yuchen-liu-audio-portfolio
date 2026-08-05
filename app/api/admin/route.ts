import { getChatGPTUser } from "../../chatgpt-auth";
import { defaults, requireOwner } from "../../../lib/data";

export const dynamic = "force-dynamic";

async function owner(){const user=await getChatGPTUser();if(!user)return null;try{return {db:await requireOwner(user.email),user}}catch{return null}}

export async function GET(){const auth=await owner();if(!auth)return Response.json({error:"forbidden"},{status:403});const settings=await auth.db.prepare("SELECT key,value FROM settings").all<{key:string,value:string}>();const values=Object.fromEntries((settings.results??[]).map((x:{key:string,value:string})=>[x.key,x.value]));const items=await auth.db.prepare("SELECT id,title,category,description,file_name AS fileName,media_type AS mediaType FROM portfolio_items ORDER BY id DESC").all();return Response.json({content:{...defaults,...values},items:items.results??[]})}

export async function PUT(request:Request){const auth=await owner();if(!auth)return Response.json({error:"forbidden"},{status:403});const body=await request.json() as Record<string,unknown>;const allowed=["name","nameEn","headline","projectIntro","about"];const statements=allowed.filter(k=>typeof body[k]==="string").map(k=>auth.db.prepare("INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(k,String(body[k]).slice(0,6000)));if(statements.length)await auth.db.batch(statements);return Response.json({ok:true})}
