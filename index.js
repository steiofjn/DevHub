<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DiscoDev Scripting Services</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Exo+2:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --dark1: #020c1b;
    --dark2: #0a1f3d;
    --dark3: #0d2b54;
    --mid:   #1a4a7a;
    --light1:#2176ae;
    --light2:#3fa0dc;
    --light3:#7dd3f7;
    --accent:#00d4ff;
    --glow:  #00aaff;
    --text:  #d6f0ff;
    --white: #ffffff;
  }

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Exo 2', sans-serif;
    background: var(--dark1);
    color: var(--text);
    cursor: none;
    overflow-x: hidden;
    min-height: 100vh;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  /* ===== CUSTOM CURSOR ===== */
  #cursor {
    position: fixed;
    width: 28px; height: 28px;
    border: 2px solid var(--accent);
    border-radius: 50%;
    background: transparent;
    pointer-events: none;
    z-index: 99999;
    transform: translate(-50%, -50%);
    transition: transform 0.08s ease;
    box-shadow: 0 0 8px rgba(0,212,255,0.5);
  }
  #cursor.clicking { transform: translate(-50%, -50%) scale(0.7); }

  .spark {
    position: fixed;
    width: 5px; height: 5px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 99998;
    animation: sparkFly 0.55s ease-out forwards;
  }
  @keyframes sparkFly {
    0%   { opacity: 1; transform: translate(0,0) scale(1); }
    100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
  }

  /* ===== HEX CANVAS BACKGROUND ===== */
  #hexCanvas {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 0;
    pointer-events: none;
  }

  /* ===== NAV ===== */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    height: 70px;
    background: rgba(2,12,27,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(0,212,255,0.15);
  }

  .nav-logo {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 1.3rem;
    color: var(--accent);
    text-shadow: 0 0 20px rgba(0,212,255,0.6);
    letter-spacing: 2px;
  }

  .nav-links {
    display: flex;
    gap: 8px;
    list-style: none;
  }

  .nav-links a {
    font-family: 'Exo 2', sans-serif;
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--light3);
    text-decoration: none;
    padding: 8px 20px;
    border-radius: 4px;
    border: 1px solid transparent;
    transition: all 0.25s ease;
    position: relative;
  }
  .nav-links a:hover, .nav-links a.active {
    color: var(--accent);
    border-color: rgba(0,212,255,0.35);
    background: rgba(0,212,255,0.07);
    text-shadow: 0 0 12px rgba(0,212,255,0.5);
  }

  /* ===== PAGE WRAPPER ===== */
  .page {
    display: none;
    position: relative;
    z-index: 1;
    padding-top: 70px;
    min-height: 100vh;
    animation: fadeIn 0.45s ease;
  }
  .page.active { display: block; }
  @keyframes fadeIn {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ===== HERO ===== */
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 120px 40px 80px;
    position: relative;
  }

  .hero-eyebrow {
    font-family: 'Orbitron', monospace;
    font-size: 0.75rem;
    letter-spacing: 5px;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 20px;
    opacity: 0.85;
  }

  .hero h1 {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: clamp(2.5rem, 6vw, 5rem);
    line-height: 1.05;
    color: var(--white);
    text-shadow: 0 0 40px rgba(0,180,255,0.35);
    margin-bottom: 12px;
  }

  .hero h1 span { color: var(--accent); }

  .hero-sub {
    font-family: 'Orbitron', monospace;
    font-size: clamp(1rem, 2.5vw, 1.5rem);
    color: var(--light3);
    letter-spacing: 3px;
    margin-bottom: 28px;
  }

  .hero-desc {
    max-width: 680px;
    font-size: 1.05rem;
    line-height: 1.8;
    color: rgba(214,240,255,0.8);
    margin-bottom: 48px;
  }

  .cta-btn {
    font-family: 'Orbitron', monospace;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 16px 48px;
    background: linear-gradient(135deg, var(--light1), var(--accent));
    color: #000;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    display: inline-block;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 0 30px rgba(0,212,255,0.3);
    cursor: none;
  }
  .cta-btn:hover {
    box-shadow: 0 0 55px rgba(0,212,255,0.7);
    transform: translateY(-3px) scale(1.03);
    background: linear-gradient(135deg, var(--accent), var(--light2));
  }
  .cta-btn:active {
    transform: translateY(0) scale(0.97);
    box-shadow: 0 0 20px rgba(0,212,255,0.4);
  }
  .btn-ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.35);
    transform: scale(0);
    animation: btnRipple 0.5s linear;
    pointer-events: none;
  }
  @keyframes btnRipple {
    to { transform: scale(4); opacity: 0; }
  }

  /* ===== SECTION CONTAINERS ===== */
  .section {
    max-width: 1100px;
    margin: 0 auto;
    padding: 80px 40px;
  }

  .section-title {
    font-family: 'Orbitron', monospace;
    font-weight: 700;
    font-size: clamp(1.4rem, 3vw, 2rem);
    color: var(--accent);
    letter-spacing: 2px;
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(0,212,255,0.4), transparent);
  }

  /* ===== OFFER CARDS ===== */
  .offer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 60px;
  }

  .offer-card {
    background: rgba(10,31,61,0.7);
    border: 1px solid rgba(0,212,255,0.15);
    border-radius: 12px;
    padding: 32px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .offer-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .offer-card:hover {
    border-color: rgba(0,212,255,0.4);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,100,200,0.2);
  }
  .offer-card:hover::before { opacity: 1; }

  .offer-icon {
    font-size: 2rem;
    margin-bottom: 16px;
  }

  .offer-card h3 {
    font-family: 'Orbitron', monospace;
    font-size: 1rem;
    font-weight: 700;
    color: var(--light3);
    letter-spacing: 1px;
    margin-bottom: 16px;
  }

  .offer-card ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .offer-card ul li {
    font-size: 0.9rem;
    color: rgba(214,240,255,0.75);
    padding-left: 16px;
    position: relative;
  }
  .offer-card ul li::before {
    content: '›';
    position: absolute;
    left: 0;
    color: var(--accent);
  }

  /* ===== TECH PILLS ===== */
  .tech-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 60px;
  }
  .tech-pill {
    font-family: 'Orbitron', monospace;
    font-size: 0.8rem;
    letter-spacing: 1.5px;
    padding: 10px 24px;
    border: 1px solid rgba(0,212,255,0.35);
    border-radius: 50px;
    color: var(--accent);
    background: rgba(0,212,255,0.06);
    transition: all 0.25s ease;
  }
  .tech-pill:hover {
    background: rgba(0,212,255,0.15);
    box-shadow: 0 0 20px rgba(0,212,255,0.2);
  }

  /* ===== WHY CHOOSE ===== */
  .why-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 60px;
  }
  .why-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 24px;
    background: rgba(10,31,61,0.5);
    border: 1px solid rgba(0,212,255,0.1);
    border-radius: 10px;
    transition: all 0.25s ease;
  }
  .why-item:hover {
    border-color: rgba(0,212,255,0.3);
    background: rgba(10,31,61,0.8);
  }
  .why-item span.check { font-size: 1.2rem; flex-shrink: 0; margin-top: 2px; }
  .why-item p { font-size: 0.95rem; line-height: 1.5; color: rgba(214,240,255,0.85); }

  /* ===== APPROACH ===== */
  .approach-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 40px;
  }
  .approach-item {
    text-align: center;
    padding: 28px 20px;
    background: rgba(10,31,61,0.6);
    border: 1px solid rgba(0,212,255,0.12);
    border-radius: 10px;
    font-family: 'Orbitron', monospace;
    font-size: 0.9rem;
    color: var(--light3);
    letter-spacing: 1px;
    transition: all 0.25s ease;
  }
  .approach-item:hover {
    background: rgba(0,212,255,0.08);
    border-color: rgba(0,212,255,0.3);
    color: var(--accent);
  }

  /* ===== CTA BANNER ===== */
  .cta-banner {
    text-align: center;
    padding: 100px 40px;
    position: relative;
    overflow: hidden;
  }
  .cta-banner::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(0,150,255,0.1) 0%, transparent 70%);
  }
  .cta-banner h2 {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: clamp(2rem, 5vw, 3.5rem);
    color: var(--white);
    text-shadow: 0 0 40px rgba(0,180,255,0.4);
    margin-bottom: 20px;
    position: relative;
  }
  .cta-banner p {
    font-size: 1.05rem;
    color: rgba(214,240,255,0.75);
    max-width: 560px;
    margin: 0 auto 40px;
    line-height: 1.8;
    position: relative;
  }

  /* ===== ABOUT PAGE ===== */
  .about-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 48px;
  }

  .about-avatar {
    position: static;
    text-align: center;
    width: 100%;
  }
  .avatar-ring {
    width: 200px; height: 200px;
    margin: 0 auto 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--dark3), var(--mid));
    border: 3px solid rgba(0,212,255,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5rem;
    box-shadow: 0 0 50px rgba(0,100,200,0.3), inset 0 0 40px rgba(0,50,120,0.3);
    animation: pulse-avatar 3s ease-in-out infinite;
  }
  @keyframes pulse-avatar {
    0%,100% { box-shadow: 0 0 40px rgba(0,150,255,0.3), inset 0 0 30px rgba(0,50,120,0.2); }
    50%      { box-shadow: 0 0 70px rgba(0,200,255,0.5), inset 0 0 50px rgba(0,100,200,0.3); }
  }
  .about-name {
    font-family: 'Orbitron', monospace;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 2px;
    margin-bottom: 8px;
  }
  .about-role {
    font-size: 0.85rem;
    color: rgba(214,240,255,0.6);
    letter-spacing: 1px;
  }

  .about-content {
    width: 100%;
    max-width: 780px;
    margin: 0 auto;
  }

  .about-content h2 {
    font-family: 'Orbitron', monospace;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: 32px;
    letter-spacing: 2px;
  }
  .about-content p {
    font-size: 1rem;
    line-height: 1.9;
    color: rgba(214,240,255,0.82);
    margin-bottom: 24px;
  }

  .stat-row {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-top: 28px;
    justify-content: center;
  }
  .stat-box {
    flex: 1;
    min-width: 120px;
    padding: 24px 20px;
    background: rgba(10,31,61,0.6);
    border: 1px solid rgba(0,212,255,0.2);
    border-radius: 10px;
    text-align: center;
  }
  .stat-box .num {
    font-family: 'Orbitron', monospace;
    font-size: 2rem;
    font-weight: 900;
    color: var(--accent);
    display: block;
  }
  .stat-box .lbl {
    font-size: 0.78rem;
    letter-spacing: 1px;
    color: rgba(214,240,255,0.55);
    text-transform: uppercase;
    margin-top: 6px;
    display: block;
  }

  /* ===== PRICING PAGE ===== */
  .pricing-intro {
    text-align: center;
    max-width: 720px;
    margin: 0 auto 70px;
    font-size: 1.05rem;
    line-height: 1.85;
    color: rgba(214,240,255,0.78);
  }

  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 28px;
    margin-bottom: 60px;
    align-items: start;
  }

  .price-card {
    background: rgba(10,31,61,0.7);
    border: 1px solid rgba(0,212,255,0.15);
    border-radius: 16px;
    padding: 40px 32px;
    position: relative;
    overflow: hidden;
    transition: all 0.35s ease;
  }
  .price-card.featured {
    border-color: rgba(0,212,255,0.5);
    background: rgba(13,43,84,0.85);
    box-shadow: 0 0 50px rgba(0,100,200,0.2);
  }
  .price-card.featured::after {
    content: 'MOST POPULAR';
    position: absolute;
    top: 20px; right: -28px;
    background: var(--accent);
    color: #000;
    font-family: 'Orbitron', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 2px;
    padding: 5px 40px;
    transform: rotate(35deg);
  }
  .price-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 30px 80px rgba(0,100,200,0.25);
    border-color: rgba(0,212,255,0.4);
  }

  .price-badge {
    font-size: 1.5rem;
    margin-bottom: 12px;
  }
  .price-card h3 {
    font-family: 'Orbitron', monospace;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--light3);
    margin-bottom: 8px;
    letter-spacing: 1px;
  }
  .price-amount {
    font-family: 'Orbitron', monospace;
    font-size: 2.2rem;
    font-weight: 900;
    color: var(--accent);
    margin-bottom: 24px;
    display: block;
  }
  .price-amount span {
    font-size: 1rem;
    color: rgba(214,240,255,0.5);
    font-weight: 400;
  }
  .price-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent);
    margin-bottom: 24px;
  }
  .price-card ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .price-card ul li {
    font-size: 0.9rem;
    color: rgba(214,240,255,0.8);
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .price-card ul li::before {
    content: '✦';
    color: var(--accent);
    font-size: 0.65rem;
    flex-shrink: 0;
    margin-top: 3px;
  }

  .addons-card {
    background: rgba(10,31,61,0.5);
    border: 1px dashed rgba(0,212,255,0.25);
    border-radius: 14px;
    padding: 40px;
    margin-bottom: 40px;
  }
  .addons-card h3 {
    font-family: 'Orbitron', monospace;
    font-size: 1.2rem;
    color: var(--accent);
    margin-bottom: 28px;
    letter-spacing: 2px;
  }
  .addons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  .addon-item {
    padding: 16px 20px;
    background: rgba(0,212,255,0.05);
    border: 1px solid rgba(0,212,255,0.12);
    border-radius: 8px;
    font-size: 0.9rem;
    color: rgba(214,240,255,0.8);
  }
  .addon-item strong {
    display: block;
    color: var(--light3);
    margin-bottom: 4px;
    font-family: 'Exo 2', sans-serif;
    font-weight: 600;
  }
  .addon-price {
    color: var(--accent);
    font-family: 'Orbitron', monospace;
    font-size: 0.85rem;
    font-weight: 700;
  }

  .disclaimer {
    text-align: center;
    font-size: 0.8rem;
    color: rgba(214,240,255,0.4);
    border-top: 1px solid rgba(0,212,255,0.1);
    padding-top: 24px;
    font-style: italic;
  }
  .disclaimer strong { color: rgba(214,240,255,0.6); }

  /* ===== GALLERY PAGE ===== */
  .gallery-intro {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 60px;
    font-size: 1rem;
    line-height: 1.8;
    color: rgba(214,240,255,0.7);
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    margin-bottom: 60px;
  }
  .gallery-card {
    background: rgba(10,31,61,0.7);
    border: 1px solid rgba(0,212,255,0.12);
    border-radius: 14px;
    overflow: hidden;
    transition: all 0.35s ease;
    cursor: none;
  }
  .gallery-card:hover {
    border-color: rgba(0,212,255,0.4);
    transform: translateY(-5px);
    box-shadow: 0 24px 60px rgba(0,100,200,0.25);
  }
  .gallery-preview {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .gallery-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    display: block;
    transition: transform 0.4s ease;
  }
  .gallery-card:hover .gallery-preview img {
    transform: scale(1.04);
  }
  .gallery-preview .code-preview {
    font-family: 'Courier New', monospace;
    font-size: 0.72rem;
    color: rgba(0,212,255,0.7);
    padding: 20px;
    line-height: 1.6;
    white-space: pre;
    text-align: left;
    width: 100%;
  }
  .gallery-preview::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 60px;
    background: linear-gradient(transparent, rgba(10,31,61,0.95));
  }
  .gallery-info {
    padding: 20px 24px 24px;
  }
  .gallery-tag {
    font-family: 'Orbitron', monospace;
    font-size: 0.65rem;
    letter-spacing: 2px;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 8px;
    display: block;
  }
  .gallery-card h3 {
    font-family: 'Orbitron', monospace;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--light3);
    margin-bottom: 8px;
  }
  .gallery-card p {
    font-size: 0.85rem;
    color: rgba(214,240,255,0.6);
    line-height: 1.6;
  }

  /* ===== DIVIDER ===== */
  .section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent);
    margin: 0 40px;
  }

  /* ===== FOOTER ===== */
  footer {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 40px;
    border-top: 1px solid rgba(0,212,255,0.1);
    font-size: 0.82rem;
    color: rgba(214,240,255,0.35);
    letter-spacing: 1px;
  }
  footer span { color: var(--accent); }
</style>
</head>
<body>

<!-- HEX CANVAS -->
<canvas id="hexCanvas"></canvas>

<!-- CURSOR -->
<div id="cursor"></div>

<!-- NAV -->
<nav>
  <div class="nav-logo">DISCODEV</div>
  <ul class="nav-links">
    <li><a href="#" class="active" onclick="showPage('home',this)">Home</a></li>
    <li><a href="#" onclick="showPage('about',this)">About Me</a></li>
    <li><a href="#" onclick="showPage('pricing',this)">Pricing</a></li>
    <li><a href="#" onclick="showPage('gallery',this)">Gallery</a></li>
  </ul>
</nav>

<!-- ===== HOME PAGE ===== -->
<div id="page-home" class="page active">

  <div class="hero">
    <p class="hero-eyebrow">// Professional Scripting Services</p>
    <h1><span>DiscoDev</span><br>Scripting Services</h1>
    <p class="hero-sub">Build Smarter. Scale Faster.</p>
    <p class="hero-desc">With over 11 years of experience, DiscoDev delivers powerful, reliable, and fully customized scripting solutions tailored to your needs. Whether you're launching a community, managing a large-scale server, or developing advanced systems, you'll get clean, efficient code that performs.</p>
    <a href="#" class="cta-btn" onclick="showPage('pricing', document.querySelectorAll('.nav-links a')[2]); addRipple(event);">View Pricing</a>
  </div>

  <div class="section-divider"></div>

  <div class="section">
    <h2 class="section-title">What I Offer in My Discord Bots</h2>
    <div class="offer-grid">
      <div class="offer-card">
        <div class="offer-icon">🤖</div>
        <h3>Discord Bot Development</h3>
        <ul>
          <li>Moderation systems (automod, anti-raid, anti-nuke)</li>
          <li>Ticket systems & support dashboards</li>
          <li>Leveling, economy, and database systems</li>
          <li>Slash commands & advanced interaction handling</li>
          <li>Fully scalable and optimized code</li>
        </ul>
      </div>
      <div class="offer-card">
        <div class="offer-icon">🎮</div>
        <h3>Lua Development</h3>
        <ul>
          <li>Roblox systems & backend logic</li>
          <li>Custom gameplay features</li>
          <li>UI systems and automation</li>
        </ul>
      </div>
      <div class="offer-card">
        <div class="offer-icon">⚙️</div>
        <h3>General Scripting Solutions</h3>
        <ul>
          <li>Need something unique?</li>
          <li>I build tailored systems from scratch to match your exact vision</li>
          <li>No templates, no shortcuts</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="section-divider"></div>

  <div class="section">
    <h2 class="section-title">Languages & Technologies</h2>
    <div class="tech-grid">
      <div class="tech-pill">JavaScript (Node.js)</div>
      <div class="tech-pill">Lua</div>
      <div class="tech-pill">C++</div>
      <div class="tech-pill">Python</div>
    </div>
  </div>

  <div class="section-divider"></div>

  <div class="section">
    <h2 class="section-title">Why Choose DiscoDev?</h2>
    <div class="why-grid">
      <div class="why-item"><span class="check">✅</span><p>11+ years of real scripting experience</p></div>
      <div class="why-item"><span class="check">✅</span><p>Clean, optimized, and maintainable code</p></div>
      <div class="why-item"><span class="check">✅</span><p>Fast delivery & clear communication</p></div>
      <div class="why-item"><span class="check">✅</span><p>Built for performance and scalability</p></div>
    </div>
  </div>

  <div class="section-divider"></div>

  <div class="section">
    <h2 class="section-title">My Approach</h2>
    <p style="color:rgba(214,240,255,0.78);line-height:1.85;margin-bottom:32px;max-width:700px;">Every project starts with understanding your needs. From there, I design and build systems that are:</p>
    <div class="approach-list">
      <div class="approach-item">⚡ Efficient</div>
      <div class="approach-item">🔒 Secure</div>
      <div class="approach-item">🛠 Easy to Manage</div>
      <div class="approach-item">📈 Built to Grow</div>
    </div>
  </div>

  <div class="cta-banner">
    <h2>Let's Build Something Great</h2>
    <p>Whether you're starting from scratch or upgrading an existing system, DiscoDev is here to help bring your ideas to life.</p>
    <a href="https://discord.gg/G5CeyMWhPq" target="_blank" class="cta-btn" onclick="addRipple(event)">Get Started</a>
  </div>
</div>

<!-- ===== ABOUT PAGE ===== -->
<div id="page-about" class="page">
  <div class="section" style="max-width:1000px;">
    <div class="about-wrapper">
      <div class="about-avatar">
        <div class="avatar-ring">👨‍💻</div>
        <p class="about-name">DISCODEV</p>
        <p class="about-role">Full-Stack Script Developer</p>
        <div class="stat-row">
          <div class="stat-box"><span class="num">11+</span><span class="lbl">Years Exp.</span></div>
          <div class="stat-box"><span class="num">22</span><span class="lbl">Years Old</span></div>
        </div>
      </div>

      <div class="about-content">
        <h2>About Me</h2>
        <p>I'm a 22-year-old developer with a passion for building systems that actually work — efficiently, reliably, and at scale. I started scripting at just 11 years old, which gave me a strong foundation early on and years of hands-on experience before most people even begin.</p>
        <p>My journey into coding started with JavaScript, where I was mentored by my dad, who worked in the field. He taught me the fundamentals of programming, problem-solving, and how to think like a developer — skills that still shape the way I build today.</p>
        <p>Throughout high school, I continued developing my skills by taking multiple courses in engineering and computer science. That's where I expanded my knowledge, worked on real projects, and built a deeper understanding of how systems are designed and optimized.</p>
        <p>Now, I focus on creating advanced solutions like Discord bots, automation systems, and custom scripting projects. Everything I build is designed to be clean, scalable, and tailored to the client's needs — no shortcuts, no copy-paste systems.</p>
        <p>What started as curiosity turned into experience, and that experience turned into what I do today.</p>
      </div>
    </div>
  </div>
</div>

<!-- ===== PRICING PAGE ===== -->
<div id="page-pricing" class="page">
  <div class="section">
    <h2 class="section-title">Pricing</h2>
    <p class="pricing-intro">I keep my pricing lower than most because I believe in giving back to the community that helped me grow. Not everyone has the budget for high-end development, and I don't think that should stop someone from bringing their ideas to life. My goal isn't just to make money — it's to support others, help projects succeed, and make quality scripting accessible to everyone who needs it.</p>

    <div class="pricing-grid">
      <div class="price-card">
        <h3>Starter Package</h3>
        <span class="price-amount">400 <span>Robux</span></span>
        <div class="price-divider"></div>
        <ul>
          <li>Ticket system</li>
          <li>Basic moderation (warn, mute, ban)</li>
          <li>Verify system</li>
          <li>Basic setup</li>
        </ul>
      </div>

      <div class="price-card featured">
        <h3>Advanced Package</h3>
        <span class="price-amount">725 <span>Robux</span></span>
        <div class="price-divider"></div>
        <ul>
          <li>Everything in Starter</li>
          <li>Anti-raid system</li>
          <li>Anti-nuke system</li>
          <li>Level system</li>
          <li>Invite tracker</li>
          <li>Full setup + permissions</li>
        </ul>
      </div>

      <div class="price-card">
        <h3>Premium Package</h3>
        <span class="price-amount">1300 <span>Robux</span></span>
        <div class="price-divider"></div>
        <ul>
          <li>Everything above</li>
          <li>Custom commands</li>
          <li>Full server setup (channels + roles)</li>
          <li>UI polish (embeds, buttons, emojis)</li>
          <li>Priority support on all bugs</li>
        </ul>
      </div>
    </div>

    <div class="addons-card">
      <h3>Add-ons</h3>
      <div class="addons-grid">
        <div class="addon-item">
          <strong>Custom Command</strong>
          <span class="addon-price">+100 Robux</span>
        </div>
        <div class="addon-item">
          <strong>UI Redesign</strong>
          <span class="addon-price">+150 Robux</span>
        </div>
        <div class="addon-item">
          <strong>Hosting Help</strong>
          <span class="addon-price">+200 Robux</span>
        </div>
        <div class="addon-item">
          <strong>Emergency Fix</strong>
          <span class="addon-price">+100 Robux</span>
        </div>
      </div>
    </div>

    <p class="disclaimer"><strong>Disclaimer:</strong> All purchases are final and tax is included on all purchases made.</p>
  </div>
</div>

<!-- ===== GALLERY PAGE ===== -->
<div id="page-gallery" class="page">
  <div class="section">
    <h2 class="section-title">Gallery</h2>
    <p class="gallery-intro">A showcase of systems and bots built by DiscoDev. Each project is custom-built from scratch — no templates, no shortcuts.</p>

    <div class="gallery-grid">

      <!-- Screenshot: Designer Application flow -->
      <div class="gallery-card">
        <div class="gallery-preview" style="background:#111;padding:0;">
          <img src="Screen Shot 2026-04-03 at 4.15.08 PM.png" alt="Designer Application" style="width:100%;height:100%;object-fit:cover;object-position:top;">
        </div>
        <div class="gallery-info">
          <span class="gallery-tag">Discord Bot · Live</span>
          <h3>Designer Application System</h3>
          <p>Full DM-based application flow — instructions, Q&amp;A collection, image submission, and staff review with approve/deny buttons.</p>
        </div>
      </div>

      <!-- Screenshot: Questions embed -->
      <div class="gallery-card">
        <div class="gallery-preview" style="background:#111;padding:0;">
          <img src="Screen Shot 2026-04-03 at 4.16.22 PM.png" alt="Application Questions" style="width:100%;height:100%;object-fit:cover;object-position:top;">
        </div>
        <div class="gallery-info">
          <span class="gallery-tag">Discord Bot · Live</span>
          <h3>Multi-Step Application Flow</h3>
          <p>10-question guided DM interview with answer collection, state tracking, and clean embedded formatting throughout.</p>
        </div>
      </div>

      <!-- Screenshot: Almost there + image prompt -->
      <div class="gallery-card">
        <div class="gallery-preview" style="background:#111;padding:0;">
          <img src="Screen Shot 2026-04-03 at 4.16.29 PM.png" alt="Portfolio submission" style="width:100%;height:100%;object-fit:cover;object-position:center;">
        </div>
        <div class="gallery-info">
          <span class="gallery-tag">Discord Bot · Live</span>
          <h3>Portfolio Image Submission</h3>
          <p>Prompts applicants to submit portfolio images after answering questions, with validation before forwarding.</p>
        </div>
      </div>

      <!-- Screenshot: Staff review panel -->
      <div class="gallery-card">
        <div class="gallery-preview" style="background:#111;padding:0;">
          <img src="Screen Shot 2026-04-03 at 4.17.15 PM.png" alt="Staff Review Panel" style="width:100%;height:100%;object-fit:cover;object-position:top;">
        </div>
        <div class="gallery-info">
          <span class="gallery-tag">Discord Bot · Live</span>
          <h3>Staff Review & Approval Panel</h3>
          <p>Applications forwarded to a log channel with embedded answers, portfolio images, and interactive Approve / Deny buttons for staff.</p>
        </div>
      </div>

      <!-- Screenshot: Approval DM -->
      <div class="gallery-card">
        <div class="gallery-preview" style="background:#111;padding:0;">
          <img src="Screen Shot 2026-04-03 at 4.17.30 PM.png" alt="Approval Message" style="width:100%;height:100%;object-fit:cover;object-position:center;">
        </div>
        <div class="gallery-info">
          <span class="gallery-tag">Discord Bot · Live</span>
          <h3>Automated Approval DM</h3>
          <p>On approval, the bot automatically DMs the applicant a personalised congratulations message and assigns the Designer role.</p>
        </div>
      </div>

      <!-- Screenshot: Support ticket panel -->
      <div class="gallery-card">
        <div class="gallery-preview" style="background:#111;padding:0;">
          <img src="Screen Shot 2026-04-03 at 8.54.29 PM.png" alt="Support Panel" style="width:100%;height:100%;object-fit:cover;object-position:top;">
        </div>
        <div class="gallery-info">
          <span class="gallery-tag">Discord Bot · Live</span>
          <h3>Support Dashboard Panel</h3>
          <p>Full branded ticket panel with select-menu routing across General, IA, and Management support — with header images and rich embeds.</p>
        </div>
      </div>

      <!-- Security: Anti-Raid -->
      <div class="gallery-card">
        <div class="gallery-preview" style="background:linear-gradient(135deg,#020c1b,#0d2b54);">
          <div class="code-preview">// 🚨 RAID DETECTED — AUTO LOCKDOWN
recentJoins.push(Date.now());
recentJoins = recentJoins.filter(
  t => Date.now() - t &lt; RAID_TIME_WINDOW);

if (recentJoins.length >= RAID_JOIN_THRESHOLD) {
  raidMode = true;
  // Delete all invites
  invites.forEach(inv => inv.delete());
  // Lock all channels
  guild.channels.cache.forEach(ch =>
    ch.permissionOverwrites.edit(
      everyone, { SendMessages: false }));
  // Ban raid members
  recentMembers.forEach(m =>
    m.ban({ reason: "Raid auto-ban" }));
}</div>
        </div>
        <div class="gallery-info">
          <span class="gallery-tag">Security · Anti-Raid</span>
          <h3>Anti-Raid Lockdown System</h3>
          <p>Detects mass joins within a time window, wipes invites, locks all channels, and auto-bans raiders — then auto-unlocks after 10 minutes.</p>
        </div>
      </div>

      <!-- Security: Anti-Nuke -->
      <div class="gallery-card">
        <div class="gallery-preview" style="background:linear-gradient(135deg,#020c1b,#0a1f3d);">
          <div class="code-preview">// 🛡️ ANTI-NUKE TRACKER
function trackNukeAction(guild, userId, reason) {
  const data = antiNukeTracker.get(userId);
  data.count++;
  // Triggers after 3 destructive actions
  // within a 10-second window
  if (data.count >= NUKER_THRESHOLD) {
    member.ban({ reason: `Anti-Nuke: ${reason}` });
    logChannel.send(
      `🚨 Nuker banned: &lt;@${userId}&gt;`);
    // Lock server immediately
    guild.channels.cache.forEach(ch =>
      ch.permissionOverwrites.edit(
        everyone, { SendMessages: false }));
  }
}</div>
        </div>
        <div class="gallery-info">
          <span class="gallery-tag">Security · Anti-Nuke</span>
          <h3>Anti-Nuke Protection</h3>
          <p>Tracks mass bans, channel deletions, role wipes, and webhook abuse — auto-bans the executor and locks the server within seconds.</p>
        </div>
      </div>

      <!-- Automod showcase -->
      <div class="gallery-card">
        <div class="gallery-preview" style="background:linear-gradient(135deg,#020c1b,#0d2b54);">
          <div class="code-preview">// 🤖 AUTOMOD ENGINE
// Spam → 10min timeout
if (filtered.length >= spamLimit)
  member.timeout(10 * 60 * 1000);

// Mass mention → 15min timeout
if (mentionCount > MASS_MENTION_LIMIT)
  member.timeout(15 * 60 * 1000);

// Banned word → 30min + DM warning
if (bannedWords.includes(normalized))
  member.timeout(30 * 60 * 1000);

// Also detects:
// ✦ Discord invite links
// ✦ Zalgo / unicode abuse
// ✦ Repeated character spam
// ✦ Excessive caps (70%+ threshold)
// ✦ Emoji spam (&gt;10 emojis)</div>
        </div>
        <div class="gallery-info">
          <span class="gallery-tag">Security · Automod</span>
          <h3>Full Automod Engine</h3>
          <p>7-layer message filtering covering spam, invite links, mass mentions, banned words, zalgo text, caps abuse, and emoji flooding — all with logging.</p>
        </div>
      </div>

      <!-- Ticket System code -->
      <div class="gallery-card">
        <div class="gallery-preview" style="background:linear-gradient(135deg,#020c1b,#0a1f3d);">
          <div class="code-preview">// 🎫 TICKET SYSTEM v2
const channel = await guild.channels.create({
  name: `🔴-general-${cleanName}`,
  type: ChannelType.GuildText,
  parent: TICKET_CATEGORY,
  permissionOverwrites: [
    { id: guild.id,
      deny: [ViewChannel] },
    { id: user.id,
      allow: [ViewChannel, SendMessages] },
    { id: TICKET_SUPPORT_ROLE,
      allow: [ViewChannel, SendMessages] }
  ]
});</div>
        </div>
        <div class="gallery-info">
          <span class="gallery-tag">Discord Bot</span>
          <h3>Advanced Ticket System</h3>
          <p>Select-menu ticket creation with permission-locked channels, claim/close flow, full transcript logging, and three support categories.</p>
        </div>
      </div>

      <!-- XP Level System -->
      <div class="gallery-card">
        <div class="gallery-preview" style="background:linear-gradient(135deg,#020c1b,#0d2b54);">
          <div class="code-preview">// ⭐ XP & LEVEL SYSTEM
user.xp += Math.floor(Math.random()*10)+5;
const requiredXP = user.level * 100;

if (user.xp >= requiredXP) {
  user.xp -= requiredXP;
  user.level += 1;
  channel.send(
    `🎉 ${author} leveled up to Lv ${user.level}!`
  );
}
// Leaderboard: /leaderboard
// Check level: /mylevel
// Max level cap: 100</div>
        </div>
        <div class="gallery-info">
          <span class="gallery-tag">Discord Bot</span>
          <h3>XP & Leveling System</h3>
          <p>Persistent XP system with random gain per message, level-up announcements, leaderboard command, and a configurable max-level cap.</p>
        </div>
      </div>

      <!-- Lua / Roblox -->
      <div class="gallery-card">
        <div class="gallery-preview" style="background:linear-gradient(135deg,#020c1b,#0a1f3d);">
          <div class="code-preview">-- 🎮 ROBLOX DATASTORE MODULE
local DS = game:GetService("DataStoreService")
local Store = DS:GetDataStore("PlayerData_v3")

game.Players.PlayerAdded:Connect(function(plr)
  local data = Store:GetAsync(plr.UserId) or {
    coins = 0, level = 1, xp = 0
  }
  -- Apply to player leaderstats
  setupLeaderstats(plr, data)
end)

-- Auto-save on leave
game.Players.PlayerRemoving:Connect(
  function(plr) Store:SetAsync(...) end)</div>
        </div>
        <div class="gallery-info">
          <span class="gallery-tag">Lua / Roblox</span>
          <h3>DataStore Player System</h3>
          <p>Persistent player data with auto-save on leave, version control, and error-safe async handling for Roblox games.</p>
        </div>
      </div>

    </div>
  </div>
</div>

<footer>
  <p>© 2025 <span>DiscoDev</span> Scripting Services — All rights reserved.</p>
</footer>

<script>
// ===== PAGE NAVIGATION =====
function showPage(id, linkEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (linkEl) linkEl.classList.add('active');
  window.scrollTo(0, 0);
  return false;
}

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

document.addEventListener('mousedown', e => {
  cursor.classList.add('clicking');
  spawnSparks(e.clientX, e.clientY);
});

document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

// ===== SPARKS =====
const sparkColors = ['#00d4ff','#3fa0dc','#7dd3f7','#ffffff','#2176ae','#00aaff'];

function spawnSparks(x, y) {
  const count = 10 + Math.floor(Math.random() * 6);
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
    const dist = 30 + Math.random() * 45;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    const size = 3 + Math.random() * 4;
    spark.style.cssText = `
      left:${x}px; top:${y}px;
      background:${color};
      width:${size}px; height:${size}px;
      --tx:${tx}px; --ty:${ty}px;
      box-shadow: 0 0 6px ${color};
    `;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 560);
  }
}

// ===== BUTTON RIPPLE =====
function addRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement('span');
  ripple.className = 'btn-ripple';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 520);
}

// ===== WAVE LINE BACKGROUND =====
const canvas = document.getElementById('hexCanvas');
const ctx = canvas.getContext('2d');
let W, H;

function initCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

// Colour palette for the wave bands — dark blues with hints of teal/cyan
const WAVE_COLORS = [
  [2,   10,  28],   // near-black navy
  [8,   28,  65],   // deep blue
  [14,  55, 105],   // mid blue
  [22,  90, 150],   // bright blue
  [35, 140, 200],   // sky blue
  [55, 185, 230],   // light cyan-blue
];

function lerp(a, b, t) { return a + (b - a) * t; }

function getWaveColor(t) {
  // t in [0,1] — map across palette
  const idx = t * (WAVE_COLORS.length - 1);
  const lo  = Math.floor(idx);
  const hi  = Math.min(lo + 1, WAVE_COLORS.length - 1);
  const f   = idx - lo;
  return [
    Math.round(lerp(WAVE_COLORS[lo][0], WAVE_COLORS[hi][0], f)),
    Math.round(lerp(WAVE_COLORS[lo][1], WAVE_COLORS[hi][1], f)),
    Math.round(lerp(WAVE_COLORS[lo][2], WAVE_COLORS[hi][2], f)),
  ];
}

function drawWave(ts) {
  ctx.clearRect(0, 0, W, H);

  // Dark base fill
  ctx.fillStyle = '#020a1c';
  ctx.fillRect(0, 0, W, H);

  const t = ts * 0.001;

  // Draw multiple wave "ribbons" stacked vertically
  // Each ribbon is a filled band between two sine curves
  const RIBBON_COUNT = 18;

  for (let i = 0; i < RIBBON_COUNT; i++) {
    const progress = i / (RIBBON_COUNT - 1); // 0 → 1 top to bottom

    // Each ribbon's vertical center — spread across full height
    const centerY = H * 0.05 + H * 0.9 * progress;

    // Wave parameters vary per ribbon for organic feel
    const amp      = 28 + Math.sin(i * 0.7) * 18;      // amplitude
    const freq     = 0.004 + i * 0.00015;               // spatial freq
    const speed    = 0.38 + i * 0.03;                   // wave speed
    const offset   = i * 1.1;                           // phase offset
    const thickness = 3 + Math.sin(i * 0.5) * 2;       // ribbon thickness

    // Colour: lighter ribbons toward center of screen
    const colorT = 1 - Math.abs(progress - 0.5) * 1.6;
    const clampedT = Math.max(0, Math.min(1, colorT));
    const [r, g, b] = getWaveColor(clampedT);

    // Opacity: brighter in the middle bands
    const opacity = 0.25 + clampedT * 0.55;

    // Build wave path
    ctx.beginPath();
    for (let x = 0; x <= W; x += 2) {
      // Two overlapping sine waves for organic shape
      const y = centerY
        + Math.sin(x * freq + t * speed + offset) * amp
        + Math.sin(x * freq * 1.7 + t * speed * 0.6 + offset + 1.4) * (amp * 0.3);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }

    ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`;
    ctx.lineWidth   = thickness;
    ctx.shadowColor = `rgba(${r},${g},${b},${opacity * 0.6})`;
    ctx.shadowBlur  = 8 + clampedT * 12;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

let hexes = []; // keep for compatibility — unused now
function initHexes() { initCanvas(); }

function animate(ts) {
  drawWave(ts);
  requestAnimationFrame(animate);
}

window.addEventListener('resize', initCanvas);
initCanvas();
requestAnimationFrame(animate);
</script>
</body>
</html>
