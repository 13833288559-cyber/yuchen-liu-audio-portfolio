import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata():Promise<Metadata>{
  const h=await headers(); const host=h.get("x-forwarded-host")??h.get("host")??"localhost"; const proto=h.get("x-forwarded-proto")??"https"; const base=new URL(`${proto}://${host}`);
  const title="刘禹辰 Yuchen Liu — 游戏音频设计师"; const description="刘禹辰的游戏音频与声音设计个人作品集，涵盖 Wwise、Unity、音效设计、录音与空间音频。";
  return {metadataBase:base,title,description,icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},openGraph:{title,description,type:"website",images:[{url:new URL("/og.png",base).toString(),width:1200,height:630,alt:"Yuchen Liu — Game Audio Designer"}]},twitter:{card:"summary_large_image",title,description,images:[new URL("/og.png",base).toString()]}};
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
