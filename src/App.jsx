import { useState, useEffect } from "react";
import profileImg from "./assets/profile.png";

function App() {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [activeExp, setActiveExp] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisibleSections((p) => new Set([...p, e.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-section]").forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const v = (id) => visibleSections.has(id);

  const experiences = [
    {
      role: "Structural Engineer",
      org: "City of Roseville",
      period: "July 2020 — April 2024",
      location: "Roseville, CA",
      work: [
        "Conducted structural analysis and design for over 12 structures, including buildings, bridges, and towers, utilizing engineering principles to ensure their integrity and safety",
        "Developed construction plans and specifications for various projects worth over $100 million, ensuring meticulous consideration of materials, dimensions, and load capacities to deliver robust and cost-effective solutions",
        "Provided technical guidance and support to clients, architects, and contractors, offering expert advice and recommendations on structural design considerations, material selection, and construction methodologies for more than 40 projects",
      ],
    },
    {
      role: "Researcher",
      org: "Institute of Transportation Studies at UC Davis",
      period: "April 2019 — June 2020",
      location: "Davis, CA",
      work: [
        "Assisted with a PhD's dissertation studying the effect of autonomous driving vehicles on road traffic congestion in downtown areas, such as San Francisco, by actively participating in data collection, analysis, and visualization using Python",
        "Contributed to the collection and annotation of parking resources/supplies in multiple studied sites/cities, utilizing open source software such as SUMO (Simulation of Urban MObility) to streamline the process and ensure data compatibility",
      ],
    },
    {
      role: "Structural Engineer Intern",
      org: "City of West Sacramento",
      period: "Sep. 2018 — July 2019",
      location: "West Sacramento, CA",
      work: [
        "Contributed to the collection of engineering and survey data, and actively participated in the draft of design and construction standards for public improvements",
        "Collaborated closely with senior engineers to generate detailed engineering drawings, perform calculations, and validate design specifications",
        "Engaged as an assistant to the City Structural Engineer, actively participated in infrastructure planning and played a key role in designing and preparing plans, specifications, and estimates",
      ],
    },
    {
      role: "Structural Engineer Intern",
      org: "Jacobs Engineering",
      period: "June 2018 — Sep. 2018",
      location: "",
      work: [
        "Thoroughly examined 14 technical manuals (i.e., AISC Steel Manual & ASCE 7), gained a comprehensive understanding of industry codes, regulatory standards, and company policies",
        "Under the direction of a Professional Engineer, performed a variety of basic engineering support assignments that required a fundamental knowledge of design/drafting standards, practices, and techniques",
        "Contributed to the successful completion of 4 bridge and seismic designs and participated in the production of construction plans utilizing industry softwares (MicroStation and AutoCAD Civil 3D)",
      ],
    },
  ];

  const projects = [
    {
      id: 1,
      title: "StructCalc",
      description: "Open-source structural design automation tool. Beam, column, and footing design per ACI 318 and AISC standards.",
      stack: "Python · Streamlit · NumPy",
    },
    {
      id: 2,
      title: "BridgeWatch",
      description: "Real-time bridge health monitoring dashboard with sensor data visualization and anomaly detection.",
      stack: "React · D3.js · Node.js",
    },
    {
      id: 3,
      title: "SitePlan AI",
      description: "ML model generating preliminary grading plans from site survey data and satellite imagery.",
      stack: "Python · TensorFlow · OpenCV",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
          background: #fff; color: #000;
          -webkit-font-smoothing: antialiased;
        }
        ::selection { background: #000; color: #fff; }
        a { color: inherit; text-decoration: none; }

        /* ANIMATIONS */
        .fade-in {
          opacity: 0; transform: translateY(32px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .fade-in.show { opacity: 1; transform: none; }
        .s1 { transition-delay: 0.06s; }
        .s2 { transition-delay: 0.14s; }
        .s3 { transition-delay: 0.22s; }
        .s4 { transition-delay: 0.32s; }

        /* === NAV === */
        /* Same structure: centered horizontal links, uppercase, letter-spaced */
        .header {
          width: 100%;
          padding: 28px 24px;
          display: flex;
          justify-content: center;
          background: #fff;
          position: sticky; top: 0; z-index: 50;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          backdrop-filter: blur(12px);
          background: rgba(255,255,255,0.92);
        }
        .nav {
          display: flex;
          gap: 40px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }
        .nav-link {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #000;
          text-decoration: none;
          padding: 6px 12px;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .nav-link:hover {
          color: #fff;
          background: #000;
        }

        /* === HERO === */
        /* Same structure: full-width black block, centered name, image behind */
        .intro-section {
          width: 100%;
          height: 520px;
          position: relative;
          background: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        .intro-bg {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        /* Subtle structural grid behind the hero name */
        .intro-grid {
          position: absolute; inset: 0; z-index: 1;
          opacity: 0.08;
        }
        .intro-grid line {
          stroke: #fff; stroke-width: 0.5;
        }
        .intro-grid circle {
          fill: #fff;
        }
        .intro-content {
          position: relative; z-index: 3;
          text-align: center;
          color: #fff;
        }
        .intro-name {
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1.1;
          margin-bottom: 16px;
        }
        .intro-tagline {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
        }
        /* Thin line at bottom of hero */
        .intro-line {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 1px; background: rgba(255,255,255,0.1);
        }

        /* === EXPERIENCE === */
        .experience-section {
          width: 100%;
          padding: 80px 24px;
          background: #fff;
        }
        .experience-inner {
          max-width: 900px;
          margin: 0 auto;
        }
        .section-heading {
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 48px;
        }
        .exp-list {
          border-top: 1px solid #e5e5e5;
        }
        .exp-row {
          border-bottom: 1px solid #e5e5e5;
          cursor: pointer;
        }
        .exp-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          transition: padding 0.3s ease;
        }
        .exp-row:hover .exp-top { padding-left: 8px; }
        .exp-top-left {
          display: flex; gap: 24px; align-items: baseline;
        }
        .exp-role-title {
          font-size: 18px; font-weight: 500;
        }
        .exp-org-name {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px; color: #999;
        }
        .exp-period-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px; color: #999;
        }
        .exp-plus {
          font-size: 20px; color: #ccc;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
          flex-shrink: 0;
        }
        .exp-plus.open { transform: rotate(45deg); color: #000; }
        .exp-body {
          max-height: 0; overflow: hidden;
          transition: max-height 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .exp-body.open { max-height: 300px; }
        .exp-body-inner {
          padding: 0 0 24px 0;
        }
        .exp-location {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px; color: #bbb; margin-bottom: 12px;
        }
        .exp-detail {
          font-size: 15px; line-height: 1.8; color: #666;
          padding: 4px 0; display: flex; gap: 10px;
        }
        .exp-detail::before {
          content: '—'; color: #ddd; flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .exp-top { flex-direction: column; align-items: flex-start; gap: 4px; }
          .exp-top-left { flex-direction: column; gap: 2px; }
        }

        /* === PROJECTS === */
        /* Same structure: centered heading + 3-column grid of square cards */
        .projects-section {
          width: 100%;
          padding: 80px 24px;
          background: #fafafa;
        }
        .projects-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .project-card {
          aspect-ratio: 1 / 1;
          border: 1px solid #e5e5e5;
          border-radius: 24px;
          background: #fff;
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.35s ease,
                      border-color 0.35s ease,
                      background 0.35s ease,
                      color 0.35s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .project-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          background: #000;
          color: #fff;
          border-color: #000;
        }
        .project-card-top {}
        .project-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px; color: #ccc;
          letter-spacing: 0.06em; margin-bottom: 16px;
          transition: color 0.35s ease;
        }
        .project-card:hover .project-num { color: rgba(255,255,255,0.3); }
        .project-title {
          font-size: 22px; font-weight: 600;
          letter-spacing: -0.01em; margin-bottom: 12px;
        }
        .project-desc {
          font-size: 14px; line-height: 1.7;
          color: #888;
          transition: color 0.35s ease;
        }
        .project-card:hover .project-desc { color: rgba(255,255,255,0.5); }
        .project-card-bottom {}
        .project-stack {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px; color: #bbb;
          letter-spacing: 0.02em;
          transition: color 0.35s ease;
        }
        .project-card:hover .project-stack { color: rgba(255,255,255,0.35); }
        /* Subtle corner node — structural nod */
        .project-node {
          position: absolute; top: 24px; right: 24px;
          width: 8px; height: 8px; border-radius: 50%;
          border: 1.5px solid #e5e5e5;
          transition: border-color 0.35s ease, background 0.35s ease;
        }
        .project-card:hover .project-node {
          border-color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.3);
        }

        /* === ABOUT === */
        /* Same structure: full-width black section, image left, text right */
        .about-section {
          width: 100%;
          padding: 80px 0;
          background: #000;
          color: #fff;
        }
        .about-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 48px;
          display: flex;
          align-items: flex-start;
          gap: 64px;
        }
        .about-image-wrap {
          flex-shrink: 0;
          width: 280px; height: 360px;
          background: #1a1a1a;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
        }
        .about-image-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px; color: rgba(255,255,255,0.2);
          letter-spacing: 0.06em;
        }
        .about-content {
          max-width: 560px;
        }
        .about-content h2 {
          font-size: 14px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          margin-bottom: 24px; color: #fff;
        }
        .about-content p {
          font-size: 16px; line-height: 1.85;
          color: rgba(255,255,255,0.6);
          margin-bottom: 20px;
        }
        .about-skills {
          margin-top: 32px;
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .about-skill {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px; padding: 6px 14px;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.5);
          transition: all 0.25s ease;
        }
        .about-skill:hover {
          background: #fff; color: #000;
          border-color: #fff;
        }

        @media (max-width: 768px) {
          .about-inner {
            flex-direction: column; padding: 0 24px;
            gap: 40px;
          }
          .about-image-wrap { width: 100%; height: 280px; }
        }

        /* === CONTACT === */
        .contact-section {
          width: 100%;
          padding: 80px 24px;
          background: #fff;
        }
        .contact-inner {
          max-width: 560px;
          margin: 0 auto;
          text-align: center;
        }
        .contact-text {
          font-size: 16px; line-height: 1.7;
          color: #888; margin-bottom: 40px;
        }
        .contact-links {
          display: flex; flex-direction: column; gap: 0;
          text-align: left;
          border-top: 1px solid #e5e5e5;
        }
        .contact-link {
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 0;
          border-bottom: 1px solid #e5e5e5;
          text-decoration: none; color: #000;
          transition: padding-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .contact-link:hover { padding-left: 10px; }
        .contact-link-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px; color: #bbb;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .contact-link-value {
          font-size: 15px; margin-top: 2px;
        }
        .contact-link-arrow {
          font-size: 14px; color: #ccc;
          transition: transform 0.3s ease, color 0.3s ease;
        }
        .contact-link:hover .contact-link-arrow {
          transform: translateX(4px); color: #000;
        }

        /* === FOOTER === */
        .footer {
          width: 100%;
          padding: 24px;
          text-align: center;
          border-top: 1px solid #e5e5e5;
        }
        .footer-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px; color: #ccc;
        }

        /* === HAMBURGER MENU === */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 28px;
          height: 28px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          z-index: 101;
        }
        .hamburger span {
          display: block;
          width: 100%;
          height: 2px;
          background: #000;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .hamburger.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
          background: #fff;
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
          background: #fff;
        }

        .menu-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      visibility 0.35s;
        }
        .menu-overlay.open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
        .menu-overlay-link {
          font-size: 28px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff;
          text-decoration: none;
          padding: 20px 0;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.4s ease, transform 0.4s ease, color 0.2s ease;
        }
        .menu-overlay.open .menu-overlay-link {
          opacity: 1;
          transform: none;
        }
        .menu-overlay.open .menu-overlay-link:nth-child(1) { transition-delay: 0.08s; }
        .menu-overlay.open .menu-overlay-link:nth-child(2) { transition-delay: 0.14s; }
        .menu-overlay.open .menu-overlay-link:nth-child(3) { transition-delay: 0.20s; }
        .menu-overlay.open .menu-overlay-link:nth-child(4) { transition-delay: 0.26s; }
        .menu-overlay.open .menu-overlay-link:nth-child(5) { transition-delay: 0.32s; }
        .menu-overlay-link:hover { color: rgba(255,255,255,0.5); }

        @media (max-width: 768px) {
          .hamburger { display: flex; }
          .header { justify-content: flex-end; }
          .nav { display: none; }
        }

        /* === MOBILE (iPhone 12 Pro: 390×844) === */
        @media (max-width: 480px) {

          /* HERO — reduce height so it doesn't dominate the viewport */
          .intro-section { height: 360px; }
          .intro-tagline { font-size: 11px; letter-spacing: 0.06em; }

          /* EXPERIENCE — tighten padding, allow taller expanded bodies */
          .experience-section { padding: 56px 16px; }
          .section-heading { margin-bottom: 32px; font-size: 13px; }
          .exp-role-title { font-size: 16px; }
          .exp-org-name { font-size: 12px; }
          .exp-period-text { font-size: 11px; }
          .exp-body.open { max-height: 600px; }
          .exp-detail { font-size: 14px; line-height: 1.7; }

          /* PROJECTS — drop the square aspect ratio, tighten padding */
          .projects-section { padding: 56px 16px; }
          .project-card {
            aspect-ratio: auto;
            padding: 24px;
            border-radius: 16px;
          }
          .project-title { font-size: 18px; }
          .project-desc { font-size: 13px; }

          /* ABOUT — tighten inner padding */
          .about-section { padding: 56px 0; }
          .about-inner { padding: 0 16px; gap: 32px; }
          .about-image-wrap { height: auto; border-radius: 12px; }
          .about-image-wrap img { height: auto !important; object-fit: contain !important; }
          .about-content p { font-size: 15px; line-height: 1.75; }
          .about-skill { font-size: 11px; padding: 5px 10px; }

          /* CONTACT — tighten padding */
          .contact-section { padding: 56px 16px; }
          .contact-text { font-size: 15px; margin-bottom: 28px; }
          .contact-link-value { font-size: 14px; }
        }
      `}</style>

      {/* NAV */}
      <header className="header">
        <nav className="nav">
          {["Home", "Experience", "Projects", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-link"
            >
              {item}
            </a>
          ))}
        </nav>
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Mobile menu overlay */}
      <div className={`menu-overlay ${menuOpen ? "open" : ""}`}>
        {["Home", "Experience", "Projects", "About", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="menu-overlay-link"
            onClick={() => setMenuOpen(false)}
          >
            {item}
          </a>
        ))}
      </div>

      {/* HERO — same full-width black block with centered name */}
      <section id="home" className="intro-section">
        {/* Structural grid — subtle engineering nod */}
        <svg className="intro-grid" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice">
          {/* Vertical lines */}
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={520} />
          ))}
          {/* Horizontal lines */}
          {Array.from({ length: 6 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 104} x2={1200} y2={i * 104} />
          ))}
          {/* Node points at intersections */}
          {Array.from({ length: 13 }, (_, i) =>
            Array.from({ length: 6 }, (_, j) => (
              <circle key={`n${i}-${j}`} cx={i * 100} cy={j * 104} r={1.5} />
            ))
          )}
        </svg>

        <div className="intro-content">
          <h1 className="intro-name">Gursewak Singh</h1>
          <div className="intro-tagline">Structural Engineer · Developer</div>
        </div>
        <div className="intro-line" />
      </section>

      {/* EXPERIENCE */}
      <section
        id="experience"
        className="experience-section"
        data-section
      >
        <div className="experience-inner">
          <h2 className={`section-heading fade-in ${v("experience") ? "show" : ""}`}>
            Experience
          </h2>
          <div className={`exp-list fade-in s1 ${v("experience") ? "show" : ""}`}>
            {experiences.map((e, i) => (
              <div
                key={i}
                className="exp-row"
                onClick={() => setActiveExp(activeExp === i ? null : i)}
              >
                <div className="exp-top">
                  <div className="exp-top-left">
                    <span className="exp-role-title">{e.role}</span>
                    <span className="exp-org-name">{e.org}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <span className="exp-period-text">{e.period}</span>
                    <span className={`exp-plus ${activeExp === i ? "open" : ""}`}>+</span>
                  </div>
                </div>
                <div className={`exp-body ${activeExp === i ? "open" : ""}`}>
                  <div className="exp-body-inner">
                    <div className="exp-location">{e.location}</div>
                    {e.work.map((w, j) => (
                      <div key={j} className="exp-detail">{w}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS — same centered heading + grid of square cards */}
      <section
        id="projects"
        className="projects-section"
        data-section
      >
        <div className="projects-inner">
          <h2 className={`section-heading fade-in ${v("projects") ? "show" : ""}`}>
            Projects
          </h2>
          <div className="project-grid">
            {projects.map((p, i) => (
              <div
                key={p.id}
                className={`project-card fade-in s${i + 1} ${v("projects") ? "show" : ""}`}
              >
                <div className="project-card-top">
                  <div className="project-num">0{p.id}</div>
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-desc">{p.description}</p>
                </div>
                <div className="project-card-bottom">
                  <div className="project-stack">{p.stack}</div>
                </div>
                <div className="project-node" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT — same full-width black section, image left + text right */}
      <section
        id="about"
        className="about-section"
        data-section
      >
        <div className={`about-inner fade-in ${v("about") ? "show" : ""}`}>
          <div className="about-image-wrap">
            <img src={profileImg} alt="Gursewak Singh" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="about-content">
            <h2>About Me</h2>
            <p>
              I am Gursewak Singh, a passionate professional with a strong focus on Civil Engineering and Programming. I enjoy combining technical expertise with problem-solving skills to design efficient, innovative solutions. I thrive on tackling challenging projects, continuously learning, and delivering high-quality results. Outside of work, I am curious, detail-oriented, and enjoy exploring new technologies and methods to expand my knowledge and capabilities.
            </p>
            <div className="about-skills">
              {[
                "Structural Analysis", "Seismic Design", "SAP2000", "ETABS",
                "Python", "React", "JavaScript", "AutoCAD", "Revit",
                "Node.js", "SQL", "Git", "MATLAB",
              ].map((s) => (
                <span key={s} className="about-skill">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT — centered, clean */}
      <section
        id="contact"
        className="contact-section"
        data-section
      >
        <div className="contact-inner">
          <h2 className={`section-heading fade-in ${v("contact") ? "show" : ""}`}>
            Contact
          </h2>
          <p className={`contact-text fade-in s1 ${v("contact") ? "show" : ""}`}>
            Interested in working together or just want to connect — reach out.
          </p>
          <div className={`contact-links fade-in s2 ${v("contact") ? "show" : ""}`}>
            {[
              { label: "Email", value: "gursewakgssaini@gmail.com", href: "mailto:gursewakgssaini@gmail.com" },
              { label: "LinkedIn", value: "linkedin.com/in/gursewaksingh", href: "https://linkedin.com" },
              { label: "GitHub", value: "github.com/gursewas", href: "https://github.com/gursewas" },
              { label: "Phone", value: "(916) 837-6535", href: "tel:+19168376535" },
            ].map((c, i) => (
              <a key={i} href={c.href} className="contact-link" target="_blank" rel="noopener noreferrer">
                <div>
                  <div className="contact-link-label">{c.label}</div>
                  <div className="contact-link-value">{c.value}</div>
                </div>
                <span className="contact-link-arrow">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-text">© 2026 Gursewak Singh</div>
      </footer>
    </>
  );
}

export default App;
