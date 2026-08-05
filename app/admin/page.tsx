import AdminPanel from "./AdminPanel";
export const dynamic="force-dynamic";
export default function AdminPage(){return <main className="admin-shell"><header className="admin-top"><div><p className="eyebrow">PRIVATE MANAGEMENT</p><h1>网站管理</h1></div><a className="button" href="/">返回网站</a></header><AdminPanel/></main>}
