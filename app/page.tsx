import Image from "next/image";
import { getPublicData } from "../lib/data";

export const dynamic = "force-dynamic";

const credits = [
  { date: "2025.01 — 2025.04", org: "湖南广播影视集团", role: "音频制作实习生", work: "湖南卫视小年夜春晚 /《你好，星期六》/《歌手 2025》" },
  { date: "2024.09 — 2024.11", org: "网易互娱广州", role: "声音设计师实习生", work: "《暗黑破坏神：不朽》/《天启行动》" },
  { date: "2024.07 — 2024.08", org: "腾讯腾娱互动", role: "音频策划实习生", work: "《穿越火线：枪战王者》" },
];

export default async function Home() {
  const data = await getPublicData();
  const reel = data.items.find((item) => item.mediaType.startsWith("video"));

  return (
    <main id="top">
      <nav className="nav shell">
        <a className="brand" href="#top" aria-label="返回首页"><span>YL</span> YUCHEN LIU</a>
        <div className="navlinks">
          <a href="#work">作品</a><a href="#reel">Showreel</a><a href="#about">关于</a><a href="#contact">联系</a>
        </div>
        <a className="nav-mail" href="mailto:cracrasteve@163.com">AVAILABLE FOR WORK ↗</a>
      </nav>

      <header className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">GAME AUDIO DESIGNER · SOUND DESIGNER</p>
          <h1>为游戏创造<br/><em>会回应玩家</em>的声音。</h1>
          <p className="lead">{data.headline}</p>
          <div className="hero-actions">
            <a className="button primary" href="#work">浏览代表作品</a>
            <a className="text-link" href="#reel">播放 Showreel <span>↓</span></a>
          </div>
        </div>
        <div id="reel" className="reel-panel">
          {reel ? <video controls preload="metadata" src={`/api/media/${reel.id}`} /> : <div className="reel-empty"><div className="play-mark">▶</div><div><strong>SOUND DESIGN REEL</strong><span>作品视频即将上线</span></div></div>}
          <div className="reel-meta"><span>01 / FEATURED</span><span>{reel ? reel.title : "SHOWREEL · 2026"}</span></div>
        </div>
      </header>

      <section id="work" className="section shell">
        <div className="section-title"><p className="eyebrow">SELECTED WORK</p><h2>作品先于履历。</h2><p>声音设计、Wwise 实现与 Unity 联调，覆盖独立游戏音频制作的完整流程。</p></div>

        <article className="case case-main">
          <div className="case-cover spring-cover">
            <div className="cover-copy"><span>STEAM · INDIE GAME · 2026</span><strong>春秋<br/>异闻录</strong></div>
            <div className="wave" aria-hidden="true">{Array.from({length: 34}, (_, i) => <i key={i} style={{height:`${12 + (i * 29) % 96}px`}} />)}</div>
          </div>
          <div className="case-info">
            <div className="case-index">01</div>
            <p className="eyebrow">SOLE AUDIO DESIGNER</p>
            <h3>《春秋异闻录》</h3>
            <p className="case-lead">{data.projectIntro}</p>
            <div className="case-facts"><div><span>职责</span><strong>全部声音设计与实现</strong></div><div><span>团队</span><strong>7 人独立游戏团队</strong></div><div><span>周期</span><strong>2024.10 — 2026.07</strong></div></div>
            <ul><li>设计并交付 800+ 条环境、角色、战斗与交互音效</li><li>从零搭建 Wwise 工程、Event 逻辑与 HDR 动态混音</li><li>完成 Unity 集成、实机调试、性能检查及上线交付</li><li>统筹 13 位配音演员试音、录制对接与资产管理</li></ul>
            <div className="tags"><span>Wwise</span><span>Unity</span><span>Sound Design</span><span>VO Pipeline</span></div>
          </div>
        </article>

        <div className="case-grid">
          <article className="mini-case"><div className="mini-visual spatial"><span>7.1.4</span><i/><i/><i/></div><div className="mini-copy"><p className="eyebrow">IMMERSIVE AUDIO</p><h3>小米汽车座舱演示</h3><p>以多场景声音景观展示 7.1.4 系统的空间层次、移动感与包围感。</p><div className="tags"><span>Spatial Audio</span><span>Mixing</span></div></div></article>
          <article className="mini-case"><div className="mini-visual tools-visual"><span>WORKFLOW<br/>TOOLS</span><small>GEMINI × CODEX</small></div><div className="mini-copy"><p className="eyebrow">AUDIO WORKFLOW</p><h3>音频流程工具</h3><p>制作 Event ID 查询与 Volume–Make-up Gain 参数迁移工具，减少重复操作。</p><div className="tags"><span>Automation</span><span>Vibe Coding</span></div></div></article>
        </div>

        {data.items.length > 0 && <div className="uploads"><div className="subhead"><p className="eyebrow">MEDIA ARCHIVE</p><h2>更多声音作品</h2></div><div className="media-grid">{data.items.map(item => <article className="media-card" key={item.id}>{item.mediaType.startsWith("audio") ? <audio controls preload="metadata" src={`/api/media/${item.id}`}/> : item.mediaType.startsWith("video") ? <video controls preload="metadata" src={`/api/media/${item.id}`}/> : <img src={`/api/media/${item.id}`} alt={item.title}/>}<div><span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div></div>}
      </section>

      <section className="credits-section"><div className="shell"><div className="section-title inverted"><p className="eyebrow">EXPERIENCE & CREDITS</p><h2>项目经历</h2></div><div className="credits">{credits.map((item, i) => <article key={item.org}><span className="credit-no">0{i+1}</span><span className="credit-date">{item.date}</span><div><h3>{item.org}</h3><p>{item.role}</p></div><p className="credit-work">{item.work}</p></article>)}</div></div></section>

      <section id="about" className="section shell about">
        <div className="about-photo"><Image src="/profile.jpg" alt={data.name} width={536} height={798}/><span>{data.nameEn}<br/>BASED IN LONDON</span></div>
        <div className="about-copy"><p className="eyebrow">ABOUT</p><h2>录音工程出身，<br/>专注游戏声音。</h2><p className="about-intro">{data.about}</p><div className="education"><div><span>2025 — 至今</span><strong>University College London</strong><p>MA Designing Audio Experiences</p></div><div><span>2021 — 2025</span><strong>中国传媒大学</strong><p>录音艺术（录音工程方向）· GPA 3.5</p></div></div><div className="tool-line"><span>Wwise</span><span>Unity</span><span>Unreal</span><span>Pro Tools</span><span>Nuendo</span><span>REAPER</span><span>Dante L3</span><span>IELTS 7.0</span></div></div>
      </section>

      <footer id="contact" className="footer"><div className="shell footer-grid"><div><p className="eyebrow">CONTACT</p><h2>一起做些<br/><em>值得被听见</em>的作品。</h2></div><div className="contact-list"><p>游戏音频、声音设计及其他音频项目合作，欢迎联系。</p><a href="mailto:cracrasteve@163.com">cracrasteve@163.com ↗</a><a href="tel:+8613833288559">+86 138 3328 8559</a><a href="https://pan.baidu.com/s/1vIB5QP8jYiN3ApUQpo2nWA" target="_blank" rel="noreferrer">查看现有作品集 ↗</a></div></div><div className="shell footer-bottom"><span>© 2026 YUCHEN LIU</span><span>GAME AUDIO · SOUND DESIGN</span><a href="/admin">网站管理</a></div></footer>
    </main>
  );
}
