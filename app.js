// ── PRAJAKEEYA KARNATAKA — Shared App JS ──

// Auth state
const PK = {
  user: JSON.parse(localStorage.getItem('pk_user') || 'null'),
  
  login(userData) {
    this.user = userData;
    localStorage.setItem('pk_user', JSON.stringify(userData));
  },
  logout() {
    localStorage.removeItem('pk_user');
    window.location.href = 'login.html';
  },
  isLoggedIn() { return !!this.user; },
  requireAuth() {
    if (!this.isLoggedIn()) window.location.href = 'login.html';
  }
};

// Sidebar toggle
function toggleSidebar() {
  document.querySelector('.sidebar')?.classList.toggle('open');
}

// Mobile overlay for sidebar
function initSidebar() {
  const sb = document.querySelector('.sidebar');
  if (!sb) return;
  // Close sidebar on outside click (mobile)
  document.addEventListener('click', e => {
    if (window.innerWidth <= 900 && !sb.contains(e.target) && !e.target.closest('.menu-toggle')) {
      sb.classList.remove('open');
    }
  });
  // Mark active
  const cur = location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    if (item.dataset.page === cur) item.classList.add('active');
  });
}

// Toast notifications
function toast(msg, type = 'success') {
  const t = document.createElement('div');
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  t.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:999;padding:14px 20px;border-radius:10px;font-size:13px;font-weight:500;color:#fff;background:${type==='success'?'#1A6B3A':type==='error'?'#DC2626':type==='warning'?'#D97706':'#1E40AF'};box-shadow:0 8px 24px rgba(0,0,0,.2);display:flex;align-items:center;gap:8px;max-width:360px;animation:slideIn .3s ease`;
  t.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}
const style = document.createElement('style');
style.textContent = `@keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`;
document.head.appendChild(style);

// Modal helpers
function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
function closeAllModals() { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open')); }
document.addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) closeAllModals(); });

// Format helpers
function formatDate(d = new Date()) { return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }); }
function formatNum(n) { return n >= 100000 ? (n/100000).toFixed(1)+'L' : n >= 1000 ? (n/1000).toFixed(1)+'K' : n; }
function timeAgo(date) {
  const diff = Date.now() - new Date(date);
  const m = Math.floor(diff/60000), h = Math.floor(diff/3600000), d = Math.floor(diff/86400000);
  return d>0?`${d}d ago`:h>0?`${h}h ago`:m>0?`${m}m ago`:'Just now';
}

// OTP simulation
function sendOTP(phone) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ success: true, otp: '123456' }), 1200);
  });
}
function verifyOTP(entered) { return entered === '123456'; }

// Districts data
const KARNATAKA_DISTRICTS = [
  'Bagalkot','Ballari','Belagavi','Bengaluru Rural','Bengaluru Urban',
  'Bidar','Chamarajanagar','Chikkaballapur','Chikkamagaluru','Chitradurga',
  'Dakshina Kannada','Davanagere','Dharwad','Gadag','Hassan',
  'Haveri','Kalaburagi','Kodagu','Kolar','Koppal',
  'Mandya','Mysuru','Raichur','Ramanagara','Shivamogga',
  'Tumakuru','Udupi','Uttara Kannada','Vijayapura','Yadgir'
];

// Populate district selects
function populateDistrictSelects() {
  document.querySelectorAll('select.district-select').forEach(sel => {
    sel.innerHTML = '<option value="">Select district</option>' +
      KARNATAKA_DISTRICTS.map(d => `<option value="${d}">${d}</option>`).join('');
  });
}

// Fake data generators
const FAKE_NAMES = ['Rajesh Kumar','Priya Sharma','Suresh Patil','Kavitha Reddy','Mohan Gowda','Anita Naik','Ravi Hegde','Deepa Kulkarni','Shiva Kumar','Meena Devi'];
const TALUKS = ['Central','North','South','East','West','Rural'];
function randomItem(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function randomInt(a,b) { return Math.floor(Math.random()*(b-a+1))+a; }

// Chart helper (simple SVG bars)
function drawBarChart(container, data, opts = {}) {
  const { width = 400, height = 160, color = '#E8501A', labelColor = '#718096' } = opts;
  const max = Math.max(...data.map(d => d.value));
  const barW = (width / data.length) * 0.6;
  const gap = (width / data.length) * 0.4;
  let svg = `<svg viewBox="0 0 ${width} ${height+30}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">`;
  data.forEach((d, i) => {
    const x = i * (width / data.length) + gap/2;
    const barH = max > 0 ? (d.value / max) * (height - 20) : 0;
    const y = height - barH;
    svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="${color}" opacity=".8"/>`;
    svg += `<text x="${x + barW/2}" y="${height+18}" text-anchor="middle" font-size="10" fill="${labelColor}" font-family="Inter,sans-serif">${d.label}</text>`;
    svg += `<text x="${x + barW/2}" y="${y-5}" text-anchor="middle" font-size="10" fill="${labelColor}" font-family="Inter,sans-serif" font-weight="600">${d.value}</text>`;
  });
  svg += '</svg>';
  container.innerHTML = svg;
}

// Donut chart
function drawDonut(container, segments, size = 120) {
  const total = segments.reduce((a,b) => a+b.value, 0);
  let offset = 0;
  const r = 45, cx = 60, cy = 60, strokeW = 14;
  const circ = 2 * Math.PI * r;
  let paths = '';
  segments.forEach(seg => {
    const pct = seg.value / total;
    const dash = pct * circ;
    paths += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="${strokeW}" stroke-dasharray="${dash} ${circ}" stroke-dashoffset="${-offset * circ}" transform="rotate(-90 ${cx} ${cy})" stroke-linecap="round"/>`;
    offset += pct;
  });
  container.innerHTML = `<svg viewBox="0 0 120 120" style="width:${size}px;height:${size}px">${paths}</svg>`;
}

// GPS mock
function getLocation() {
  return new Promise(resolve => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve({ lat: 12.9716, lng: 77.5946 }) // Bengaluru fallback
      );
    } else {
      resolve({ lat: 12.9716, lng: 77.5946 });
    }
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  populateDistrictSelects();
  // Close modal on Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllModals(); });
});
