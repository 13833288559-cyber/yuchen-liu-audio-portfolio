import Image from "next/image";
import { getPublicData } from "../lib/data";

export const dynamic = "force-dynamic";

const experience = [
  { org: "网易互娱广州", role: "声音设计师实习生", date: "2024.09 — 2024.11", text: "参与《暗黑破坏神：不朽》与《天启行动》的音效设计、Wwise 工程接入、实机测试与迭代；以英文工单对接暴雪合作团队。" },
  { org: "腾讯腾娱互动", role: "音频策划实习生", date: "2024.07 — 2024.08", text: "参与《穿越火线：枪战王者》音效设计、新版本 CG 声音制作及杜比全景声录音棚的技术调研。" },
  { org: "湖南广播影视集团", role: "音频制作实习生", date: "2025.01 — 2025.04", text: "参与湖南卫视小年夜春晚、《你好，星期六》《歌手2025》等节目的现场扩声与音频制作。" },
];

export default async function Home() {
  const data = await getPublicData();
  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#top">YUCHEN <span>LIU</span></a>
        <div className="navlinks">
          <a href="#work">作品</a><a href="#experience">经历</a><a href="#about">关于</a><a href="#contact">联系</a>
        </div>
      </nav>

      <section id="top" className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">GAME AUDIO DESIGNER · SOUND DESIGNER</p>
          <h1>{data.name}<br/><span>{data.nameEn}</span></h1>
          <p className="lead">{data.headline}</p>
          <div className="hero-actions">
            <a className="button primary" href="#work">查看作品</a>
            <a className="button" href="mailto:cracrasteve@163.com">联系我</a>
          </div>
          <div className="signal" aria-hidden="true">{Array.from({length: 24}, (_, i) => <i key={i} style={{height: `${10 + ((i * 17) % 34)}px`}} />)}</div>
        </div>
        <div className="portrait-wrap">
          <div className="portrait-frame"><Image src="/profile.jpg" alt="刘禹辰" width={536} height={798} priority /></div>
          <div className="stat-card"><strong>800+</strong><span>游戏音效资产</span></div>
          <div className="stat-card second"><strong>FULL PIPELINE</strong><span>Wwise × Unity</span></div>
        </div>
      </section>

      <section className="metrics">
        <div className="shell metric-grid">
          <div><strong>800+</strong><span>音效资产</span></div><div><strong>13</strong><span>位配音演员协作</span></div><div><strong>7.1.4</strong><span>沉浸式声音制作</span></div><div><strong>IELTS 7.0</strong><span>专业英语沟通</span></div>
        </div>
      </section>

      <section id="work" className="section shell">
        <div className="section-head"><p className="eyebrow">SELECTED WORK</p><h2>代表项目</h2><p>从声音设计到引擎实现，负责声音在游戏中真正发生的全过程。</p></div>
        <article className="featured">
          <div className="feature-visual"><div className="visual-grid"/><span className="visual-tag">STEAM INDIE GAME · 2026</span><div className="orb"/></div>
          <div className="feature-copy">
            <p className="eyebrow">LEAD AUDIO / SOUND DESIGN</p><h3>《春秋异闻录》</h3>
            <p>{data.projectIntro}</p>
            <ul><li>独立设计并交付 800+ 条环境、角色、战斗及交互音效</li><li>从零搭建 Wwise 音频管线、Event 逻辑与 HDR 动态混音</li><li>完成 Unity 集成、实机调试、性能检查与上线交付</li><li>统筹 13 位配音演员的试音、录制对接与资产管理</li></ul>
            <div className="tags"><span>Wwise</span><span>Unity</span><span>HDR Mixing</span><span>VO Pipeline</span></div>
          </div>
        </article>

        <div className="work-grid">
          <article className="work-card"><span className="work-no">02</span><p className="eyebrow">IMMERSIVE AUDIO</p><h3>小米汽车 7.1.4 演示音频</h3><p>通过多场景切换与声音景观设计，构建具有空间层次和包围感的座舱试听体验。</p><div className="tags"><span>7.1.4</span><span>Spatial Audio</span></div></article>
          <article className="work-card"><span className="work-no">03</span><p className="eyebrow">WORKFLOW TOOLS</p><h3>音频流程工具</h3><p>借助 Gemini 与 Codex 制作 Event ID 查询、Volume–Make-up Gain 参数迁移工具，减少重复操作。</p><div className="tags"><span>Gemini</span><span>Codex</span><span>Automation</span></div></article>
        </div>

        {data.items.length > 0 && <div className="uploads"><div className="section-head compact"><p className="eyebrow">MEDIA LIBRARY</p><h2>作品库</h2></div><div className="media-grid">{data.items.map(item => <article className="media-card" key={item.id}>{item.mediaType.startsWith("audio") ? <audio controls preload="metadata" src={`/api/media/${item.id}`}/> : item.mediaType.startsWith("video") ? <video controls preload="metadata" src={`/api/media/${item.id}`}/> : <img src={`/api/media/${item.id}`} alt={item.title}/>}<div><span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div></div>}
      </section>

      <section id="experience" className="section dark"><div className="shell"><div className="section-head light"><p className="eyebrow">EXPERIENCE</p><h2>实习与专业经历</h2></div><div className="timeline">{experience.map((e, i) => <article key={e.org}><div className="time-index">0{i+1}</div><div><p className="date">{e.date}</p><h3>{e.org}</h3><h4>{e.role}</h4><p>{e.text}</p></div></article>)}</div></div></section>

      <section id="about" className="section shell about-grid">
        <div><p className="eyebrow">ABOUT</p><h2>录音工程训练，<br/>游戏音频实践。</h2></div>
        <div className="about-copy"><p>{data.about}</p><div className="education"><div><span>2025 — 至今</span><strong>University College London</strong><p>MA Designing Audio Experiences: Art, Science and Production</p></div><div><span>2021 — 2025</span><strong>中国传媒大学</strong><p>录音艺术（录音工程方向）· GPA 3.5</p></div></div></div>
      </section>

      <section className="skills-band"><div className="shell"><p className="eyebrow">TOOLKIT</p><div className="skills-list"><span>Wwise</span><span>Unity</span><span>Unreal Engine</span><span>Pro Tools</span><span>Nuendo</span><span>REAPER</span><span>Foley</span><span>Dante L3</span><span>MATLAB</span></div></div></section>

      <footer id="contact" className="footer"><div className="shell footer-grid"><div><p className="eyebrow">LET'S CREATE SOMETHING THAT SOUNDS ALIVE.</p><h2>期待与你创造<br/>有生命力的声音。</h2></div><div className="contact-list"><a href="mailto:cracrasteve@163.com">cracrasteve@163.com</a><a href="tel:+8613833288559">+86 138 3328 8559</a><a href="https://pan.baidu.com/s/1vIB5QP8jYiN3ApUQpo2nWA" target="_blank" rel="noreferrer">现有作品集 ↗</a></div></div><div className="shell footer-bottom"><span>© 2026 Yuchen Liu</span><a href="/admin">网站管理</a></div></footer>
    </main>
  );
}
