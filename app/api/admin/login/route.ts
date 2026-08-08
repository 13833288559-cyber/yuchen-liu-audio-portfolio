import {createAdminToken} from "../../../../lib/data";
export const dynamic="force-dynamic";
export async function POST(request:Request){
 const body=await request.json().catch(()=>({})) as {password?:string};
 if(!process.env.ADMIN_PASSWORD||body.password!==process.env.ADMIN_PASSWORD)return Response.json({error:"密码不正确"},{status:401});
 return Response.json({token:createAdminToken()});
}
