/**
 * nav.js — Mega Menu Navbar (v3)
 * แบบ: Mega Menu dropdown กว้างเต็ม viewport
 *       Mobile: accordion toggle
 *       Desktop: hover/focus-within แสดง mega panel
 */
(function () {
  var cfg      = window.NAV_CONFIG || {};
  var active   = cfg.active   || 'home';
  var heroMode = cfg.heroMode !== undefined ? cfg.heroMode : false;

  /* ─────────────────────────────────────────
     INJECT STYLES (scoped, ไม่ต้องแก้ style.css)
  ───────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    /* ── Reset / Base ── */
    '.mm-nav *,.mm-nav *::before,.mm-nav *::after{box-sizing:border-box}',
    '.mm-nav ul{list-style:none;margin:0;padding:0}',
    '.mm-nav a{text-decoration:none}',

    /* ── Navbar shell ── */
    '.mm-nav{',
    '  position:fixed;top:0;left:0;right:0;z-index:1000;',
    '  height:var(--nav-h,72px);',
    '  display:flex;align-items:center;',
    '  background:rgba(247,242,232,.97);',
    '  box-shadow:0 2px 20px rgba(30,20,16,.08);',
    '  backdrop-filter:blur(16px);',
    '  transition:background .3s,box-shadow .3s;',
    '}',
    '.mm-nav.hero-mode{background:transparent;box-shadow:none}',
    '.mm-nav.hero-mode.scrolled{background:rgba(247,242,232,.97);box-shadow:0 2px 20px rgba(30,20,16,.08)}',
    /* Push body down so content isn't hidden under fixed nav (skip for hero-mode pages) */
    'body:not(.has-hero) { padding-top: var(--nav-h, 72px); }',

    /* ── Container ── */
    '.mm-nav__wrap{',
    '  display:flex;justify-content:space-between;align-items:center;',
    '  width:100%;max-width:1280px;margin:0 auto;',
    '  padding:0 24px;',
    '}',

    /* ── Brand / Logo ── */
    '.mm-brand{display:flex;align-items:center;gap:10px;flex-shrink:0;text-decoration:none}',
    '.mm-brand img{width:40px;height:40px;object-fit:contain;border-radius:50%}',
    '.mm-brand-text{font-family:var(--font-serif,"Noto Serif Thai",serif);font-size:1.05rem;font-weight:700;color:var(--ink,#2C1810);line-height:1.2}',
    '.mm-brand-text span{display:block;font-family:var(--font-ui,"Chakra Petch",sans-serif);font-size:.6rem;font-weight:400;letter-spacing:.12em;color:var(--ink-muted,#8B7355);text-transform:uppercase}',
    '.mm-nav.hero-mode .mm-brand-text{color:#fff}',
    '.mm-nav.hero-mode .mm-brand-text span{color:rgba(255,255,255,.7)}',
    '.mm-nav.hero-mode.scrolled .mm-brand-text{color:var(--ink,#2C1810)}',
    '.mm-nav.hero-mode.scrolled .mm-brand-text span{color:var(--ink-muted,#8B7355)}',

    /* ── Desktop nav list ── */
    '.mm-list{display:flex;align-items:center;gap:2px}',

    /* ── Nav item / link ── */
    '.mm-item{position:static}',  /* KEY: static so mega panel anchors to navbar */
    '.mm-link{',
    '  display:flex;align-items:center;gap:5px;',
    '  padding:8px 14px;',
    '  font-family:var(--font-ui,"Chakra Petch",sans-serif);',
    '  font-size:.82rem;font-weight:600;letter-spacing:.04em;',
    '  color:var(--ink-soft,#4A3728);',
    '  border-radius:6px;',
    '  transition:background .2s,color .2s;',
    '  white-space:nowrap;',
    '}',
    '.mm-link:hover,.mm-link.active{color:var(--earth,#8B4513);background:rgba(139,69,19,.07)}',
    '.mm-nav.hero-mode:not(.scrolled) .mm-link{color:rgba(255,255,255,.88)}',
    '.mm-nav.hero-mode:not(.scrolled) .mm-link:hover,.mm-nav.hero-mode:not(.scrolled) .mm-link.active{color:#fff;background:rgba(255,255,255,.15)}',

    /* ── Caret ── */
    '.mm-caret{font-size:.5rem;opacity:.5;transition:transform .25s;display:inline-block}',
    '.mm-item:hover .mm-caret,.mm-item:focus-within .mm-caret{transform:rotate(180deg)}',

    /* ── MEGA PANEL ── */
    '.mm-panel{',
    '  position:absolute;',
    '  top:calc(var(--nav-h,72px) - 1px);',
    '  left:50%;transform:translateX(-50%);',
    '  width:min(900px,90vw);',
    '  background:#fff;',
    '  border:1px solid var(--cream-dark,#E8DDD0);',
    '  border-radius:12px;',
    '  box-shadow:0 12px 40px rgba(30,20,16,.14);',
    '  opacity:0;visibility:hidden;pointer-events:none;',
    '  transition:opacity .22s ease,visibility .22s ease,transform .22s ease;',
    '  transform:translateX(-50%) translateY(8px);',
    '}',
    '.mm-item:hover .mm-panel,',
    '.mm-item:focus-within .mm-panel{opacity:1;visibility:visible;pointer-events:auto;transform:translateX(-50%) translateY(0)}',

    '.mm-panel__inner{padding:28px 28px 24px}',
    '.mm-panel__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}',

    /* ── Column heading ── */
    '.mm-col-heading{',
    '  font-family:var(--font-ui,"Chakra Petch",sans-serif);',
    '  font-size:.68rem;font-weight:700;letter-spacing:.12em;',
    '  text-transform:uppercase;color:var(--ink-muted,#8B7355);',
    '  margin:0 0 12px 10px;',
    '}',

    /* ── Menu links inside panel ── */
    '.mm-panel-link{',
    '  display:flex;align-items:center;gap:12px;',
    '  padding:10px 10px;border-radius:8px;',
    '  color:var(--ink-soft,#4A3728);',
    '  font-size:.9rem;',
    '  transition:background .15s,color .15s;',
    '}',
    '.mm-panel-link:hover{background:var(--cream,#FAF6F0);color:var(--earth,#8B4513)}',
    '.mm-panel-icon{font-size:1.2rem;flex-shrink:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--cream,#FAF6F0);border-radius:8px}',
    '.mm-panel-link:hover .mm-panel-icon{background:rgba(139,69,19,.1)}',
    '.mm-panel-label{display:block;font-weight:600;font-size:.88rem;margin-bottom:2px}',
    '.mm-panel-desc{display:block;font-size:.75rem;color:var(--ink-muted,#8B7355);line-height:1.4}',

    /* ── Feature card (3rd column) ── */
    '.mm-feature{border-radius:10px;overflow:hidden;background:linear-gradient(135deg,var(--earth,#8B4513),#C0652B)}',
    '.mm-feature-img{width:100%;aspect-ratio:16/9;object-fit:cover;opacity:.85;display:block}',
    '.mm-feature-body{padding:16px}',
    '.mm-feature-body h4{color:#fff;font-size:.95rem;margin:0 0 6px;font-family:var(--font-serif,"Noto Serif Thai",serif)}',
    '.mm-feature-body p{color:rgba(255,255,255,.8);font-size:.78rem;margin:0 0 14px;line-height:1.5}',
    '.mm-feature-cta{display:inline-block;padding:6px 16px;background:rgba(255,255,255,.2);color:#fff;border:1px solid rgba(255,255,255,.4);border-radius:99px;font-size:.75rem;font-weight:600;transition:background .2s}',
    '.mm-feature-cta:hover{background:rgba(255,255,255,.35);color:#fff}',

    /* ── Divider ── */
    '.mm-divider{height:1px;background:var(--cream-dark,#E8DDD0);margin:6px 0}',

    /* ── Controls (search, lang, hamburger) ── */
    '.mm-controls{display:flex;align-items:center;gap:8px;flex-shrink:0}',

    /* Search */
    '.mm-search-wrap{position:relative;display:flex;align-items:center}',
    '.mm-search-btn{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--ink-soft,#4A3728);transition:background .2s,color .2s;background:none;border:none;cursor:pointer;padding:0}',
    '.mm-search-btn:hover{background:var(--cream-dark,#E8DDD0);color:var(--earth,#8B4513)}',
    '.mm-nav.hero-mode:not(.scrolled) .mm-search-btn{color:rgba(255,255,255,.8)}',
    '.mm-nav.hero-mode:not(.scrolled) .mm-search-btn:hover{background:rgba(255,255,255,.15);color:#fff}',
    '.mm-search-box{',
    '  position:absolute;right:0;top:calc(100% + 8px);',
    '  display:flex;align-items:center;gap:6px;',
    '  background:#fff;border:1.5px solid var(--earth,#8B4513);border-radius:8px;',
    '  padding:6px 10px;width:240px;',
    '  opacity:0;pointer-events:none;transform:translateY(-6px);',
    '  transition:opacity .2s,transform .2s;',
    '  box-shadow:0 4px 20px rgba(30,20,16,.12);',
    '}',
    '.mm-search-box.open{opacity:1;pointer-events:all;transform:translateY(0)}',
    '.mm-search-box input{flex:1;border:none;outline:none;font-size:.88rem;background:transparent;color:var(--ink,#2C1810)}',
    '.mm-search-submit{background:var(--earth,#8B4513);color:#fff;border:none;border-radius:6px;padding:3px 9px;cursor:pointer;font-size:.85rem;transition:background .2s}',
    '.mm-search-submit:hover{background:#6B3A1F}',

    /* Lang */
    '.mm-lang{display:flex;align-items:center;background:var(--cream-dark,#E8DDD0);border-radius:99px;padding:3px;gap:2px}',
    '.mm-lang-btn{font-family:var(--font-ui,"Chakra Petch",sans-serif);font-size:.64rem;font-weight:600;letter-spacing:.06em;padding:3px 9px;border-radius:99px;color:var(--ink-muted,#8B7355);border:none;background:transparent;cursor:pointer;transition:background .2s,color .2s}',
    '.mm-lang-btn.active{background:var(--earth,#8B4513);color:#fff}',
    '.mm-nav.hero-mode:not(.scrolled) .mm-lang{background:rgba(255,255,255,.15)}',
    '.mm-nav.hero-mode:not(.scrolled) .mm-lang-btn{color:rgba(255,255,255,.7)}',
    '.mm-nav.hero-mode:not(.scrolled) .mm-lang-btn.active{background:rgba(255,255,255,.3);color:#fff}',

    /* Hamburger */
    '.mm-ham{display:none;flex-direction:column;gap:5px;padding:8px;background:none;border:none;cursor:pointer;flex-shrink:0}',
    '.mm-ham span{display:block;width:22px;height:2px;background:var(--ink,#2C1810);border-radius:2px;transition:.3s}',
    '.mm-nav.hero-mode:not(.scrolled) .mm-ham span{background:#fff}',
    '.mm-ham.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}',
    '.mm-ham.open span:nth-child(2){opacity:0}',
    '.mm-ham.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}',

    /* ── MOBILE drawer ── */
    '@media(max-width:991px){',
    '  .mm-list{display:none;flex-direction:column;position:absolute;top:var(--nav-h,72px);left:0;right:0;',
    '    background:rgba(247,242,232,.99);border-top:1px solid var(--cream-dark,#E8DDD0);',
    '    box-shadow:0 8px 24px rgba(30,20,16,.1);padding:12px 0 20px;gap:0}',
    '  .mm-list.open{display:flex}',
    '  .mm-ham{display:flex}',
    '  .mm-link{padding:12px 24px;border-radius:0;font-size:.9rem;width:100%;justify-content:space-between}',
    '  .mm-link:hover,.mm-link.active{background:rgba(139,69,19,.06)}',
    /* Mobile accordion panel */
    '  .mm-panel{',
    '    position:static;transform:none;width:100%;',
    '    border:none;border-radius:0;box-shadow:none;',
    '    background:var(--cream,#FAF6F0);',
    '    opacity:1;visibility:visible;pointer-events:auto;',
    '    max-height:0;overflow:hidden;',
    '    transition:max-height .3s ease;',
    '    border-top:1px solid var(--cream-dark,#E8DDD0);',
    '  }',
    '  .mm-item.open .mm-panel{max-height:600px}',
    '  .mm-panel__inner{padding:12px 20px 16px}',
    '  .mm-panel__grid{grid-template-columns:1fr;gap:0}',
    '  .mm-feature{display:none}',   /* hide feature card on mobile */
    '  .mm-col-heading{margin-left:0;margin-top:12px}',
    '  .mm-caret-mobile{font-size:.5rem;opacity:.5;transition:transform .25s;display:inline-block}',
    '  .mm-item.open .mm-caret-mobile{transform:rotate(180deg)}',
    '}',
    '@media(min-width:992px){',
    '  .mm-caret-mobile{display:none}',
    '}',

    /* Toast */
    '.mm-toast-wrap{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none}',
    '.mm-toast{display:flex;align-items:center;gap:10px;padding:12px 18px;border-radius:10px;font-size:.88rem;',
    '  font-family:var(--font-ui,"Chakra Petch",sans-serif);font-weight:500;',
    '  box-shadow:0 4px 20px rgba(0,0,0,.18);pointer-events:auto;',
    '  transform:translateY(10px);opacity:0;transition:.3s;',
    '}',
    '.mm-toast.show{transform:translateY(0);opacity:1}',
    '.mm-toast.success{background:#2E7D32;color:#fff}',
    '.mm-toast.error{background:#C62828;color:#fff}',
  ].join('');
  document.head.appendChild(style);

  /* ─────────────────────────────────────────
     NAVBAR HTML
  ───────────────────────────────────────── */
  var navHTML = '<div class="mm-toast-wrap" id="mmToastWrap"></div>'
  + '<nav class="mm-nav' + (heroMode ? ' hero-mode' : '') + '" id="mm-navbar">'
  + '<div class="mm-nav__wrap">'

  /* Brand */
  + '<a href="index.html" class="mm-brand">'
  + '<img src="https://charm-of-samutsongkhram-nine.vercel.app/img/logo.png" alt="ภูมิปัญญาสมุทรสงคราม" onerror="this.style.display=\'none\'">'
  + '<div class="mm-brand-text">ภูมิปัญญาสมุทรสงคราม<span>Wisdom of Samutsongkhram</span></div>'
  + '</a>'

  /* Nav list */
  + '<ul class="mm-list" id="mmList">'

  /* หน้าแรก */
  + '<li class="mm-item">'
  + '<a href="index.html" class="mm-link mm-item-home" data-i18n="nav_home">หน้าแรก</a>'
  + '</li>'

  /* คลังภูมิปัญญา — Mega Menu */
  + '<li class="mm-item mm-has-panel" id="mmWisdomItem">'
  + '<a href="wisdom.html" class="mm-link mm-item-wisdom" data-i18n="nav_wisdom">'
  + 'คลังภูมิปัญญา'
  + '<span class="mm-caret">▼</span>'
  + '<span class="mm-caret-mobile">▼</span>'
  + '</a>'
  + '<div class="mm-panel" id="mmWisdomPanel">'
  + '<div class="mm-panel__inner">'
  + '<div class="mm-panel__grid">'

  /* Column 1 */
  + '<div>'
  + '<div class="mm-col-heading">ประวัติและวัฒนธรรม</div>'
  + '<a href="maeklong-history.html" class="mm-panel-link mm-item-history">'
  + '<span class="mm-panel-icon">📜</span>'
  + '<span><span class="mm-panel-label" data-i18n="nav_history">ประวัติศาสตร์ชุมชน</span>'
  + '<span class="mm-panel-desc">Timeline บุคคลสำคัญ สถานที่ประวัติศาสตร์</span></span>'
  + '</a>'
  + '<a href="craft.html" class="mm-panel-link mm-item-craft">'
  + '<span class="mm-panel-icon">🏺</span>'
  + '<span><span class="mm-panel-label" data-i18n="nav_craft">หัตถกรรม &amp; งานฝีมือ</span>'
  + '<span class="mm-panel-desc">จักสาน ทำกะปิ งานไม้ ผ้าทอ</span></span>'
  + '</a>'
  + '</div>'

  /* Column 2 */
  + '<div>'
  + '<div class="mm-col-heading">ธรรมชาติและอาหาร</div>'
  + '<a href="herbs.html" class="mm-panel-link mm-item-herb">'
  + '<span class="mm-panel-icon">🌿</span>'
  + '<span><span class="mm-panel-label" data-i18n="nav_herb">สมุนไพร &amp; พืชพื้นบ้าน</span>'
  + '<span class="mm-panel-desc">ป่าชายเลน ยาพื้นบ้าน สวนสมุนไพร</span></span>'
  + '</a>'
  + '<a href="maeklong-food.html" class="mm-panel-link mm-item-food">'
  + '<span class="mm-panel-icon">🍜</span>'
  + '<span><span class="mm-panel-label" data-i18n="nav_food">อาหารท้องถิ่น</span>'
  + '<span class="mm-panel-desc">กะปิแม่กลอง ปลาทู ขนมโบราณ</span></span>'
  + '</a>'
  + '<div class="mm-divider"></div>'
  + '<a href="wisdom.html" class="mm-panel-link">'
  + '<span class="mm-panel-icon">📚</span>'
  + '<span><span class="mm-panel-label">คลังภูมิปัญญาทั้งหมด</span>'
  + '<span class="mm-panel-desc">สำรวจทุกหมวดหมู่</span></span>'
  + '</a>'
  + '</div>'

  /* Column 3 — Feature */
  + '<div>'
  + '<div class="mm-feature">'
  + '<img class="mm-feature-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Amphawa_Floating_Market.jpg/800px-Amphawa_Floating_Market.jpg" alt="ตลาดน้ำอัมพวา">'
  + '<div class="mm-feature-body">'
  + '<h4>ตลาดน้ำอัมพวา</h4>'
  + '<p>ศูนย์รวมวิถีชีวิตและภูมิปัญญาริมน้ำที่ยังมีชีวิตชีวา</p>'
  + '<a href="activities.html" class="mm-feature-cta">ดูกิจกรรม →</a>'
  + '</div>'
  + '</div>'
  + '</div>'

  + '</div></div></div>'  /* grid / inner / panel */
  + '</li>'

  /* ปฏิทินกิจกรรม */
  + '<li class="mm-item">'
  + '<a href="activities.html" class="mm-link mm-item-activities" data-i18n="nav_activities">ปฏิทินกิจกรรม</a>'
  + '</li>'

  /* ร้านค้าชุมชน */
  + '<li class="mm-item">'
  + '<a href="shops.html" class="mm-link mm-item-shops" data-i18n="nav_shops">ร้านค้าชุมชน</a>'
  + '</li>'

  /* ติดต่อเรา */
  + '<li class="mm-item">'
  + '<a href="contact.html" class="mm-link mm-item-contact" data-i18n="nav_contact">ติดต่อเรา</a>'
  + '</li>'

  + '</ul>'  /* mm-list */

  /* Controls */
  + '<div class="mm-controls">'

  /* Search */
  + '<div class="mm-search-wrap">'
  + '<button class="mm-search-btn" id="mmSearchBtn" aria-label="ค้นหา">'
  + '<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>'
  + '</button>'
  + '<div class="mm-search-box" id="mmSearchBox">'
  + '<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="flex-shrink:0;color:#8B7355"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>'
  + '<input type="text" id="searchInput" data-i18n-attr="placeholder:search_placeholder" placeholder="ค้นหาภูมิปัญญา...">'
  + '<button class="mm-search-submit" id="searchSubmit" data-search-trigger aria-label="ค้นหา">→</button>'
  + '</div>'
  + '</div>'

  /* Lang */
<!-- วางโค้ดนี้ในจุดที่ต้องการให้ปุ่มสลับภาษาแสดงผล -->
<div id="google_translate_element"></div>

<script type="text/javascript">
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'th', 
    includedLanguages: 'en,zh-CN,ja,ko,fr,de', // ใส่รหัสภาษาที่ต้องการให้รองรับ
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}
</script>
<script type="text/javascript" src="//://google.com"></script>


  /* Hamburger */
  + '<button class="mm-ham" id="mmHam" aria-label="เมนู">'
  + '<span></span><span></span><span></span>'
  + '</button>'

  + '</div>'  /* controls */
  + '</div>'  /* wrap */
  + '</nav>';

  /* ─────────────────────────────────────────
     FOOTER HTML (unchanged)
  ───────────────────────────────────────── */
  var footerHTML = '<footer class="footer">'
  + '<div class="container"><div class="footer-grid">'
  + '<div class="footer-brand">'
  + '<div class="footer-logo"><img src="https://charm-of-samutsongkhram-nine.vercel.app/img/logo.png" alt="" onerror="this.style.display=\'none\'"><span>ภูมิปัญญาสมุทรสงคราม</span></div>'
  + '<p data-i18n="footer_tagline">คลังความรู้ภูมิปัญญาท้องถิ่นแห่งเมืองสามน้ำ</p>'
  + '<div class="social-links">'
  + '<a href="https://www.facebook.com/" class="social-link" target="_blank" rel="noopener" aria-label="Facebook"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>'
  + '<a href="https://www.instagram.com/" class="social-link" target="_blank" rel="noopener" aria-label="Instagram"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"/></svg></a>'
  + '<a href="https://line.me/" class="social-link" target="_blank" rel="noopener" aria-label="LINE"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19.952 10.368C19.952 6.44 15.787 3.24 10.667 3.24S1.381 6.44 1.381 10.368c0 3.535 3.134 6.496 7.368 7.06.287.062.677.19.776.436.089.222.058.57.028.794l-.125.75c-.038.222-.175.868.76.473 1.01-.428 5.476-3.225 7.475-5.522 1.378-1.512 2.289-3.207 2.289-5Z"/></svg></a>'
  + '</div></div>'
  + '<div class="footer-col"><h5 data-i18n="footer_wisdom">คลังภูมิปัญญา</h5><ul>'
  + '<li><a href="maeklong-history.html" data-i18n="nav_history">ประวัติศาสตร์ชุมชน</a></li>'
  + '<li><a href="craft.html" data-i18n="nav_craft">หัตถกรรม &amp; งานฝีมือ</a></li>'
  + '<li><a href="herbs.html" data-i18n="nav_herb">สมุนไพรพื้นบ้าน</a></li>'
  + '<li><a href="maeklong-food.html" data-i18n="nav_food">อาหารท้องถิ่น</a></li>'
  + '</ul></div>'
  + '<div class="footer-col"><h5 data-i18n="footer_explore">สำรวจ</h5><ul>'
  + '<li><a href="index.html" data-i18n="nav_home">หน้าแรก</a></li>'
  + '<li><a href="activities.html" data-i18n="nav_activities">ปฏิทินกิจกรรม</a></li>'
  + '<li><a href="shops.html" data-i18n="nav_shops">ร้านค้าชุมชน</a></li>'
  + '<li><a href="provinces.html" data-i18n="footer_map">เลือกจังหวัด</a></li>'
  + '</ul></div>'
  + '<div class="footer-col"><h5 data-i18n="footer_info">ข้อมูล</h5><ul>'
  + '<li><a href="contact.html" data-i18n="nav_contact">ติดต่อเรา</a></li>'
  + '<li><a href="coming-soon.html?page=about" data-i18n="footer_about">เกี่ยวกับโครงการ</a></li>'
  + '<li><a href="coming-soon.html?page=privacy" data-i18n="footer_privacy">นโยบายความเป็นส่วนตัว</a></li>'
  + '</ul></div>'
  + '</div>'
  + '<div class="footer-bottom">'
  + '<span data-i18n="footer_copyright">© 2568 ภูมิปัญญาสมุทรสงคราม. สงวนลิขสิทธิ์.</span>'
  + '<div class="footer-bottom-links">'
  + '<a href="coming-soon.html?page=privacy" data-i18n="footer_privacy">ความเป็นส่วนตัว</a>'
  + '<a href="coming-soon.html?page=terms" data-i18n="footer_terms">เงื่อนไข</a>'
  + '</div></div>'
  + '</div></footer>';

  /* ── INJECT ── */
  document.body.insertAdjacentHTML('afterbegin', navHTML);
  document.body.insertAdjacentHTML('beforeend', footerHTML);

  /* ── hero-mode: tag body so CSS skips padding-top ── */
  if (heroMode) document.body.classList.add('has-hero');

  /* ── i18n re-apply ── */
  if (typeof i18nApply === 'function') i18nApply();

  /* ── Active link ── */
  var activeEl = document.querySelector('.mm-item-' + active);
  if (activeEl) activeEl.classList.add('active');

  /* ── Scroll: hero → solid ── */
  var navbar = document.getElementById('mm-navbar');
  if (heroMode && navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── Hamburger (mobile drawer) ── */
  var ham  = document.getElementById('mmHam');
  var list = document.getElementById('mmList');
  if (ham && list) {
    ham.addEventListener('click', function () {
      ham.classList.toggle('open');
      list.classList.toggle('open');
    });
  }

  /* ── Mobile accordion (click on mm-has-panel link) ── */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('.mm-has-panel > .mm-link');
    if (!link) return;
    var isMobile = window.innerWidth < 992;
    if (isMobile) {
      e.preventDefault();
      link.closest('.mm-has-panel').classList.toggle('open');
    }
  });

  /* ── Close drawer on outside click ── */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#mm-navbar')) {
      if (list) list.classList.remove('open');
      if (ham)  ham.classList.remove('open');
    }
  });

  /* ── Search toggle ── */
  var searchBtn = document.getElementById('mmSearchBtn');
  var searchBox = document.getElementById('mmSearchBox');
  if (searchBtn && searchBox) {
    searchBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      searchBox.classList.toggle('open');
      if (searchBox.classList.contains('open')) {
        var inp = document.getElementById('searchInput');
        if (inp) inp.focus();
      }
    });
  }
  document.addEventListener('click', function (e) {
    if (searchBox && !e.target.closest('.mm-search-wrap')) {
      searchBox.classList.remove('open');
    }
  });

  /* ── Toast (global) ── */
  window.showToast = function (msg, type) {
    type = type || 'success';
    var c = document.getElementById('mmToastWrap');
    if (!c) return;
    var t = document.createElement('div');
    t.className = 'mm-toast ' + type;
    t.innerHTML = '<span>' + (type === 'success' ? '✓' : '⚠') + '</span> ' + msg;
    c.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 30);
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { if (t.parentNode) t.remove(); }, 300);
    }, 3500);
  };

  /* ── Map (global) ── */
  window.openMap = function (lat, lng, name) {
    window.open('https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng
      + '&query_place_name=' + encodeURIComponent(name), '_blank');
  };

  /* ── fade-in observer ── */
  function initFadeIn() {
    if (!window.IntersectionObserver) {
      document.querySelectorAll('.fade-in').forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fade-in').forEach(function (el) { obs.observe(el); });
  }
  initFadeIn();
  setTimeout(initFadeIn, 150);

})();
