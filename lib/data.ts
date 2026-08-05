import { createClient } from "@supabase/supabase-js";

export type PortfolioItem={id:number;title:string;category:string;description:string;mediaKey:string;mediaType:string;fileName:string;placement:string};

export const defaults={
 name:"刘禹辰",nameEn:"YUCHEN LIU",role:"GAME AUDIO DESIGNER · SOUND DESIGNER",
 navWork:"作品",navReel:"Showreel",navAbout:"关于",navContact:"联系",availability:"AVAILABLE FOR WORK ↗",
 heroTitleBefore:"为游戏创造",heroTitleAccent:"会回应玩家",heroTitleAfter:"的声音。",headline:"游戏音频设计师，拥有从声音风格、音效资产到 Wwise 管线、Unity 集成与实机调试的独立游戏音频开发全流程经验。",heroPrimary:"浏览代表作品",heroSecondary:"播放 Showreel",
 reelTitle:"SOUND DESIGN REEL",reelEmpty:"作品视频即将上线",reelLabel:"SHOWREEL · 2026",
 workKicker:"SELECTED WORK",workTitle:"作品先于履历。",workIntro:"声音设计、Wwise 实现与 Unity 联调，覆盖独立游戏音频制作的完整流程。",
 projectMeta:"STEAM · INDIE GAME · 2026",projectName:"《春秋异闻录》",projectRole:"SOLE AUDIO DESIGNER",projectIntro:"2024 年 10 月接手项目，作为 7 人团队的唯一音频成员，负责全部 Wwise 工程和声音设计工作，并于 2026 年 7 月完成正式上线交付。",projectFact1Label:"职责",projectFact1Value:"全部声音设计与实现",projectFact2Label:"团队",projectFact2Value:"7 人独立游戏团队",projectFact3Label:"周期",projectFact3Value:"2024.10 — 2026.07",projectBullets:"设计并交付 800+ 条环境、角色、战斗与交互音效\n从零搭建 Wwise 工程、Event 逻辑与 HDR 动态混音\n完成 Unity 集成、实机调试、性能检查及上线交付\n统筹 13 位配音演员试音、录制对接与资产管理",projectTags:"Wwise, Unity, Sound Design, VO Pipeline",
 spatialKicker:"IMMERSIVE AUDIO",spatialTitle:"小米汽车座舱演示",spatialText:"以多场景声音景观展示 7.1.4 系统的空间层次、移动感与包围感。",spatialTags:"Spatial Audio, Mixing",
 toolsKicker:"AUDIO WORKFLOW",toolsTitle:"音频流程工具",toolsText:"制作 Event ID 查询与 Volume–Make-up Gain 参数迁移工具，减少重复操作。",toolsTags:"Automation, Vibe Coding",toolsVisual:"WORKFLOW TOOLS",toolsCredit:"GEMINI × CODEX",
 mediaKicker:"MEDIA ARCHIVE",mediaTitle:"更多声音作品",
 experienceKicker:"EXPERIENCE & CREDITS",experienceTitle:"项目经历",
 exp1Date:"2025.01 — 2025.04",exp1Org:"湖南广播影视集团",exp1Role:"音频制作实习生",exp1Work:"湖南卫视小年夜春晚 /《你好，星期六》/《歌手 2025》",
 exp2Date:"2024.09 — 2024.11",exp2Org:"网易互娱广州",exp2Role:"声音设计师实习生",exp2Work:"《暗黑破坏神：不朽》/《天启行动》",
 exp3Date:"2024.07 — 2024.08",exp3Org:"腾讯腾娱互动",exp3Role:"音频策划实习生",exp3Work:"《穿越火线：枪战王者》",
 aboutKicker:"ABOUT",aboutTitle:"录音工程出身，专注游戏声音。",about:"我在中国传媒大学接受系统的录音工程训练，现于伦敦大学学院研究空间音频与交互声音。我关注声音与玩家行为之间的关系，也享受把创意制作、技术实现和团队协作连成一条可靠的音频管线。",location:"BASED IN LONDON",
 edu1Date:"2025 — 至今",edu1School:"University College London",edu1Text:"MA Designing Audio Experiences",edu2Date:"2021 — 2025",edu2School:"中国传媒大学",edu2Text:"录音艺术（录音工程方向）· GPA 3.5",skills:"Wwise, Unity, Unreal, Pro Tools, Nuendo, REAPER, Dante L3, IELTS 7.0",
 contactKicker:"CONTACT",contactTitleBefore:"一起做些",contactTitleAccent:"值得被听见",contactTitleAfter:"的作品。",contactIntro:"游戏音频、声音设计及其他音频项目合作，欢迎联系。",email:"cracrasteve@163.com",phone:"+86 138 3328 8559",portfolioLabel:"查看现有作品集 ↗",portfolioUrl:"https://pan.baidu.com/s/1vIB5QP8jYiN3ApUQpo2nWA",footerText:"GAME AUDIO · SOUND DESIGN",
 additionalProjects:"[]",additionalExperiences:"[]",
};
export type Content=typeof defaults;export type SiteData=Content&{items:PortfolioItem[]};
export const contentKeys=Object.keys(defaults) as Array<keyof Content>;

export function supabaseAdmin(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return null;return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}
export async function verifyAdmin(request:Request){const client=supabaseAdmin();const token=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"");if(!client||!token)return null;const {data,error}=await client.auth.getUser(token);if(error||!data.user)return null;const allowed=process.env.ADMIN_EMAIL?.toLowerCase();if(allowed&&data.user.email?.toLowerCase()!==allowed)return null;return{client,user:data.user}}
export async function getPublicData():Promise<SiteData>{try{const client=supabaseAdmin();if(!client)return{...defaults,items:[]};const[{data:settings},{data:items}]=await Promise.all([client.from("settings").select("key,value"),client.from("portfolio_items").select("id,title,category,description,media_key,media_type,file_name,placement").order("id",{ascending:false})]);const values=Object.fromEntries((settings??[]).map(x=>[x.key,x.value]));return{...defaults,...values,items:(items??[]).map(x=>({id:x.id,title:x.title,category:x.category,description:x.description,mediaKey:x.media_key,mediaType:x.media_type,fileName:x.file_name,placement:x.placement||"archive"}))}}catch{return{...defaults,items:[]}}}
