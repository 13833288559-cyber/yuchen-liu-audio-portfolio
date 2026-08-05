"use client";
import { useEffect,useState } from "react";
type Item={id:number;title:string;category:string;description:string;fileName:string;mediaType:string};

export default function AdminPanel({email}:{email:string}){
 const [content,setContent]=useState({name:"",nameEn:"",headline:"",projectIntro:"",about:""});
 const [items,setItems]=useState<Item[]>([]); const [status,setStatus]=useState("");
 async function load(){const r=await fetch("/api/admin");if(r.ok){const d=await r.json();setContent(d.content);setItems(d.items)}else setStatus("无法进入管理页，请确认使用了首次设置的 ChatGPT 账号。")}
 useEffect(()=>{load()},[]);
 async function save(){setStatus("正在保存…");const r=await fetch("/api/admin",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify(content)});setStatus(r.ok?"文字已保存，公开网站已更新。":"保存失败，请稍后再试。")}
 async function upload(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setStatus("正在上传…");const fd=new FormData(e.currentTarget);const r=await fetch("/api/admin/media",{method:"POST",body:fd});if(r.ok){e.currentTarget.reset();await load();setStatus("作品已上传并在公开页面发布。")}else setStatus("上传失败。请检查文件大小和格式。")}
 async function remove(id:number){if(!confirm("确定删除这件作品吗？"))return;const r=await fetch(`/api/admin/media?id=${id}`,{method:"DELETE"});if(r.ok){await load();setStatus("作品已删除。")}}
 const field=(key:keyof typeof content,label:string,multi=false)=><label>{label}{multi?<textarea value={content[key]} onChange={e=>setContent({...content,[key]:e.target.value})}/>:<input value={content[key]} onChange={e=>setContent({...content,[key]:e.target.value})}/>}</label>;
 return <><div className="admin-panel"><section className="admin-card full"><h2>编辑公开页文字</h2><p className="admin-note">管理账号：{email}。首次成功进入的 ChatGPT 账号将成为本站唯一管理员。</p>{field("name","中文姓名")}{field("nameEn","英文姓名")}{field("headline","首页个人定位",true)}{field("projectIntro","《春秋异闻录》项目介绍",true)}{field("about","关于我",true)}<button onClick={save}>保存文字</button></section><section className="admin-card"><h2>上传新作品</h2><p className="admin-note">支持音频、视频和图片。上传后会自动出现在公开网站的“作品库”中。</p><form onSubmit={upload}><label>作品名称<input name="title" required/></label><label>类别<select name="category"><option>游戏音频</option><option>声音设计</option><option>影视后期</option><option>空间音频</option><option>其他</option></select></label><label>简介<textarea name="description"/></label><label>文件<input name="file" type="file" accept="audio/*,video/*,image/*" required/></label><button type="submit">上传并发布</button></form></section><section className="admin-card"><h2>已发布作品</h2><div className="admin-items">{items.length===0?<p className="admin-note">还没有上传作品。</p>:items.map(i=><div className="admin-item" key={i.id}><div><strong>{i.title}</strong><br/><small>{i.category} · {i.fileName}</small></div><button className="danger" onClick={()=>remove(i.id)}>删除</button></div>)}</div></section></div>{status&&<p className="status" style={{maxWidth:1100,margin:"16px auto"}}>{status}</p>}</>
}
