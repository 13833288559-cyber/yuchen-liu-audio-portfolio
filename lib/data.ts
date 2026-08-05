import { createClient } from "@supabase/supabase-js";

export type PortfolioItem = { id:number; title:string; category:string; description:string; mediaKey:string; mediaType:string; fileName:string };
export type SiteData = { name:string; nameEn:string; headline:string; projectIntro:string; about:string; items:PortfolioItem[] };

export const defaults: Omit<SiteData,"items"> = {
  name: "刘禹辰",
  nameEn: "YUCHEN LIU",
  headline: "游戏音频设计师，拥有从声音风格、音效资产到 Wwise 管线、Unity 集成与实机调试的独立游戏音频开发全流程经验。",
  projectIntro: "2024 年 10 月接手项目，作为 7 人团队的唯一音频成员，负责全部 Wwise 工程和声音设计工作，并于 2026 年 7 月完成正式上线交付。",
  about: "我在中国传媒大学接受系统的录音工程训练，现于伦敦大学学院研究空间音频与交互声音。我关注声音与玩家行为之间的关系，也享受把创意制作、技术实现和团队协作连成一条可靠的音频管线。",
};

export function supabaseAdmin(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return null;
  return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}

export async function verifyAdmin(request:Request){
  const client=supabaseAdmin();
  const token=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
  if(!client||!token)return null;
  const {data,error}=await client.auth.getUser(token);
  if(error||!data.user)return null;
  const allowed=process.env.ADMIN_EMAIL?.toLowerCase();
  if(allowed&&data.user.email?.toLowerCase()!==allowed)return null;
  return {client,user:data.user};
}

export async function getPublicData(): Promise<SiteData> {
  try{
    const client=supabaseAdmin();
    if(!client)return {...defaults,items:[]};
    const [{data:settings},{data:items}]=await Promise.all([
      client.from("settings").select("key,value"),
      client.from("portfolio_items").select("id,title,category,description,media_key,media_type,file_name").order("id",{ascending:false}),
    ]);
    const values=Object.fromEntries((settings??[]).map(x=>[x.key,x.value]));
    return {...defaults,...values,items:(items??[]).map(x=>({id:x.id,title:x.title,category:x.category,description:x.description,mediaKey:x.media_key,mediaType:x.media_type,fileName:x.file_name}))};
  }catch{return {...defaults,items:[]}}
}
