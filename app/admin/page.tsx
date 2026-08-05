import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage(){
  const user = await requireChatGPTUser("/admin");
  return <main className="admin-shell"><header className="admin-top"><div><p className="eyebrow">PRIVATE MANAGEMENT</p><h1>网站管理</h1></div><div><a className="button" href="/">返回网站</a> <a className="button" href={chatGPTSignOutPath("/")}>退出</a></div></header><AdminPanel email={user.email}/></main>
}
