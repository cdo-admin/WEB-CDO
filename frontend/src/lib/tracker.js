// Pelacak pengunjung: mencatat dari mana pengunjung datang (tanpa nama / IP). Dulu bagian cms.js.
import { api } from './api.js';

const REF_MAP = [
  [/(^|\.)instagram\.com$|^l\.instagram\.com$/, 'instagram', 'social'],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me|l\.facebook\.com|lm\.facebook\.com)$/, 'facebook', 'social'],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'linkedin', 'social'],
  [/(^|\.)(tiktok\.com|vm\.tiktok\.com)$/, 'tiktok', 'social'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube', 'social'],
  [/(^|\.)(twitter\.com|x\.com|t\.co)$/, 'x', 'social'],
  [/(^|\.)(wa\.me|whatsapp\.com|web\.whatsapp\.com|api\.whatsapp\.com)$/, 'whatsapp', 'messaging'],
  [/(^|\.)(t\.me|telegram\.org|web\.telegram\.org)$/, 'telegram', 'messaging'],
  [/(^|\.)google\.[a-z.]+$/, 'google', 'search'],
  [/(^|\.)bing\.com$/, 'bing', 'search'],
  [/(^|\.)(yahoo\.com|duckduckgo\.com|yandex\.[a-z]+|baidu\.com|ecosia\.org)$/, 'search-lain', 'search'],
];

function detectSource() {
  const Q = new URLSearchParams(window.location.search);
  const utm = (Q.get('utm_source') || Q.get('ref') || '').toLowerCase().trim();
  if (utm) {
    const med = (Q.get('utm_medium') || '').toLowerCase();
    const known = { instagram: 'social', ig: 'social', facebook: 'social', linkedin: 'social', tiktok: 'social', youtube: 'social', whatsapp: 'messaging', wa: 'messaging', google: 'search', email: 'email', brosur: 'offline', qr: 'offline' };
    return { source: utm === 'ig' ? 'instagram' : utm === 'wa' ? 'whatsapp' : utm.slice(0, 60), medium: med || known[utm] || 'campaign', host: '', campaign: (Q.get('utm_campaign') || '').slice(0, 80) };
  }
  let host = '';
  try { host = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : ''; } catch { /* ignore */ }
  if (host && host !== window.location.hostname) {
    for (const [re, s, m] of REF_MAP) if (re.test(host)) return { source: s, medium: m, host, campaign: '' };
    return { source: host.replace(/^www\./, ''), medium: 'referral', host, campaign: '' };
  }
  const ua = navigator.userAgent || '';
  if (/Instagram/i.test(ua)) return { source: 'instagram', medium: 'social', host: '', campaign: '' };
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return { source: 'facebook', medium: 'social', host: '', campaign: '' };
  if (/LinkedInApp/i.test(ua)) return { source: 'linkedin', medium: 'social', host: '', campaign: '' };
  if (/musical_ly|TikTok|BytedanceWebview/i.test(ua)) return { source: 'tiktok', medium: 'social', host: '', campaign: '' };
  if (/WhatsApp/i.test(ua)) return { source: 'whatsapp', medium: 'messaging', host: '', campaign: '' };
  return { source: 'direct', medium: 'direct', host: '', campaign: '' };
}
const rid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export function trackPageView(pageFile, lang) {
  if (window.parent !== window) return;
  try { if (localStorage.getItem('candiNoTrack') === '1') return; } catch { /* ignore */ }
  if (/bot|crawl|spider|headless|lighthouse/i.test(navigator.userAgent || '')) return;
  let vid, sid, src;
  try {
    vid = localStorage.getItem('candiVid'); if (!vid) { vid = rid(); localStorage.setItem('candiVid', vid); }
    sid = sessionStorage.getItem('candiSid');
    if (!sid) { sid = rid(); sessionStorage.setItem('candiSid', sid); src = detectSource(); sessionStorage.setItem('candiSrc', JSON.stringify(src)); }
    else src = JSON.parse(sessionStorage.getItem('candiSrc') || 'null');
  } catch { vid = vid || rid(); sid = sid || rid(); }
  src = src || detectSource();
  const w = window.innerWidth || 0;
  api('/page-views', {
    method: 'POST',
    body: {
      visitor_id: vid, session_id: sid, path: pageFile, source: src.source, medium: src.medium, referrer_host: src.host || null, campaign: src.campaign || null,
      device: w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop', lang, screen_w: w,
    },
  }).catch(() => {});
}
