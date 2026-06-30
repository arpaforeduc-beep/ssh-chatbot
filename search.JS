/**
 * search.js — Real Search System (v3 — clean)
 *
 * ใช้ event delegation ทั้งหมด เพราะ nav.js inject #searchInput ทีหลัง
 * searchIndex(query) → export ให้ search-results.html ใช้ตรงๆ ได้
 */

/* ══ SEARCH INDEX ══════════════════════════════════════════ */
var SEARCH_INDEX = [
  /* ── ประวัติศาสตร์ ── */
  { title:'ประวัติศาสตร์เมืองสมุทรสงคราม', title_en:'History of Samutsongkhram',
    desc:'เมืองสมุทรสงครามมีประวัติศาสตร์ยาวนานกว่า 300 ปี จากเมืองท่าสมัยอยุธยา',
    url:'maeklong-history.html', cat:'ประวัติศาสตร์', tags:['อยุธยา','รัตนโกสินทร์','เมืองสามน้ำ','ประวัติ'] },
  { title:'รัชกาลที่ 2 — พระราชสมภพสมุทรสงคราม', title_en:'King Rama II',
    desc:'รัชกาลที่ 2 ประสูติที่สมุทรสงคราม ทรงเป็นกวีและนักดนตรีที่ยิ่งใหญ่ของไทย',
    url:'maeklong-history.html', cat:'ประวัติศาสตร์', tags:['รัชกาลที่2','ร.2','กษัตริย์','อุทยาน'] },
  { title:'ค่ายบางกุ้ง', title_en:'Bang Kung Camp',
    desc:'ค่ายทหารประวัติศาสตร์ที่ต้านทัพพม่าในสมัยอยุธยา',
    url:'maeklong-history.html', cat:'ประวัติศาสตร์', tags:['ค่าย','พม่า','สงคราม','อยุธยา'] },
  { title:'วัดจุฬามณี', title_en:'Wat Chulamani',
    desc:'วัดเก่าแก่ที่มีโบสถ์ปรกโพธิ์อันลือชื่อ ต้นโพธิ์ขึ้นปกคลุมโบสถ์ทั้งหลัง',
    url:'maeklong-history.html', cat:'สถานที่สำคัญ', tags:['วัด','โบสถ์','โพธิ์','ศาสนา'] },
  /* ── อาหาร ── */
  { title:'ปลาทูแม่กลอง', title_en:'Mae Klong Mackerel',
    desc:'ปลาทูนึ่งมะนาวและปลาทูทอดขึ้นชื่อจากอ่าวแม่กลอง',
    url:'maeklong-food.html', cat:'อาหาร', tags:['ปลาทู','อาหาร','ทะเล','อ่าว'] },
  { title:'กะปิแม่กลอง', title_en:'Mae Klong Shrimp Paste',
    desc:'กะปิหมักจากกุ้งเคยอ่าวไทย ขึ้นชื่อระดับประเทศ สีม่วงเข้มกลิ่นหอม',
    url:'maeklong-food.html', cat:'อาหาร', tags:['กะปิ','กุ้งเคย','หมัก','เครื่องปรุง'] },
  { title:'แกงส้มใบชะคราม', title_en:'Chameleon Plant Sour Curry',
    desc:'แกงส้มสูตรพื้นบ้านที่ใช้ใบชะครามจากป่าชายเลน ไม่มีที่ไหนในโลก',
    url:'maeklong-food.html', cat:'อาหาร', tags:['แกง','ชะคราม','พื้นบ้าน','ป่าชายเลน'] },
  { title:'ขนมทองม้วน', title_en:'Golden Rolled Crepe',
    desc:'ขนมพื้นบ้านทำจากแป้งข้าวเจ้า กะทิสด น้ำตาลมะพร้าว กรอบหอม',
    url:'maeklong-food.html', cat:'อาหาร', tags:['ขนม','หวาน','โบราณ','กะทิ'] },
  { title:'ลอดช่องสมุทรสงคราม', title_en:'Local Lod Chong',
    desc:'ลอดช่องน้ำกะทิสูตรพื้นบ้านที่ขึ้นชื่อของชาวแม่กลอง',
    url:'maeklong-food.html', cat:'อาหาร', tags:['ลอดช่อง','กะทิ','ขนมหวาน'] },
  /* ── กิจกรรม ── */
  { title:'งานแห่หลวงพ่อบ้านแหลม', title_en:'Luang Pho Ban Laem Festival',
    desc:'ประเพณีแห่พระพุทธรูปศักดิ์สิทธิ์ทางน้ำ มีนาคม–เมษายน',
    url:'activities.html', cat:'กิจกรรม', tags:['งาน','วัด','ประเพณี','แห่','พระ'] },
  { title:'การสาธิตทำกะปิแบบดั้งเดิม', title_en:'Traditional Shrimp Paste Demo',
    desc:'ชุมชนนางตะเคียนเปิดให้เข้าชมกระบวนการทำกะปิตลอดฤดูกาล',
    url:'activities.html', cat:'กิจกรรม', tags:['workshop','กะปิ','ชุมชน','เรียนรู้'] },
  { title:'เทศกาลลอยกระทง', title_en:'Loy Krathong Festival',
    desc:'งานลอยกระทงริมแม่น้ำแม่กลองที่สวยงามและเต็มไปด้วยวัฒนธรรม',
    url:'activities.html', cat:'กิจกรรม', tags:['ลอยกระทง','เทศกาล','แม่น้ำ','วัฒนธรรม'] },
  { title:'งานวันพระราชสมภพ รัชกาลที่ 2', title_en:'Rama II Birthday',
    desc:'24 กุมภาพันธ์ ทุกปี ณ อุทยาน ร.2 อ.อัมพวา ดนตรีไทย โขน',
    url:'activities.html', cat:'กิจกรรม', tags:['ร.2','วันเกิด','อุทยาน','ดนตรีไทย','โขน'] },
  /* ── ร้านค้า ── */
  { title:'กะปิแม่กลองแท้', title_en:'Authentic Mae Klong Shrimp Paste',
    desc:'กะปิหมักจากกุ้งเคยอ่าวไทย ไม่มีสารเจือปน ราคา 150–350 บาท',
    url:'shops.html', cat:'ร้านค้า', tags:['กะปิ','ซื้อ','OTOP','ผลิตภัณฑ์'] },
  { title:'ขนมทองม้วนโบราณ', title_en:'Traditional Golden Rolled Crepe Shop',
    desc:'ขนมพื้นบ้านย่างบนแม่พิมพ์เหล็กโบราณ ราคา 60–120 บาท',
    url:'shops.html', cat:'ร้านค้า', tags:['ขนม','ซื้อ','ของฝาก','โบราณ'] },
  { title:'ตะกร้าสานไม้ไผ่', title_en:'Bamboo Woven Baskets',
    desc:'งานจักสานจากชุมชนอัมพวา ราคา 80–450 บาท',
    url:'shops.html', cat:'ร้านค้า', tags:['จักสาน','ไม้ไผ่','หัตถกรรม','OTOP'] },
  /* ── สถานที่ ── */
  { title:'ตลาดน้ำอัมพวา', title_en:'Amphawa Floating Market',
    desc:'ตลาดน้ำยามค่ำคืนที่มีชื่อเสียงระดับโลก ศุกร์–อาทิตย์ 12:00–21:00',
    url:'index.html#places', cat:'สถานที่', tags:['ตลาด','ตลาดน้ำ','อัมพวา','ท่องเที่ยว'] },
  { title:'ตลาดรถไฟแม่กลอง', title_en:'Mae Klong Railway Market',
    desc:'ตลาดสดที่รถไฟวิ่งผ่านกลางตลาด สถานที่ท่องเที่ยวชื่อดัง',
    url:'index.html#places', cat:'สถานที่', tags:['ตลาด','รถไฟ','แม่กลอง','ท่องเที่ยว'] },
  { title:'ดอนหอยหลอด', title_en:'Don Hoi Lot',
    desc:'สันดอนธรรมชาติกลางทะเล แหล่งหอยหลอดและนกนานาชนิด',
    url:'index.html#places', cat:'สถานที่', tags:['ดอน','หอยหลอด','ธรรมชาติ','ทะเล'] },
  { title:'อุทยาน ร.2', title_en:'Rama II Memorial Park',
    desc:'อุทยานรำลึกพระราชสมภพรัชกาลที่ 2 บ้านอัมพวา',
    url:'maeklong-history.html', cat:'สถานที่', tags:['อุทยาน','ร.2','อัมพวา','ประวัติศาสตร์'] },
  /* ── ภูมิปัญญา ── */
  { title:'หัตถกรรมและงานจักสาน', title_en:'Crafts & Weaving',
    desc:'ภูมิปัญญาการจักสานไม้ไผ่ งานทอ และหัตถกรรมพื้นบ้านของชุมชน',
    url:'craft.html', cat:'ภูมิปัญญา', tags:['จักสาน','ไม้ไผ่','หัตถกรรม','ฝีมือ'] },
  { title:'สมุนไพรพื้นบ้าน', title_en:'Traditional Herbal Medicine',
    desc:'สมุนไพรและพืชพื้นบ้านในระบบนิเวศป่าชายเลนและริมน้ำสมุทรสงคราม',
    url:'herbs.html', cat:'ภูมิปัญญา', tags:['สมุนไพร','พืช','ยา','ป่าชายเลน'] },
  { title:'ใบชะคราม', title_en:'Chameleon Plant',
    desc:'พืชป่าชายเลนเฉพาะถิ่น รสเปรี้ยวอมเค็ม ใช้ทำแกงส้มและมีสรรพคุณทางยา',
    url:'herbs.html', cat:'สมุนไพร', tags:['ชะคราม','สมุนไพร','ป่าชายเลน','แกง'] },
  { title:'น้ำมันมะพร้าวสกัดเย็น', title_en:'Cold-pressed Coconut Oil',
    desc:'บำรุงผิวและเส้นผม แก้แผลไฟไหม้ ต้านเชื้อแบคทีเรีย',
    url:'herbs.html', cat:'สมุนไพร', tags:['มะพร้าว','น้ำมัน','ผิว','บำรุง'] },
  { title:'การทำกะปิแบบดั้งเดิม', title_en:'Traditional Shrimp Paste Making',
    desc:'กรรมวิธีสืบทอดมากกว่า 100 ปี ใช้กุ้งเคยและเกลือสมุทร หมักในไหดินโบราณ',
    url:'craft.html', cat:'ภูมิปัญญา', tags:['กะปิ','หมัก','กุ้งเคย','ดั้งเดิม'] },
  { title:'งานจักสานไม้ไผ่', title_en:'Bamboo Weaving',
    desc:'ตัดช่วงหน้าแล้ง ข้างแรม 7–14 ค่ำ เนื้อไม้แข็งและไม่มอด',
    url:'craft.html', cat:'หัตถกรรม', tags:['จักสาน','ไม้ไผ่','ฤดูกาล','ภูมิปัญญา'] },
  { title:'งานไม้แกะสลัก', title_en:'Wood Carving',
    desc:'ใช้ไม้แสมจากป่าชายเลนที่ตายเองตามธรรมชาติ การใช้ทรัพยากรอย่างรับผิดชอบ',
    url:'craft.html', cat:'หัตถกรรม', tags:['ไม้','แกะสลัก','แสม','ป่าชายเลน'] },
  { title:'ยุทธการค่ายบางกุ้ง', title_en:'Battle of Bang Kung',
    desc:'ชาวบ้านและทหารต้านทัพพม่าด้วยความรู้เรื่องน้ำขึ้น-ลงและภูมิประเทศ พ.ศ. 2310',
    url:'maeklong-history.html', cat:'ประวัติศาสตร์', tags:['ค่ายบางกุ้ง','พม่า','อยุธยา','สงคราม'] },
];

/* ══ SEARCH FUNCTION ═══════════════════════════════════════ */
function searchIndex(query) {
  if (!query || query.trim().length < 2) return [];

  var q     = query.trim().toLowerCase();
  var terms = q.split(/\s+/);

  var scored = SEARCH_INDEX.map(function (item) {
    var score = 0;
    terms.forEach(function (t) {
      if (item.title.toLowerCase().indexOf(t)              > -1) score += 10;
      if ((item.title_en || '').toLowerCase().indexOf(t)   > -1) score += 8;
      if (item.cat.toLowerCase().indexOf(t)                > -1) score += 6;
      if ((item.tags || []).some(function (tag) {
        return tag.toLowerCase().indexOf(t) > -1;
      })) score += 4;
      if (item.desc.toLowerCase().indexOf(t)               > -1) score += 2;
    });
    return Object.assign({}, item, { score: score });
  }).filter(function (r) { return r.score > 0; });

  return scored.sort(function (a, b) { return b.score - a.score; });
}

/* ══ NAVIGATE TO RESULTS PAGE ══════════════════════════════ */
function doSearch(query) {
  if (!query || !query.trim()) return;
  window.location.href = 'search-results.html?q=' + encodeURIComponent(query.trim());
}

/* ══ EVENT DELEGATION (works even if nav.js injects input later) ═ */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Enter') return;
  var t = e.target;
  if (!t) return;
  /* nav search input */
  if (t.id === 'searchInput' && t.value.trim()) {
    doSearch(t.value);
  }
  /* charm.html hero search input */
  if (t.id === 'charmSearchInput' && t.value.trim()) {
    doSearch(t.value);
  }
});

document.addEventListener('click', function (e) {
  /* nav search button */
  var navBtn = e.target.closest('[data-search-trigger]');
  if (navBtn) {
    var navInput = document.getElementById('searchInput');
    if (navInput && navInput.value.trim()) doSearch(navInput.value);
  }
  /* charm.html hero search button */
  if (e.target.id === 'charmSearchBtn') {
    var charmInput = document.getElementById('charmSearchInput');
    if (charmInput && charmInput.value.trim()) doSearch(charmInput.value);
  }
});
