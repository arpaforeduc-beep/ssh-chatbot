/**
 * i18n.js — Language System TH / EN  (v2 — bug-fixed)
 *
 * BUG FIX: i18nApply() วิ่งตอน DOMContentLoaded แต่ navbar ยังไม่ถูก inject
 *          nav.js เรียก i18nApply() อีกรอบหลัง inject → แก้ปัญหานี้แล้ว
 *
 * Usage:
 *   data-i18n="key"                    → แทน textContent
 *   data-i18n-attr="placeholder:key"   → แทน attribute
 *   data-i18n-html="key"               → แทน innerHTML (ระวัง XSS)
 */

var I18N = {
  th: {
    nav_home:       'หน้าแรก',
    nav_Charm:     'คลังภูมิปัญญา',
    nav_history:    'ประวัติศาสตร์ชุมชน',
    nav_craft:      'หัตถกรรม & งานฝีมือ',
    nav_herb:       'สมุนไพร & พืชพื้นบ้าน',
    nav_food:       'อาหารท้องถิ่น',
    nav_activities: 'ปฏิทินกิจกรรม',
    nav_shops:      'ร้านค้าชุมชน',
    nav_contact:    'ติดต่อเรา',
    search_placeholder: 'ค้นหาภูมิปัญญา...',
    footer_tagline:  'คลังความรู้ภูมิปัญญาท้องถิ่นแห่งเมืองสามน้ำ',
    footer_Charm:   'คลังภูมิปัญญา',
    footer_explore:  'สำรวจ',
    footer_info:     'ข้อมูล',
    footer_map:      'เลือกจังหวัด',
    footer_about:    'เกี่ยวกับโครงการ',
    footer_privacy:  'นโยบายความเป็นส่วนตัว',
    footer_copyright:'© 2569 ภูมิปัญญาท้องถิ่นจังหวัดสมุทรสงคราม. สงวนลิขสิทธิ์.',
    footer_terms:    'เงื่อนไข',
    btn_readmore:    'อ่านเพิ่มเติม',
    btn_back_home:   'กลับหน้าแรก',
    breadcrumb_home:   'หน้าแรก',
    breadcrumb_Charm: 'คลังภูมิปัญญา',
  },
  en: {
    nav_home:       'Home',
    nav_Charm:     'Charm Archive',
    nav_history:    'Community History',
    nav_craft:      'Crafts & Handicrafts',
    nav_herb:       'Herbs & Local Plants',
    nav_food:       'Local Cuisine',
    nav_activities: 'Events Calendar',
    nav_shops:      'Community Shops',
    nav_contact:    'Contact',
    search_placeholder: 'Search Charm...',
    footer_tagline:  'Local Charm archive of the Three Waters City',
    footer_Charm:   'Charm Archive',
    footer_explore:  'Explore',
    footer_info:     'Information',
    footer_map:      'Choose Province',
    footer_about:    'About the Project',
    footer_privacy:  'Privacy Policy',
    footer_copyright:'© 2025 Charm of Samutsongkhram. All rights reserved.',
    footer_terms:    'Terms',
    btn_readmore:    'Read More',
    btn_back_home:   'Back to Home',
    breadcrumb_home:   'Home',
    breadcrumb_Charm: 'Charm Archive',
  }
};

function i18nGet(key) {
  var lang = localStorage.getItem('lang') || 'th';
  return (I18N[lang] && I18N[lang][key]) || (I18N['th'][key]) || key;
}

function i18nApply() {
  var lang = localStorage.getItem('lang') || 'th';
  document.documentElement.lang = lang === 'en' ? 'en' : 'th';

  /* textContent */
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var val = I18N[lang] && I18N[lang][el.getAttribute('data-i18n')];
    if (val) el.textContent = val;
  });

  /* attributes e.g. placeholder:search_placeholder */
  document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
    el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
      var parts = pair.trim().split(':');
      var attr  = parts[0].trim();
      var key   = parts[1] && parts[1].trim();
      var val   = key && I18N[lang] && I18N[lang][key];
      if (val) el.setAttribute(attr, val);
    });
  });

  /* innerHTML (opt-in, for tags with &amp; etc.) */
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
    var val = I18N[lang] && I18N[lang][el.getAttribute('data-i18n-html')];
    if (val) el.innerHTML = val;
  });

  /* lang button active state */
  var btnTH = document.getElementById('langTH');
  var btnEN = document.getElementById('langEN');
  if (btnTH) btnTH.classList.toggle('active', lang === 'th');
  if (btnEN) btnEN.classList.toggle('active', lang === 'en');
}

function setLang(lang) {
  localStorage.setItem('lang', lang);
  i18nApply();
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
}

/* Auto-apply when DOM is ready.
   Note: nav.js will call i18nApply() again after it injects the navbar,
   so navbar elements will also get translated correctly. */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', i18nApply);
} else {
  /* DOM already parsed (script at bottom of body) */
  i18nApply();
}
