/**
 * nav.js — Site Navigation
 * Injects the shared nav bar into every page.
 * Reads window.NAV_CONFIG = { active: 'wisdom'|'food'|'craft'|..., heroMode: bool }
 */

(function () {
  var CFG = window.NAV_CONFIG || {};
  var activeKey = CFG.active || '';
  var heroMode  = !!CFG.heroMode;

  /* ── NAV LINKS definition ── */
  var links = [
    { key: 'home',     href: 'index.html',          label: 'หน้าแรก' },
    { key: 'wisdom',   href: 'Charm.html',           label: 'คลังความรู้' },
    { key: 'food',     href: 'maeklong-food.html',   label: 'อาหาร' },
    { key: 'craft',    href: 'craft.html',           label: 'หัตถกรรม' },
    { key: 'herbs',    href: 'herbs.html',           label: 'สมุนไพร' },
    { key: 'history',  href: 'maeklong-history.html',label: 'ประวัติศาสตร์' },
    { key: 'activity', href: 'activities.html',      label: 'กิจกรรม' },
  ];

  /* ── Build HTML ── */
  var linksHtml = links.map(function (l) {
    var cls = l.key === activeKey ? ' class="active"' : '';
    return '<li><a href="' + l.href + '"' + cls + '>' + l.label + '</a></li>';
  }).join('');

  var navHtml = [
    '<nav class="site-nav' + (heroMode ? ' hero-mode' : '') + '" id="siteNav" role="navigation" aria-label="เมนูหลัก">',
    '  <div class="nav-inner">',
    '    <a href="index.html" class="nav-logo">ภูมิปัญญา<span>สมุทรสงคราม</span></a>',
    '    <ul class="nav-links" id="navLinks">' + linksHtml + '</ul>',
    '    <form class="nav-search-form" role="search" onsubmit="return false">',
    '      <input type="search" id="searchInput" placeholder="ค้นหา..." aria-label="ค้นหา">',
    '      <button type="submit" data-search-trigger aria-label="ส่งการค้นหา">🔍</button>',
    '    </form>',
    '    <button class="nav-hamburger" id="navHamburger" aria-label="เปิด/ปิดเมนู" aria-expanded="false">',
    '      <span></span><span></span><span></span>',
    '    </button>',
    '  </div>',
    '</nav>',
  ].join('\n');

  /* ── Inject before <body> content ── */
  document.body.insertAdjacentHTML('afterbegin', navHtml);

  /* ── Scroll behaviour ── */
  var nav = document.getElementById('siteNav');
  function onScroll() {
    if (window.scrollY > 24) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Hamburger toggle ── */
  var hamburger = document.getElementById('navHamburger');
  var navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
  });

  /* ── Close mobile menu on link click ── */
  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

})();
