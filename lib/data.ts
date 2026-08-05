import { env } from "cloudflare:workers";

export type PortfolioItem = { id:number; title:string; category:string; description:string; mediaKey:string; mediaType:string; fileName:string };
export type SiteData = { name:string; nameEn:string; headline:string; projectIntro:string; about:string; items:PortfolioItem[] };

export const defaults: Omit<SiteData,"items"> = {
  name: "刘禹辰",
  nameEn: "YUCHEN LIU",
  headline: "游戏音频设计师，拥有从声音风格、音效资产到 Wwise 管线、Unity 集成与实机调试的独立游戏音频开发全流程经验。",
  projectIntro: "2024 年 10 月接手项目，作为 7 人团队的唯一音频成员，负责全部 Wwise 工程和声音设计工作，并于 2026 年 7 月完成正式上线交付。",
  about: "我在中国传媒大学接受系统的录音工程训练，现于伦敦大学学院研究空间音频与交互声音。我关注声音与玩家行为之间的关系，也享受把创意制作、技术实现和团队协作连成一条可靠的音频管线。",
};

export async function ensureSchema(db: D1Database) {
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS portfolio_items (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, category TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', media_key TEXT NOT NULL, media_type TEXT NOT NULL, file_name TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE TABLE IF NOT EXISTS site_owner (id INTEGER PRIMARY KEY CHECK (id = 1), email TEXT NOT NULL)"),
  ]);
}

export async function getPublicData(): Promise<SiteData> {
  try {
    const db = env.DB as D1Database | undefined;
    if (!db) return {...defaults,items:[]};
    await ensureSchema(db);
    const settings = await db.prepare("SELECT key, value FROM settings").all<{key:string,value:string}>();
    const values = Object.fromEntries((settings.results ?? []).map((x:{key:string,value:string}) => [x.key,x.value]));
    const items = await db.prepare("SELECT id,title,category,description,media_key AS mediaKey,media_type AS mediaType,file_name AS fileName FROM portfolio_items ORDER BY id DESC").all<PortfolioItem>();
    return {...defaults,...values,items:items.results ?? []};
  } catch { return {...defaults,items:[]}; }
}

export async function requireOwner(email:string) {
  const db = env.DB as D1Database | undefined;
  if (!db) throw new Error("Database unavailable");
  await ensureSchema(db);
  const owner = await db.prepare("SELECT email FROM site_owner WHERE id=1").first<{email:string}>();
  if (!owner) await db.prepare("INSERT INTO site_owner (id,email) VALUES (1,?)").bind(email).run();
  else if (owner.email.toLowerCase() !== email.toLowerCase()) throw new Error("FORBIDDEN");
  return db;
}
