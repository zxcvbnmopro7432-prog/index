import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg0:"#060810", bg1:"#0a0e1a", bg2:"#0f1526", bg3:"#141c30", bg4:"#1a2540", bg5:"#1e2d4a",
  green:"#00d97e", greenDim:"#00d97e18", greenGlow:"#00d97e40",
  blue:"#4f8ef7", blueDim:"#4f8ef715", purple:"#a855f7",
  amber:"#f59e0b", red:"#ef4444", redDim:"#ef444418",
  t1:"#f0f4ff", t2:"#7b8db0", t3:"#3d4f6e",
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
let _stylesInj = false;
function injectStyles() {
  if (_stylesInj || document.getElementById("whp-styles")) { _stylesInj=true; return; }
  const el = document.createElement("style"); el.id="whp-styles";
  el.textContent = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body{background:${T.bg0};color:${T.t1};font-family:'Inter',system-ui,sans-serif;font-size:14px;line-height:1.5;min-height:100vh;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:${T.bg4};border-radius:4px}
::selection{background:${T.greenDim};color:${T.green}}
input,textarea,select,button{font-family:inherit;}button{cursor:pointer;}
.mono{font-family:'JetBrains Mono',monospace;}
.fade-in{animation:fadeIn .22s ease;}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.shimmer{position:relative;overflow:hidden;background:${T.bg3};}
.shimmer::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,${T.bg4}88,transparent);animation:shimmer 1.6s infinite;}
@keyframes shimmer{from{transform:translateX(-100%)}to{transform:translateX(100%)}}
.field{background:${T.bg5};border:1px solid ${T.bg4};border-radius:8px;color:${T.t1};font-size:13px;padding:9px 12px;width:100%;outline:none;transition:border-color .15s,box-shadow .15s;}
.field:focus{border-color:${T.green};box-shadow:0 0 0 3px ${T.greenDim};}.field::placeholder{color:${T.t3};}
.field.err{border-color:${T.red}!important;box-shadow:0 0 0 3px ${T.redDim}!important;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:none;border-radius:8px;font-weight:500;font-size:13px;padding:8px 16px;transition:all .15s;white-space:nowrap;flex-shrink:0;}
.btn:disabled{opacity:.35;cursor:not-allowed;}
.btn-primary{background:${T.green};color:#000;}.btn-primary:not(:disabled):hover{background:#00f08a;box-shadow:0 4px 20px ${T.greenGlow};}
.btn-ghost{background:transparent;border:1px solid ${T.bg4};color:${T.t2};}.btn-ghost:not(:disabled):hover{border-color:${T.t3};color:${T.t1};background:${T.bg3};}
.btn-danger{background:${T.redDim};border:1px solid ${T.red}33;color:${T.red};}.btn-danger:not(:disabled):hover{background:#ef444428;}
.btn-sm{font-size:12px;padding:5px 12px;border-radius:6px;}
.btn-icon{background:transparent;border:none;color:${T.t2};padding:6px;border-radius:6px;display:flex;align-items:center;transition:all .15s;}.btn-icon:hover{background:${T.bg3};color:${T.t1};}
.card{background:${T.bg2};border:1px solid ${T.bg4};border-radius:12px;padding:16px;}
.card-sm{background:${T.bg2};border:1px solid ${T.bg4};border-radius:10px;padding:12px;}
.badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:100px;font-size:11px;font-weight:500;}
.badge-green{background:${T.greenDim};color:${T.green};border:1px solid ${T.green}33;}
.badge-blue{background:${T.blueDim};color:${T.blue};border:1px solid ${T.blue}22;}
.badge-yellow{background:#f59e0b18;color:${T.amber};border:1px solid #f59e0b33;}
.badge-red{background:${T.redDim};color:${T.red};border:1px solid ${T.red}33;}
.badge-gray{background:${T.bg3};color:${T.t2};border:1px solid ${T.bg4};}
.tab-bar{display:flex;gap:0;border-bottom:1px solid ${T.bg4};overflow-x:auto;scrollbar-width:none;}
.tab-bar::-webkit-scrollbar{display:none;}
.tab-btn{padding:10px 16px;background:transparent;border:none;color:${T.t2};font-size:13px;font-weight:500;cursor:pointer;position:relative;white-space:nowrap;transition:color .15s;}
.tab-btn:hover{color:${T.t1};}.tab-btn.act{color:${T.t1};}
.tab-btn.act::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:2px;background:${T.green};border-radius:2px 2px 0 0;}
.nav-item{display:flex;align-items:center;gap:10px;width:100%;padding:7px 10px;border-radius:8px;border:none;background:transparent;color:${T.t2};font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;text-align:left;}
.nav-item:hover{background:${T.bg3};color:${T.t1};}.nav-item.act{background:${T.greenDim};color:${T.green};}
.toggle{width:38px;height:20px;border-radius:100px;border:none;position:relative;cursor:pointer;transition:background .2s;flex-shrink:0;}
.toggle-knob{position:absolute;top:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 4px #0008;}
.prog{height:3px;background:${T.bg4};border-radius:100px;overflow:hidden;}
.prog-bar{height:100%;background:${T.green};border-radius:100px;transition:width .6s ease;}
.dropzone{border:1.5px dashed ${T.bg4};border-radius:10px;padding:32px 20px;text-align:center;cursor:pointer;transition:all .2s;}
.dropzone:hover,.dropzone.over{border-color:${T.green};background:${T.greenDim};}
.sidebar{width:220px;flex-shrink:0;background:${T.bg1};border-right:1px solid ${T.bg4};display:flex;flex-direction:column;height:100vh;position:sticky;top:0;}
@media(max-width:768px){
  .sidebar{position:fixed;left:-220px;top:0;height:100vh;z-index:200;transition:left .25s cubic-bezier(.4,0,.2,1);}
  .sidebar.open{left:0;box-shadow:20px 0 60px #000a;}
  .mob-overlay{display:none;position:fixed;inset:0;background:#0009;z-index:199;}
  .mob-overlay.show{display:block;}
  .mob-btn{display:flex!important;}
  .main-pad{padding:16px!important;}
}
@media(min-width:769px){.mob-btn{display:none!important;}}
.cmd-overlay{position:fixed;inset:0;background:#00000088;backdrop-filter:blur(4px);z-index:999;display:flex;align-items:flex-start;justify-content:center;padding-top:120px;animation:fadeIn .15s ease;}
.cmd-box{background:${T.bg2};border:1px solid ${T.bg4};border-radius:14px;width:100%;max-width:540px;overflow:hidden;box-shadow:0 24px 80px #000a;}
.toast-wrap{position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;gap:8px;z-index:998;}
.toast{display:flex;align-items:center;gap:10px;background:${T.bg2};border:1px solid ${T.bg4};border-radius:10px;padding:12px 16px;font-size:13px;max-width:340px;box-shadow:0 8px 32px #000a;animation:slideUp .22s ease;}
@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
.spin{animation:spin 1s linear infinite;display:inline-block;}@keyframes spin{to{transform:rotate(360deg)}}
.pulse{animation:pulse 2s infinite;}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.data-table{width:100%;border-collapse:collapse;font-size:13px;}
.data-table th{padding:8px 12px;text-align:left;color:${T.t2};font-weight:500;border-bottom:1px solid ${T.bg4};white-space:nowrap;}
.data-table td{padding:10px 12px;border-bottom:1px solid ${T.bg4}88;color:${T.t1};}
.data-table tr:last-child td{border-bottom:none;}.data-table tr:hover td{background:${T.bg3}44;}
.code-editor{background:${T.bg0};border:1px solid ${T.bg4};border-radius:8px;padding:14px;font-family:'JetBrains Mono',monospace;font-size:12px;color:#a5d6a7;width:100%;resize:vertical;outline:none;line-height:1.8;min-height:300px;}
.code-editor:focus{border-color:${T.green}55;}
.env-row{display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid ${T.bg4}55;}
.env-row:last-child{border-bottom:none;}
.deploy-step{display:flex;align-items:flex-start;gap:14px;padding:10px 0;}
.deploy-step-icon{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;margin-top:1px;}
.deploy-step-line{width:1px;height:24px;margin:4px 0 0 13px;background:${T.bg4};}
.fw-badge{display:inline-flex;align-items:center;gap:5px;background:${T.bg3};border:1px solid ${T.bg4};border-radius:6px;padding:2px 8px;font-size:11px;color:${T.t2};}
/* Google Auth styles */
.g-btn{display:flex;align-items:center;justify-content:center;gap:12px;width:100%;padding:12px 24px;background:#fff;border:1px solid #dadce0;border-radius:4px;font-family:'Inter',sans-serif;font-size:14px;font-weight:500;color:#3c4043;cursor:pointer;transition:all .15s;box-shadow:0 1px 2px rgba(0,0,0,.08);}
.g-btn:hover{background:#f8f9fa;box-shadow:0 2px 8px rgba(0,0,0,.12);}
.g-modal{position:fixed;inset:0;background:#00000077;z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn .18s ease;}
.g-card{background:#fff;border-radius:8px;width:100%;max-width:400px;box-shadow:0 8px 40px rgba(0,0,0,.2);overflow:hidden;animation:fadeIn .2s ease;}
.g-card *{color:#3c4043 !important;}
.g-input{width:100%;padding:12px 14px;border:1px solid #dadce0;border-radius:4px;font-size:14px;outline:none;font-family:'Inter',sans-serif;transition:border-color .15s;}
.g-input:focus{border-color:#1a73e8;box-shadow:0 0 0 2px #1a73e820;}
.g-input.err{border-color:#d93025!important;}
.g-next{background:#1a73e8;color:#fff!important;border:none;border-radius:4px;padding:10px 24px;font-size:14px;font-weight:500;cursor:pointer;transition:background .15s;}
.g-next:hover{background:#1557b0;}
.g-next:disabled{opacity:.5;cursor:not-allowed;}
  `;
  document.head.appendChild(el); _stylesInj=true;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2,9);
const fmtSz = b => b<1024?b+"B":b<1048576?(b/1024).toFixed(1)+"KB":(b/1048576).toFixed(2)+"MB";
const fmtDate = d => new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});
const rnd = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const clamp = (v,a,b) => Math.min(b,Math.max(a,v));

// Simple email hash for storage key (not security — just namespacing)
const emailKey = email => btoa(email.toLowerCase().trim()).replace(/[^a-zA-Z0-9]/g,"").slice(0,24);

const sanitizeHTML = html => {
  if (!html||typeof html!=="string") return "";
  return html.replace(/<script[^>]+src=["'][^"']*["'][^>]*>/gi,"<!-- blocked -->")
             .replace(/javascript:/gi,"data:").replace(/on\w+\s*=\s*["'][^"']*["']/gi,"");
};
const detectFramework = (html="") => {
  if (!html) return "Static HTML";
  if (html.includes("__NEXT_DATA__")||html.includes("_next")) return "Next.js";
  if (html.includes("vue")||html.includes("Vue.createApp")) return "Vue";
  if (html.includes("ng-app")||html.includes("angular")) return "Angular";
  if (html.includes("react")||html.includes("ReactDOM")) return "React";
  return "Static HTML";
};
const validateSub = (sub,existing=[]) => {
  if (!sub) return "";
  if (sub.length<3) return "Minimum 3 characters";
  if (sub.length>32) return "Maximum 32 characters";
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(sub)) return "Lowercase letters, numbers, hyphens only";
  if (existing.find(s=>s.sub===sub)) return "Subdomain already taken";
  return "";
};
const DEMO_HTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My Website</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',system-ui,sans-serif;background:#060810;min-height:100vh;display:flex;align-items:center;justify-content:center;color:#f0f4ff}.wrap{text-align:center;padding:48px 32px;max-width:520px}h1{font-size:2.4rem;font-weight:700;margin-bottom:14px;background:linear-gradient(135deg,#00d97e,#4f8ef7);-webkit-background-clip:text;-webkit-text-fill-color:transparent}p{color:#7b8db0;font-size:1rem;line-height:1.7;margin-bottom:28px}.badge{display:inline-flex;align-items:center;gap:8px;background:#00d97e18;color:#00d97e;border:1px solid #00d97e33;padding:8px 20px;border-radius:100px;font-size:13px;font-weight:600}.dot{width:6px;height:6px;border-radius:50%;background:#00d97e;animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}</style>
</head><body><div class="wrap"><h1>Deployed Successfully</h1><p>Your website is live on WebHost Pro!</p><div class="badge"><span class="dot"></span>Live</div></div></body></html>`;

// ─── ICON ─────────────────────────────────────────────────────────────────────
const Icon = memo(({name,size=16,color,style={}})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {name==="home"&&<><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>}
    {name==="grid"&&<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>}
    {name==="upload"&&<><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></>}
    {name==="globe"&&<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>}
    {name==="bar-chart"&&<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>}
    {name==="settings"&&<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>}
    {name==="help"&&<><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}
    {name==="file"&&<><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></>}
    {name==="terminal"&&<><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></>}
    {name==="code"&&<><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>}
    {name==="link"&&<><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>}
    {name==="trash"&&<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>}
    {name==="edit"&&<><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>}
    {name==="copy"&&<><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>}
    {name==="check"&&<polyline points="20 6 9 17 4 12"/>}
    {name==="x"&&<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}
    {name==="plus"&&<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}
    {name==="chevron-right"&&<polyline points="9 18 15 12 9 6"/>}
    {name==="arrow-left"&&<><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>}
    {name==="menu"&&<><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>}
    {name==="lock"&&<><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>}
    {name==="zap"&&<polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>}
    {name==="refresh"&&<><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></>}
    {name==="eye"&&<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
    {name==="eye-off"&&<><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>}
    {name==="key"&&<><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></>}
    {name==="clock"&&<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}
    {name==="activity"&&<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>}
    {name==="shield"&&<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}
    {name==="search"&&<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>}
    {name==="layers"&&<><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>}
    {name==="alert"&&<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}
    {name==="user"&&<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>}
    {name==="rollback"&&<><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></>}
    {name==="pause"&&<><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>}
    {name==="play"&&<polygon points="5 3 19 12 5 21 5 3"/>}
    {name==="log-out"&&<><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>}
    {name==="cloud"&&<path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>}
    {name==="package"&&<><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>}
    {name==="server"&&<><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></>}
    {name==="info"&&<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>}
  </svg>
));

// Google SVG Logo
const GoogleLogo = ()=>(
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
  </svg>
);

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts,setToasts] = useState([]);
  const add = useCallback((msg,type="success")=>{
    const id=uid();
    setToasts(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),4000);
  },[]);
  return [toasts,add];
}

// ─── CLOUD STORAGE (shared=true = cross-device) ───────────────────────────────
async function cloudGet(key) {
  try { const r = await window.storage.get(key, true); return r?.value ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function cloudSet(key, value) {
  try { await window.storage.set(key, JSON.stringify(value), true); return true; }
  catch { return false; }
}
async function cloudDelete(key) {
  try { await window.storage.delete(key, true); return true; }
  catch { return false; }
}

// Session stored locally (same device stay-logged-in)
const SESSION_KEY = "whp_session_v2";
const SAVED_ACCOUNTS_KEY = "whp_saved_accounts_v2"; // list of accounts on this device

function getLocalSession() {
  try { const s = localStorage.getItem(SESSION_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
}
function setLocalSession(user) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch {}
}
function clearLocalSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
}
// Saved accounts = multiple accounts that have ever logged in on this device
function getSavedAccounts() {
  try { const s = localStorage.getItem(SAVED_ACCOUNTS_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
}
function saveAccount(user) {
  try {
    const accounts = getSavedAccounts();
    const filtered = accounts.filter(a => a.email !== user.email);
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify([user, ...filtered].slice(0,5)));
  } catch {}
}
function removeSavedAccount(email) {
  try {
    const accounts = getSavedAccounts().filter(a => a.email !== email);
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {}
}

// ─── GOOGLE AUTH MODAL ────────────────────────────────────────────────────────
const GoogleAuthModal = memo(({ onSuccess, onClose, savedAccounts=[] }) => {
  const [step, setStep] = useState(savedAccounts.length > 0 ? "accounts" : "email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(""); // which account is loading
  const [isNew, setIsNew] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (step === "email" || step === "name") setTimeout(()=>inputRef.current?.focus(), 100);
  }, [step]);

  const validateEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  // Quick-login with a saved account
  const loginSaved = async (account) => {
    setLoadingEmail(account.email);
    // Verify account still exists in cloud
    const existing = await cloudGet(`whp:user:${emailKey(account.email)}`);
    if (existing) {
      await sleep(700);
      onSuccess({ email: account.email, name: existing.name, avatar: existing.avatar, createdAt: existing.createdAt });
    } else {
      // Account deleted from cloud — remove from saved
      removeSavedAccount(account.email);
      setLoadingEmail("");
      setStep("email");
    }
  };

  const handleEmailNext = async () => {
    const em = email.trim().toLowerCase();
    if (!validateEmail(em)) { setEmailErr("Enter a valid email address"); return; }
    setEmailErr(""); setLoading(true);
    const existing = await cloudGet(`whp:user:${emailKey(em)}`);
    setLoading(false);
    if (existing) {
      setStep("loading");
      await sleep(1000);
      onSuccess({ email: em, name: existing.name, avatar: existing.avatar, createdAt: existing.createdAt });
    } else {
      setIsNew(true);
      setStep("name");
    }
  };

  const handleNameNext = async () => {
    const nm = name.trim();
    if (!nm) return;
    const em = email.trim().toLowerCase();
    setStep("loading");
    const colors = ["#00d97e","#4f8ef7","#a855f7","#f59e0b","#ef4444","#06b6d4"];
    const avatar = colors[em.charCodeAt(0) % colors.length];
    const userProfile = { email: em, name: nm, avatar, createdAt: Date.now() };
    await cloudSet(`whp:user:${emailKey(em)}`, userProfile);
    await sleep(900);
    onSuccess(userProfile);
  };

  const initials = (nm) => nm ? nm.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "?";

  return (
    <div className="g-modal" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="g-card" style={{maxWidth:420}}>
        {/* Header */}
        <div style={{padding:"28px 36px 0",textAlign:"center"}}>
          <GoogleLogo/>
          {step==="accounts"
            ? <><div style={{fontSize:20,fontWeight:400,color:"#202124",marginTop:14,marginBottom:4}}>Choose an account</div>
                <div style={{fontSize:13,color:"#5f6368",marginBottom:20}}>to continue to WebHost Pro</div></>
            : <><div style={{fontSize:20,fontWeight:400,color:"#202124",marginTop:14,marginBottom:4}}>{step==="name"?"Create your account":"Sign in"}</div>
                <div style={{fontSize:13,color:"#5f6368",marginBottom:20}}>to continue to WebHost Pro</div></>
          }
        </div>

        {/* SAVED ACCOUNTS LIST */}
        {step==="accounts" && (
          <div style={{padding:"0 0 8px"}}>
            {savedAccounts.map(acc=>(
              <div key={acc.email} onClick={()=>loginSaved(acc)}
                style={{display:"flex",alignItems:"center",gap:12,padding:"12px 36px",cursor:"pointer",transition:"background .12s",borderBottom:"1px solid #f1f3f4",position:"relative"}}
                onMouseEnter={e=>e.currentTarget.style.background="#f8f9fa"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                {/* Avatar */}
                <div style={{width:40,height:40,borderRadius:"50%",background:acc.avatar||"#4f8ef7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff",flexShrink:0}}>
                  {loadingEmail===acc.email ? <span className="spin" style={{color:"#fff",fontSize:14}}>◌</span> : initials(acc.name)}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:500,color:"#202124",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{acc.name}</div>
                  <div style={{fontSize:12,color:"#5f6368",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{acc.email}</div>
                </div>
                <Icon name="chevron-right" size={15} color="#5f6368"/>
              </div>
            ))}
            {/* Use another account */}
            <div onClick={()=>setStep("email")}
              style={{display:"flex",alignItems:"center",gap:12,padding:"12px 36px",cursor:"pointer",transition:"background .12s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#f8f9fa"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:40,height:40,borderRadius:"50%",background:"#f1f3f4",border:"1px solid #e8eaed",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name="plus" size={16} color="#5f6368"/>
              </div>
              <div style={{fontSize:14,color:"#202124"}}>Use another account</div>
            </div>
          </div>
        )}

        {/* EMAIL STEP */}
        {step==="email" && (
          <div style={{padding:"0 36px 28px"}}>
            <input ref={inputRef} className={`g-input${emailErr?" err":""}`} type="email" placeholder="Email or phone"
              value={email} onChange={e=>{setEmail(e.target.value);setEmailErr("");}}
              onKeyDown={e=>e.key==="Enter"&&handleEmailNext()}/>
            {emailErr && <div style={{fontSize:12,color:"#d93025",marginTop:6}}>{emailErr}</div>}
            <div style={{fontSize:12,color:"#5f6368",marginTop:12,lineHeight:1.6}}>Not your computer? Use Guest mode to sign in privately.</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:22}}>
              {savedAccounts.length>0
                ? <button style={{background:"transparent",border:"none",color:"#1a73e8",cursor:"pointer",fontSize:14,fontWeight:500}} onClick={()=>setStep("accounts")}>Back</button>
                : <a style={{fontSize:14,color:"#1a73e8",cursor:"pointer",fontWeight:500}} onClick={()=>{}}>Create account</a>
              }
              <button className="g-next" onClick={handleEmailNext} disabled={loading||!email}>
                {loading ? <span className="spin" style={{fontSize:12}}>◌</span> : "Next"}
              </button>
            </div>
          </div>
        )}

        {/* NAME STEP */}
        {step==="name" && (
          <div style={{padding:"0 36px 28px"}}>
            <div style={{fontSize:12,color:"#5f6368",marginBottom:14,display:"flex",alignItems:"center",gap:8,background:"#f8f9fa",padding:"8px 12px",borderRadius:4,border:"1px solid #e8eaed"}}>
              <GoogleLogo/><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{email}</span>
            </div>
            <input ref={inputRef} className="g-input" type="text" placeholder="First and last name"
              value={name} onChange={e=>setName(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleNameNext()}/>
            <div style={{fontSize:11,color:"#5f6368",marginTop:7}}>This is how you'll appear on WebHost Pro</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:22}}>
              <button style={{background:"transparent",border:"none",color:"#1a73e8",cursor:"pointer",fontSize:14,fontWeight:500}} onClick={()=>setStep("email")}>Back</button>
              <button className="g-next" onClick={handleNameNext} disabled={!name.trim()}>Create Account</button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {step==="loading" && (
          <div style={{padding:"28px 36px",textAlign:"center"}}>
            <div className="spin" style={{fontSize:28,color:"#1a73e8",display:"block",margin:"0 auto 14px"}}>◌</div>
            <div style={{fontSize:14,color:"#5f6368"}}>{isNew?"Creating your account...":"Signing you in..."}</div>
            <div style={{fontSize:12,color:"#9aa0a6",marginTop:6}}>Loading your data from cloud...</div>
          </div>
        )}

        {/* Footer */}
        <div style={{background:"#f8f9fa",borderTop:"1px solid #e8eaed",padding:"10px 36px",display:"flex",gap:16}}>
          {["Help","Privacy","Terms"].map(l=><span key={l} style={{fontSize:12,color:"#5f6368",cursor:"pointer"}}>{l}</span>)}
        </div>
      </div>
    </div>
  );
});

// ─── LANDING / LOGIN PAGE ─────────────────────────────────────────────────────
const LoginPage = memo(({ onLogin }) => {
  const [showModal, setShowModal] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState([]);

  useEffect(() => {
    setSavedAccounts(getSavedAccounts());
  }, []);

  const handleSuccess = user => {
    setShowModal(false);
    onLogin(user);
  };

  return (
    <div style={{minHeight:"100vh",background:T.bg0,display:"flex",flexDirection:"column"}}>
      {/* Nav */}
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 32px",borderBottom:`1px solid ${T.bg4}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,borderRadius:8,background:T.greenDim,border:`1px solid ${T.green}33`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="layers" size={15} color={T.green}/>
          </div>
          <span style={{fontSize:15,fontWeight:700,color:T.t1,letterSpacing:"-.02em"}}>WebHost<span style={{color:T.green}}>.pro</span></span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={()=>setShowModal(true)} style={{display:"flex",alignItems:"center",gap:6}}>
          <GoogleLogo/>Sign in
        </button>
      </nav>

      {/* Hero */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px 24px",textAlign:"center"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:T.greenDim,border:`1px solid ${T.green}33`,borderRadius:100,padding:"6px 16px",fontSize:12,color:T.green,fontWeight:500,marginBottom:28}}>
          <span className="pulse" style={{width:6,height:6,borderRadius:"50%",background:T.green,display:"inline-block"}}/>
          Free static hosting platform
        </div>
        <h1 style={{fontSize:"clamp(2rem,5vw,3.6rem)",fontWeight:700,lineHeight:1.1,letterSpacing:"-.03em",marginBottom:18,maxWidth:660}}>
          <span style={{color:T.t1}}>Deploy websites</span><br/>
          <span style={{background:`linear-gradient(135deg,${T.green},${T.blue})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>in 30 seconds</span>
        </h1>
        <p style={{fontSize:16,color:T.t2,maxWidth:460,lineHeight:1.7,marginBottom:36}}>
          Upload HTML, choose a subdomain, go live instantly. Data syncs across all your devices automatically.
        </p>

        {/* ── SAVED ACCOUNTS (if any on this device) ─────────── */}
        {savedAccounts.length > 0 ? (
          <div style={{width:"100%",maxWidth:340,marginBottom:12}}>
            <div style={{fontSize:12,color:T.t3,marginBottom:10,textAlign:"left"}}>Continue as:</div>
            <div style={{background:T.bg2,border:`1px solid ${T.bg4}`,borderRadius:12,overflow:"hidden",marginBottom:10}}>
              {savedAccounts.map((acc,i)=>(
                <div key={acc.email} onClick={()=>onLogin(acc)}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer",transition:"background .15s",borderBottom:i<savedAccounts.length-1?`1px solid ${T.bg4}`:"",position:"relative"}}
                  onMouseEnter={e=>e.currentTarget.style.background=T.bg3}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:acc.avatar||T.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#000",flexShrink:0}}>
                    {acc.name?acc.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2):"?"}
                  </div>
                  <div style={{flex:1,minWidth:0,textAlign:"left"}}>
                    <div style={{fontSize:13,fontWeight:600,color:T.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{acc.name}</div>
                    <div style={{fontSize:11,color:T.t3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{acc.email}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span className="badge badge-green" style={{fontSize:9}}>Saved</span>
                    <Icon name="chevron-right" size={13} color={T.t3}/>
                  </div>
                  {/* remove saved account button */}
                  <button onClick={e=>{e.stopPropagation();removeSavedAccount(acc.email);setSavedAccounts(getSavedAccounts());}}
                    style={{position:"absolute",right:40,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",cursor:"pointer",color:T.t3,padding:4,borderRadius:4,opacity:0,transition:"opacity .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.color=T.red;}}
                    onMouseLeave={e=>{e.currentTarget.style.opacity="0";}}
                    title="Remove account">
                    <Icon name="x" size={12}/>
                  </button>
                </div>
              ))}
            </div>
            <button className="g-btn" onClick={()=>setShowModal(true)} style={{width:"100%",borderRadius:8,fontSize:13,padding:"10px 20px"}}>
              <GoogleLogo/><span style={{color:"#3c4043"}}>Use another account</span>
            </button>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,marginBottom:12}}>
            <button className="g-btn" onClick={()=>setShowModal(true)} style={{maxWidth:320,width:"100%",borderRadius:8,fontSize:15,padding:"13px 28px"}}>
              <GoogleLogo/>Continue with Google
            </button>
            <div style={{fontSize:12,color:T.t3}}>Free forever · No credit card needed</div>
          </div>
        )}

        {/* Feature pills */}
        <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:8,marginTop:32}}>
          {[["cloud","Cloud Sync"],["lock","Free SSL"],["globe","Custom Domains"],["zap","Instant Deploy"],["refresh","Rollback"],["activity","Analytics"]].map(([ic,lbl])=>(
            <div key={lbl} style={{display:"flex",alignItems:"center",gap:7,background:T.bg2,border:`1px solid ${T.bg4}`,borderRadius:100,padding:"6px 14px",fontSize:12,color:T.t2}}>
              <Icon name={ic} size={12} color={T.t3}/>{lbl}
            </div>
          ))}
        </div>
      </div>

      <div style={{textAlign:"center",padding:"16px",borderTop:`1px solid ${T.bg4}`,fontSize:12,color:T.t3}}>
        Data is securely stored in the cloud and syncs across all devices.
      </div>

      {showModal && <GoogleAuthModal onSuccess={handleSuccess} onClose={()=>setShowModal(false)} savedAccounts={savedAccounts}/>}
    </div>
  );
});

// ─── TOAST ────────────────────────────────────────────────────────────────────
const ToastContainer = memo(({toasts})=>{
  const colors={success:T.green,error:T.red,warn:T.amber,info:T.blue};
  return <div className="toast-wrap">{toasts.map(t=>(
    <div key={t.id} className="toast" style={{borderLeft:`3px solid ${colors[t.type]||T.green}`}}>
      <Icon name={t.type==="success"?"check":t.type==="error"?"x":t.type==="warn"?"alert":"info"} size={14} color={colors[t.type]||T.green}/>
      <span style={{color:T.t1,flex:1}}>{t.msg}</span>
    </div>
  ))}</div>;
});

// ─── SMALL UI COMPONENTS ──────────────────────────────────────────────────────
const Dot=memo(({color=T.green,pulse=false})=><span style={{width:7,height:7,borderRadius:"50%",background:color,display:"inline-block",flexShrink:0}} className={pulse?"pulse":""}/>);
const Toggle=memo(({on,onChange})=><button className="toggle" style={{background:on?T.green:T.bg4}} onClick={()=>onChange(!on)}><div className="toggle-knob" style={{left:on?20:2}}/></button>);
const StatCard=memo(({icon,label,value,sub,color=T.t1})=>(
  <div className="card-sm" style={{display:"flex",flexDirection:"column",gap:10}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:11,color:T.t2,fontWeight:500,letterSpacing:".04em",textTransform:"uppercase"}}>{label}</span>
      <div style={{width:30,height:30,borderRadius:8,background:T.bg3,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={icon} size={14} color={color}/></div>
    </div>
    <div style={{fontSize:22,fontWeight:700,color:T.t1,letterSpacing:"-.02em"}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:T.t2}}>{sub}</div>}
  </div>
));
const ProgressBar=memo(({val,max,color=T.green})=><div className="prog"><div className="prog-bar" style={{width:`${clamp((val/max)*100,0,100)}%`,background:color}}/></div>);
const MiniChart=memo(({data=[],height=56,color=T.green})=>{const max=Math.max(...data,1);return<div style={{display:"flex",alignItems:"flex-end",gap:3,height}}>{data.map((v,i)=><div key={i} style={{flex:1,background:i===data.length-1?color:color+"44",borderRadius:"2px 2px 0 0",height:`${(v/max)*100}%`,minHeight:2}}/>)}</div>;});
const StatusBadge=memo(({status})=>{const m={live:["badge-green","Live"],paused:["badge-yellow","Paused"],building:["badge-blue","Building"],error:["badge-red","Failed"],draft:["badge-gray","Draft"]};const[cls,label]=m[status]||["badge-gray",status];return<span className={`badge ${cls}`}><Dot color={status==="live"?T.green:status==="error"?T.red:status==="building"?T.blue:T.amber} pulse={status==="live"||status==="building"}/>{label}</span>;});
const EmptyState=memo(({icon,title,desc,action,actionLabel})=>(
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"64px 24px",textAlign:"center",gap:16}}>
    <div style={{width:56,height:56,borderRadius:14,background:T.bg2,border:`1px solid ${T.bg4}`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={icon} size={22} color={T.t3}/></div>
    <div><div style={{fontSize:15,fontWeight:600,color:T.t1,marginBottom:6}}>{title}</div><div style={{fontSize:13,color:T.t2,maxWidth:320,lineHeight:1.6}}>{desc}</div></div>
    {action&&<button className="btn btn-primary" onClick={action}>{actionLabel}</button>}
  </div>
));
const Skeleton=memo(({w="100%",h=16,r=6,mb=0})=><div className="shimmer" style={{width:w,height:h,borderRadius:r,marginBottom:mb,flexShrink:0}}/>);

// ─── DEPLOY TIMELINE ──────────────────────────────────────────────────────────
const DEPLOY_STEPS=[
  {id:"init",label:"Initializing build environment",icon:"server"},
  {id:"files",label:"Processing & validating files",icon:"package"},
  {id:"ssl",label:"Issuing SSL certificate",icon:"lock"},
  {id:"cdn",label:"Deploying to edge network",icon:"globe"},
  {id:"done",label:"Site is live!",icon:"zap"},
];
const DeployTimeline=memo(({currentStep,logs=[]})=>(
  <div>{DEPLOY_STEPS.map((s,i)=>{const done=i<currentStep,active=i===currentStep;return(
    <div key={s.id}><div className="deploy-step">
      <div className="deploy-step-icon" style={{background:done?T.greenDim:active?T.blueDim:T.bg3,border:`1px solid ${done?T.green+"44":active?T.blue+"44":T.bg4}`}}>
        {active?<span className="spin" style={{fontSize:10,color:T.blue}}>◌</span>:done?<Icon name="check" size={12} color={T.green}/>:<Icon name={s.icon} size={12} color={T.t3}/>}
      </div>
      <div style={{flex:1,paddingTop:4}}>
        <div style={{fontSize:13,color:done||active?T.t1:T.t2,fontWeight:done||active?500:400}}>{s.label}</div>
        {active&&logs.filter(l=>l.step===s.id).slice(-1).map((l,j)=><div key={j} style={{fontSize:11,color:T.t2,fontFamily:"'JetBrains Mono',monospace",marginTop:3}}>{l.msg}</div>)}
      </div>
      {done&&<Icon name="check" size={13} color={T.green} style={{marginTop:5}}/>}
    </div>{i<DEPLOY_STEPS.length-1&&<div className="deploy-step-line"/>}</div>
  );})}</div>
));

// ─── COMMAND PALETTE ──────────────────────────────────────────────────────────
const CommandPalette=memo(({onClose,onNavigate,sites=[]})=>{
  const [q,setQ]=useState("");const inputRef=useRef();
  useEffect(()=>{inputRef.current?.focus();},[]);
  const items=[
    {label:"Dashboard",icon:"home",action:()=>onNavigate("dash")},
    {label:"All Sites",icon:"grid",action:()=>onNavigate("sites")},
    {label:"New Deployment",icon:"upload",action:()=>onNavigate("new")},
    {label:"Domain Manager",icon:"globe",action:()=>onNavigate("domains")},
    {label:"AI Support",icon:"help",action:()=>onNavigate("support")},
    {label:"Documentation",icon:"file",action:()=>onNavigate("docs")},
    ...sites.map(s=>({label:`Open ${s.sub}.webhost.pro`,icon:"globe",action:()=>onNavigate("site",s.id)})),
  ];
  const filtered=q?items.filter(it=>it.label.toLowerCase().includes(q.toLowerCase())):items;
  return(
    <div className="cmd-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="cmd-box">
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:`1px solid ${T.bg4}`}}>
          <Icon name="search" size={15} color={T.t2}/>
          <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,background:"transparent",border:"none",outline:"none",color:T.t1,fontSize:14}} placeholder="Search or jump to..." onKeyDown={e=>e.key==="Escape"&&onClose()}/>
          <kbd style={{background:T.bg3,border:`1px solid ${T.bg4}`,borderRadius:5,padding:"2px 6px",fontSize:11,color:T.t2}}>ESC</kbd>
        </div>
        <div style={{maxHeight:320,overflowY:"auto",padding:8}}>
          {filtered.length===0&&<div style={{padding:"20px",textAlign:"center",color:T.t2,fontSize:13}}>No results found</div>}
          {filtered.map((it,i)=>(
            <button key={i} onClick={()=>{it.action();onClose();}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 12px",background:"transparent",border:"none",borderRadius:8,color:T.t1,cursor:"pointer",textAlign:"left",transition:"background .1s"}} onMouseEnter={e=>e.currentTarget.style.background=T.bg3} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:28,height:28,background:T.bg3,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name={it.icon} size={13} color={T.t2}/></div>
              <span style={{fontSize:13,flex:1}}>{it.label}</span>
              <Icon name="chevron-right" size={13} color={T.t3}/>
            </button>
          ))}
        </div>
        <div style={{padding:"8px 16px",borderTop:`1px solid ${T.bg4}`,fontSize:11,color:T.t3}}>ESC to close</div>
      </div>
    </div>
  );
});

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar=memo(({page,onNav,sites,sideOpen,setSideOpen,user,onLogout})=>{
  const mainNav=[
    {id:"dash",  icon:"home",      label:"Dashboard"},
    {id:"sites", icon:"grid",      label:"My Sites"},
    {id:"new",   icon:"upload",    label:"New Deploy"},
    {id:"domains",icon:"globe",    label:"Domain Manager"},
  ];
  const toolsNav=[
    {id:"support",icon:"help",     label:"AI Support"},
    {id:"docs",  icon:"file",      label:"Documentation"},
  ];
  const liveCount = sites.filter(s=>s.status==="live").length;
  const totalBW   = sites.reduce((a,s)=>a+s.bandwidth,0);
  const initials  = user?.name ? user.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "U";

  const NavBtn = ({item}) => (
    <button className={`nav-item${(page===item.id||(page==="site"&&item.id==="sites"))?" act":""}`}
      onClick={()=>{onNav(item.id);setSideOpen(false);}}>
      <span style={{width:20,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name={item.icon} size={15}/></span>
      <span style={{flex:1}}>{item.label}</span>
      {item.id==="sites"&&sites.length>0&&
        <span style={{background:T.bg3,color:T.t2,fontSize:10,padding:"1px 6px",borderRadius:100,fontFamily:"JetBrains Mono,monospace"}}>{sites.length}</span>}
      {item.id==="sites"&&liveCount>0&&
        <span style={{background:T.greenDim,color:T.green,fontSize:9,padding:"1px 5px",borderRadius:100}}>{liveCount} live</span>}
    </button>
  );

  return(
    <>
      <div className={`mob-overlay${sideOpen?" show":""}`} onClick={()=>setSideOpen(false)}/>
      <aside className={`sidebar${sideOpen?" open":""}`} style={{overflowY:"auto"}}>

        {/* ── Logo ─── */}
        <div style={{padding:"16px 14px 12px",borderBottom:`1px solid ${T.bg4}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:30,height:30,borderRadius:8,background:T.greenDim,border:`1px solid ${T.green}33`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name="layers" size={15} color={T.green}/>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:T.t1,letterSpacing:"-.02em"}}>WebHost<span style={{color:T.green}}>.pro</span></div>
              <div style={{fontSize:10,color:T.t3,display:"flex",alignItems:"center",gap:4}}>
                <span className="pulse" style={{width:5,height:5,borderRadius:"50%",background:T.green,display:"inline-block"}}/>
                All systems operational
              </div>
            </div>
          </div>
        </div>

        {/* ── Main nav ─── */}
        <nav style={{padding:"10px 8px"}}>
          <div style={{fontSize:10,color:T.t3,padding:"4px 10px 6px",letterSpacing:".08em",textTransform:"uppercase"}}>Main</div>
          {mainNav.map(n=><NavBtn key={n.id} item={n}/>)}

          <div style={{height:1,background:T.bg4,margin:"10px 0"}}/>

          <div style={{fontSize:10,color:T.t3,padding:"4px 10px 6px",letterSpacing:".08em",textTransform:"uppercase"}}>Tools</div>
          {toolsNav.map(n=><NavBtn key={n.id} item={n}/>)}
        </nav>

        {/* ── Quick Stats ─── */}
        <div style={{margin:"0 8px 8px",background:T.bg3,border:`1px solid ${T.bg4}`,borderRadius:10,padding:"12px"}}>
          <div style={{fontSize:10,color:T.t3,fontFamily:"JetBrains Mono,monospace",letterSpacing:".06em",marginBottom:10}}>QUICK STATS</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[
              {label:"Sites",   value:sites.length,        icon:"grid",     color:T.t1},
              {label:"Live",    value:liveCount,            icon:"activity", color:T.green},
              {label:"Domains", value:sites.reduce((a,s)=>a+(s.customDomains?.length||0),0), icon:"globe", color:T.blue},
              {label:"BW Used", value:`${totalBW}MB`,      icon:"zap",      color:T.purple},
            ].map(s=>(
              <div key={s.label} style={{background:T.bg2,border:`1px solid ${T.bg4}`,borderRadius:7,padding:"7px 8px"}}>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                  <Icon name={s.icon} size={11} color={s.color}/>
                  <span style={{fontSize:10,color:T.t3}}>{s.label}</span>
                </div>
                <div style={{fontSize:16,fontWeight:700,color:s.color}}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Cloud sync indicator ─── */}
        <div style={{margin:"0 8px 8px",display:"flex",alignItems:"center",gap:7,padding:"8px 10px",background:T.greenDim,border:`1px solid ${T.green}22`,borderRadius:8}}>
          <Icon name="cloud" size={13} color={T.green}/>
          <span style={{fontSize:11,color:T.green,fontWeight:500}}>Cloud Sync Active</span>
          <span className="pulse" style={{width:5,height:5,borderRadius:"50%",background:T.green,display:"inline-block",marginLeft:"auto"}}/>
        </div>

        {/* ── Free plan bar ─── */}
        <div style={{margin:"0 8px 8px",background:T.bg3,border:`1px solid ${T.bg4}`,borderRadius:8,padding:"9px 11px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:11,color:T.t2,fontWeight:500}}>Free Plan</span>
            <span style={{fontSize:10,color:T.green,cursor:"pointer",fontWeight:600}}>Upgrade ↗</span>
          </div>
          <ProgressBar val={sites.length} max={10}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.t3,marginTop:5}}>
            <span>{sites.length}/10 sites</span><span>500MB storage</span>
          </div>
        </div>

        {/* ── Switch account / add account ─── */}
        <div style={{margin:"0 8px 8px",background:T.bg3,border:`1px solid ${T.bg4}`,borderRadius:8,overflow:"hidden"}}>
          <div style={{padding:"8px 10px",borderBottom:`1px solid ${T.bg4}`}}>
            <div style={{fontSize:10,color:T.t3,fontFamily:"JetBrains Mono,monospace",letterSpacing:".06em",marginBottom:6}}>ACCOUNT</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:user?.avatar||T.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#000",flexShrink:0}}>{initials}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:T.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name||"User"}</div>
                <div style={{fontSize:10,color:T.t3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.email}</div>
              </div>
            </div>
          </div>
          <button className="nav-item" style={{borderRadius:0,padding:"8px 10px"}} onClick={()=>{setSideOpen(false);onLogout();}}>
            <Icon name="log-out" size={13}/>
            <span style={{fontSize:12}}>Sign out</span>
          </button>
        </div>

        {/* ── Keyboard shortcut hint ─── */}
        <div style={{margin:"0 8px 14px",padding:"7px 10px",borderRadius:8,background:T.bg3,border:`1px solid ${T.bg4}`,display:"flex",alignItems:"center",gap:6}}>
          <Icon name="command" size={12} color={T.t3}/>
          <span style={{fontSize:11,color:T.t3}}>Press</span>
          <kbd style={{background:T.bg2,border:`1px solid ${T.bg4}`,borderRadius:4,padding:"1px 5px",fontSize:10,color:T.t2}}>⌘K</kbd>
          <span style={{fontSize:11,color:T.t3}}>to search</span>
        </div>

      </aside>
    </>
  );
});

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
const Topbar=memo(({page,selSite,onBack,onCmd,setSideOpen})=>(
  <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 22px",borderBottom:`1px solid ${T.bg4}`,background:T.bg1,flexShrink:0,gap:12,position:"sticky",top:0,zIndex:90}}>
    <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
      <button className="btn-icon mob-btn" onClick={()=>setSideOpen(p=>!p)} style={{display:"none"}}><Icon name="menu" size={18}/></button>
      {page==="site"&&selSite?(
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <button className="btn btn-ghost btn-sm" onClick={onBack} style={{display:"flex",alignItems:"center",gap:5}}><Icon name="arrow-left" size={13}/>Sites</button>
          <span style={{color:T.bg4}}>/</span>
          <span className="mono" style={{fontSize:13,color:T.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selSite.sub}.webhost.pro</span>
          <StatusBadge status={selSite.status}/>
        </div>
      ):<div style={{fontSize:15,fontWeight:600,color:T.t1}}>{page==="dash"?"Dashboard":page==="sites"?"Sites":page==="new"?"New Deployment":page==="domains"?"Domain Manager":page==="support"?"AI Support":"Documentation"}</div>}
    </div>
    <button className="btn btn-ghost btn-sm" onClick={onCmd} style={{display:"flex",alignItems:"center",gap:6}}>
      <Icon name="search" size={13}/>
      <kbd style={{background:T.bg3,border:`1px solid ${T.bg4}`,borderRadius:4,padding:"1px 5px",fontSize:10,color:T.t3}}>⌘K</kbd>
    </button>
  </header>
));

// ─── NEW DEPLOY ───────────────────────────────────────────────────────────────
const NewDeploy=memo(({sites,onDeployed,toast})=>{
  const [sub,setSub]=useState("");const [htmlCode,setHtmlCode]=useState("");const [files,setFiles]=useState([]);
  const [dragOver,setDragOver]=useState(false);const [deploying,setDeploying]=useState(false);
  const [deployStep,setDeployStep]=useState(-1);const [deployLogs,setDeployLogs]=useState([]);
  const [envVars,setEnvVars]=useState([]);const [tab,setTab]=useState("upload");const fileRef=useRef();
  const subErr=validateSub(sub,sites);
  const readFiles=useCallback((fileList)=>{
    const allowed=["html","htm","css","js","json","txt","svg","png","jpg","jpeg","gif","ico","webp"];
    const added=[];
    Array.from(fileList).forEach(f=>{
      const ext=f.name.split(".").pop().toLowerCase();
      if(!allowed.includes(ext)){toast(`"${f.name}" not supported`,"warn");return;}
      if(f.size>10*1024*1024){toast(`"${f.name}" exceeds 10MB`,"warn");return;}
      added.push({name:f.name,size:f.size,ext,lastMod:Date.now()});
      if(["html","htm"].includes(ext)){const r=new FileReader();r.onload=e=>setHtmlCode(e.target.result);r.readAsText(f);}
    });
    if(added.length){setFiles(p=>[...p,...added]);toast(`${added.length} file${added.length>1?"s":""} added`);}
  },[toast]);
  const canDeploy=sub.length>=3&&!subErr&&(htmlCode.trim()||files.length>0)&&!deploying;
  const doDeploy=async()=>{
    if(!canDeploy)return;setDeploying(true);setDeployStep(0);setDeployLogs([]);
    const addLog=(step,msg,type="info")=>setDeployLogs(p=>[...p,{step,msg,type}]);
    const steps=[
      async()=>{addLog("init","Allocating build environment...");await sleep(500);},
      async()=>{addLog("files","Scanning files...");await sleep(600);addLog("files","Validated");},
      async()=>{addLog("ssl","Requesting certificate...");await sleep(700);addLog("ssl","SSL issued");},
      async()=>{addLog("cdn","Propagating to edge nodes...");await sleep(700);addLog("cdn","Done");},
    ];
    for(let i=0;i<steps.length;i++){setDeployStep(i);await steps[i]();}
    setDeployStep(4);
    const finalHtml=sanitizeHTML(htmlCode.trim()||DEMO_HTML);
    const fw=detectFramework(finalHtml);
    const site={id:uid(),sub,html:finalHtml,files:files.length?files:[{name:"index.html",size:finalHtml.length,ext:"html",lastMod:Date.now()}],status:"live",ssl:true,framework:fw,deployedAt:Date.now(),visits:rnd(0,10),bandwidth:rnd(1,30),customDomains:[],envVars:envVars.filter(e=>e.key.trim()),settings:{https:true,gzip:true,spa:fw==="React"||fw==="Vue"||fw==="Angular"||fw==="Next.js",password:""},history:[{id:uid(),deployedAt:Date.now(),status:"live",trigger:"Manual Upload",html:finalHtml}],logs:[{time:new Date().toLocaleTimeString(),msg:"Build started",type:"info"},{time:new Date().toLocaleTimeString(),msg:`Framework: ${fw}`,type:"info"},{time:new Date().toLocaleTimeString(),msg:"SSL issued",type:"success"},{time:new Date().toLocaleTimeString(),msg:`✓ https://${sub}.webhost.pro is live`,type:"success"}],analytics:{days:Array.from({length:7},()=>rnd(0,40)),uniqueVisitors:rnd(5,100),bounceRate:rnd(25,70),avgTime:`${rnd(1,5)}m ${rnd(0,59)}s`,sources:[["Direct",rnd(30,55)],["Google",rnd(10,30)],["Social",rnd(5,18)],["Referral",rnd(2,12)]]}};
    await sleep(400);
    onDeployed(site);
    toast(`🎉 ${site.sub}.webhost.pro is live!`);
  };
  if(deploying)return(<div className="fade-in" style={{maxWidth:500}}><div style={{marginBottom:20}}><div style={{fontSize:15,fontWeight:600,color:T.t1,marginBottom:4}}>Deploying {sub}.webhost.pro</div><div style={{fontSize:13,color:T.t2}}>Setting up your site...</div></div><div className="card"><DeployTimeline currentStep={deployStep} logs={deployLogs}/></div>{deployStep===4&&<div style={{marginTop:16,padding:"14px 16px",background:T.greenDim,border:`1px solid ${T.green}33`,borderRadius:10,display:"flex",alignItems:"center",gap:10}}><Icon name="check" size={16} color={T.green}/><div><div style={{fontSize:13,color:T.green,fontWeight:600}}>Deployment successful!</div><div style={{fontSize:11,color:T.t2,marginTop:2}}>Redirecting to your site...</div></div></div>}</div>);
  return(
    <div className="fade-in" style={{maxWidth:620}}>
      <div className="card" style={{marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <div style={{width:22,height:22,borderRadius:6,background:sub.length>=3&&!subErr?T.greenDim:T.bg3,border:`1px solid ${sub.length>=3&&!subErr?T.green+"44":T.bg4}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:sub.length>=3&&!subErr?T.green:T.t2,flexShrink:0}}>1</div>
          <span style={{fontSize:13,fontWeight:600,color:T.t1}}>Choose a subdomain</span>
        </div>
        <div style={{display:"flex"}}>
          <input className={`field mono${subErr?" err":""}`} style={{borderRadius:"8px 0 0 8px",borderRight:"none"}} placeholder="my-website" value={sub} onChange={e=>setSub(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"").slice(0,32))}/>
          <div style={{background:T.bg3,border:`1px solid ${T.bg4}`,borderRadius:"0 8px 8px 0",padding:"9px 12px",fontSize:12,color:T.t2,whiteSpace:"nowrap",fontFamily:"'JetBrains Mono',monospace"}}>.webhost.pro</div>
        </div>
        {sub&&subErr&&<div style={{fontSize:11,color:T.red,marginTop:7,display:"flex",alignItems:"center",gap:5}}><Icon name="alert" size={11} color={T.red}/>{subErr}</div>}
        {sub.length>=3&&!subErr&&<div style={{marginTop:10,display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:T.greenDim,border:`1px solid ${T.green}33`,borderRadius:8}}><Dot color={T.green} pulse/><span className="mono" style={{fontSize:12,color:T.green}}>https://{sub}.webhost.pro</span><span className="badge badge-green" style={{marginLeft:"auto",fontSize:10}}>Available</span></div>}
      </div>
      <div className="card" style={{marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <div style={{width:22,height:22,borderRadius:6,background:files.length||htmlCode?T.greenDim:T.bg3,border:`1px solid ${files.length||htmlCode?T.green+"44":T.bg4}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:files.length||htmlCode?T.green:T.t2,flexShrink:0}}>2</div>
          <span style={{fontSize:13,fontWeight:600,color:T.t1}}>Upload files or write code</span>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:14,background:T.bg3,padding:3,borderRadius:8,width:"fit-content"}}>
          {["upload","editor"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"5px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:500,background:tab===t?T.bg2:"transparent",color:tab===t?T.t1:T.t2,transition:"all .15s"}}>{t==="upload"?"File Upload":"HTML Editor"}</button>)}
        </div>
        {tab==="upload"&&<>
          <div className={`dropzone${dragOver?" over":""}`} onClick={()=>fileRef.current.click()} onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);readFiles(e.dataTransfer.files);}}>
            <input ref={fileRef} type="file" multiple accept=".html,.htm,.css,.js,.json,.txt,.svg,.png,.jpg,.jpeg,.gif,.ico,.webp" style={{display:"none"}} onChange={e=>readFiles(e.target.files)}/>
            {files.length===0?<><Icon name="upload" size={28} color={T.t3} style={{marginBottom:10}}/><div style={{color:T.t2,fontSize:13,marginBottom:5}}>Drag & drop or <span style={{color:T.green,fontWeight:500}}>browse</span></div><div style={{color:T.t3,fontSize:11}}>HTML, CSS, JS, Images · Max 10MB</div></>:<><Icon name="package" size={24} color={T.green} style={{marginBottom:8}}/><div style={{color:T.green,fontSize:13,fontWeight:600}}>{files.length} file{files.length>1?"s":""} ready</div><div style={{color:T.t2,fontSize:11,marginTop:4}}>Click to add more</div></>}
          </div>
          {files.length>0&&<div style={{marginTop:10}}>{files.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",borderRadius:7,background:T.bg3,marginBottom:4}}><Icon name="file" size={13} color={T.t2}/><span className="mono" style={{fontSize:12,flex:1,color:T.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</span><span style={{fontSize:11,color:T.t3,flexShrink:0}}>{fmtSz(f.size)}</span><button className="btn-icon" onClick={()=>setFiles(p=>p.filter((_,j)=>j!==i))}><Icon name="x" size={12}/></button></div>)}</div>}
        </>}
        {tab==="editor"&&<textarea className="code-editor" placeholder={DEMO_HTML} value={htmlCode} onChange={e=>setHtmlCode(e.target.value)}/>}
      </div>
      <button className="btn btn-primary" style={{width:"100%",padding:"12px",fontSize:14,borderRadius:10}} onClick={doDeploy} disabled={!canDeploy}><Icon name="upload" size={15}/>Deploy to WebHost Pro</button>
    </div>
  );
});

// ─── SITE MANAGER ─────────────────────────────────────────────────────────────
const SiteManager=memo(({site,onUpdate,onDelete,toast})=>{
  const [tab,setTab]=useState("overview");const [editCode,setEditCode]=useState(site.html||"");
  const [prevMode,setPrevMode]=useState("desktop");const [newDomain,setNewDomain]=useState("");
  const [addDomainOpen,setAddDomainOpen]=useState(false);const [savingCode,setSavingCode]=useState(false);
  const [newEnvKey,setNewEnvKey]=useState("");const [newEnvVal,setNewEnvVal]=useState("");
  const [showPass,setShowPass]=useState(false);
  useEffect(()=>{setEditCode(site.html||"");},[site.id]);
  const saveCode=async()=>{setSavingCode(true);await sleep(300);const s=sanitizeHTML(editCode);onUpdate({...site,html:s,files:site.files?.map(f=>f.ext==="html"||f.ext==="htm"?{...f,lastMod:Date.now(),size:s.length}:f)||[]});setSavingCode(false);toast("Code saved!");};
  const addDomain=()=>{const d=newDomain.trim().toLowerCase().replace(/^https?:\/\//,"");if(!/^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/.test(d)){toast("Enter a valid domain","warn");return;}onUpdate({...site,customDomains:[...(site.customDomains||[]),{domain:d,status:"pending",addedAt:Date.now()}]});setNewDomain("");setAddDomainOpen(false);toast("Domain added! Configure DNS to activate.");};
  const TABS=["overview","preview","files","editor","analytics","domains","env","settings","logs","history"];
  const pw=prevMode==="desktop"?"100%":prevMode==="tablet"?"768px":"375px";
  return(
    <div className="fade-in">
      <div className="tab-bar" style={{marginBottom:16}}>{TABS.map(t=><button key={t} className={`tab-btn${tab===t?" act":""}`} onClick={()=>{setTab(t);if(t==="editor")setEditCode(site.html||"");}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}</div>

      {tab==="overview"&&<div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:16}}><StatCard icon="activity" label="Visits" value={site.visits} sub="All time" color={T.green}/><StatCard icon="file" label="Files" value={site.files?.length||0} sub="Deployed"/><StatCard icon="lock" label="SSL" value={site.ssl?"Active":"None"} sub="Auto-renewed" color={T.blue}/><StatCard icon="zap" label="Bandwidth" value={`${site.bandwidth}MB`} sub="This month" color={T.purple}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div className="card"><div style={{fontSize:11,color:T.t2,fontWeight:500,textTransform:"uppercase",letterSpacing:".06em",marginBottom:12}}>Live URL</div><div style={{display:"flex",alignItems:"center",gap:8,background:T.bg3,border:`1px solid ${T.green}33`,borderRadius:8,padding:"9px 12px"}}><Dot color={site.status==="live"?T.green:T.amber} pulse={site.status==="live"}/><span className="mono" style={{fontSize:11,color:T.green,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>https://{site.sub}.webhost.pro</span><button className="btn-icon" onClick={()=>{navigator.clipboard?.writeText(`https://${site.sub}.webhost.pro`);toast("URL copied!");}}><Icon name="copy" size={13}/></button></div>{site.customDomains?.map(d=><div key={d.domain} style={{display:"flex",alignItems:"center",gap:8,background:T.bg3,border:`1px solid ${T.bg4}`,borderRadius:8,padding:"7px 12px",marginTop:6}}><span className="mono" style={{fontSize:11,color:T.t1,flex:1}}>{d.domain}</span><StatusBadge status={d.status==="active"?"live":"paused"}/></div>)}</div><div className="card"><div style={{fontSize:11,color:T.t2,fontWeight:500,textTransform:"uppercase",letterSpacing:".06em",marginBottom:12}}>Quick Actions</div><div style={{display:"flex",flexDirection:"column",gap:6}}><button className="btn btn-ghost" style={{textAlign:"left",justifyContent:"flex-start",gap:8}} onClick={()=>setTab("editor")}><Icon name="edit" size={13}/>Edit Code</button><button className="btn btn-ghost" style={{textAlign:"left",justifyContent:"flex-start",gap:8}} onClick={()=>setTab("domains")}><Icon name="link" size={13}/>Add Custom Domain</button><button className="btn btn-ghost" style={{textAlign:"left",justifyContent:"flex-start",gap:8}} onClick={()=>onUpdate({...site,status:site.status==="live"?"paused":"live"})}><Icon name={site.status==="live"?"pause":"play"} size={13}/>{site.status==="live"?"Pause Site":"Resume Site"}</button><button className="btn btn-danger" style={{textAlign:"left",justifyContent:"flex-start",gap:8}} onClick={()=>onDelete(site.id)}><Icon name="trash" size={13}/>Delete Site</button></div></div></div></div>}

      {tab==="preview"&&<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:10}}><div style={{display:"flex",gap:7}}><StatusBadge status={site.status}/><span className="badge badge-blue"><Icon name="lock" size={10}/>HTTPS</span></div><div style={{display:"flex",gap:4,background:T.bg3,padding:3,borderRadius:8}}>{["desktop","tablet","mobile"].map(m=><button key={m} onClick={()=>setPrevMode(m)} style={{padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,background:prevMode===m?T.bg2:"transparent",color:prevMode===m?T.t1:T.t2,transition:"all .15s",textTransform:"capitalize"}}>{m}</button>)}</div></div><div style={{border:`1px solid ${T.bg4}`,borderRadius:12,overflow:"hidden"}}><div style={{background:T.bg0,padding:"9px 14px",display:"flex",alignItems:"center",gap:9}}><div style={{display:"flex",gap:5}}>{[T.red,T.amber,T.green].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}</div><div style={{flex:1,background:T.bg2,borderRadius:6,padding:"4px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.t2,display:"flex",alignItems:"center",gap:6}}><Icon name="lock" size={11} color={T.green}/>https://{site.sub}.webhost.pro</div></div><div style={{display:"flex",justifyContent:"center",background:prevMode!=="desktop"?T.bg0:"transparent",padding:prevMode!=="desktop"?"20px":0}}><iframe srcDoc={site.html||""} title="Preview" sandbox="allow-scripts allow-same-origin" style={{width:pw,height:480,border:prevMode!=="desktop"?`1px solid ${T.bg4}`:"none",borderRadius:prevMode!=="desktop"?10:0,transition:"width .3s ease"}}/></div></div></div>}

      {tab==="files"&&<div><div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:13,color:T.t2}}>{site.files?.length||0} files</span><button className="btn btn-primary btn-sm" onClick={()=>{const inp=document.createElement("input");inp.type="file";inp.multiple=true;inp.accept=".html,.htm,.css,.js,.json,.txt,.svg,.png,.jpg,.jpeg,.gif";inp.onchange=e=>{const nf=Array.from(e.target.files).map(f=>({name:f.name,size:f.size,ext:f.name.split(".").pop().toLowerCase(),lastMod:Date.now()}));onUpdate({...site,files:[...(site.files||[]),...nf]});toast(`${nf.length} file(s) uploaded`);};inp.click();}} style={{display:"flex",alignItems:"center",gap:5}}><Icon name="upload" size={13}/>Upload</button></div>{!site.files?.length?<EmptyState icon="file" title="No files" desc="Upload files to deploy."/>:<div className="card" style={{padding:0}}><table className="data-table"><thead><tr><th>Name</th><th>Type</th><th>Size</th><th>Modified</th><th></th></tr></thead><tbody>{site.files.map((f,i)=><tr key={i}><td><span className="mono" style={{fontSize:12}}>{f.name}</span></td><td><span className="badge badge-gray" style={{fontSize:10}}>{f.ext}</span></td><td style={{color:T.t2}}>{fmtSz(f.size)}</td><td style={{color:T.t2,fontSize:11}}>{fmtDate(f.lastMod)}</td><td><div style={{display:"flex",gap:4}}>{(f.ext==="html"||f.ext==="htm")&&<button className="btn-icon" onClick={()=>setTab("editor")} title="Edit"><Icon name="edit" size={13}/></button>}<button className="btn-icon" onClick={()=>{onUpdate({...site,files:site.files.filter((_,j)=>j!==i)});toast("File removed","info");}} title="Remove"><Icon name="trash" size={13} color={T.red}/></button></div></td></tr>)}</tbody></table></div>}</div>}

      {tab==="editor"&&<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span className="mono" style={{fontSize:12,color:T.green}}>index.html</span><span className="badge badge-blue" style={{fontSize:10}}>Live Editor</span></div><div style={{display:"flex",gap:8}}><button className="btn btn-ghost btn-sm" onClick={()=>setTab("preview")} style={{display:"flex",alignItems:"center",gap:5}}><Icon name="eye" size={13}/>Preview</button><button className="btn btn-primary btn-sm" onClick={saveCode} disabled={savingCode} style={{display:"flex",alignItems:"center",gap:5}}>{savingCode?<><span className="spin">◌</span>Saving</>:<><Icon name="check" size={13}/>Save</>}</button></div></div><textarea className="code-editor" style={{minHeight:460}} value={editCode} onChange={e=>setEditCode(e.target.value)}/><div style={{fontSize:11,color:T.t3,marginTop:8}}>Save changes, then check Preview tab.</div></div>}

      {tab==="analytics"&&<div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:16}}><StatCard icon="user" label="Unique Visitors" value={site.analytics?.uniqueVisitors||0} color={T.green}/><StatCard icon="activity" label="Bounce Rate" value={(site.analytics?.bounceRate||0)+"%"} color={site.analytics?.bounceRate<50?T.green:T.amber}/><StatCard icon="clock" label="Avg. Session" value={site.analytics?.avgTime||"—"} color={T.blue}/><StatCard icon="zap" label="Bandwidth" value={`${site.bandwidth}MB`} color={T.purple}/></div><div className="card" style={{marginBottom:12}}><div style={{fontSize:11,color:T.t2,fontWeight:500,textTransform:"uppercase",letterSpacing:".06em",marginBottom:14}}>Daily Visits</div><MiniChart data={site.analytics?.days||[]} height={70}/><div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><span key={d} style={{fontSize:10,color:T.t3,flex:1,textAlign:"center"}}>{d}</span>)}</div></div><div className="card">{(site.analytics?.sources||[]).map(([src,pct])=><div key={src} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12}}><span style={{color:T.t2}}>{src}</span><span style={{color:T.t1,fontWeight:600}}>{pct}%</span></div><ProgressBar val={pct} max={100} color={src==="Direct"?T.green:src==="Google"?T.blue:src==="Social"?T.purple:T.t3}/></div>)}</div></div>}

      {tab==="domains"&&<div><div className="card" style={{marginBottom:12}}><div style={{fontSize:11,color:T.t2,fontWeight:500,textTransform:"uppercase",letterSpacing:".06em",marginBottom:12}}>Free Subdomain</div><div style={{display:"flex",alignItems:"center",gap:10,background:T.bg3,border:`1px solid ${T.green}33`,borderRadius:9,padding:"10px 14px"}}><Dot color={T.green} pulse/><span className="mono" style={{fontSize:13,color:T.green,flex:1}}>https://{site.sub}.webhost.pro</span><span className="badge badge-green">Active</span><button className="btn-icon" onClick={()=>{navigator.clipboard?.writeText(`https://${site.sub}.webhost.pro`);toast("URL copied!");}}><Icon name="copy" size={14}/></button></div></div><div className="card"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div><div style={{fontSize:13,fontWeight:600,color:T.t1}}>Custom Domains</div><div style={{fontSize:11,color:T.t2,marginTop:2}}>Connect your own domain</div></div>{!addDomainOpen&&<button className="btn btn-primary btn-sm" onClick={()=>setAddDomainOpen(true)} style={{display:"flex",alignItems:"center",gap:5}}><Icon name="plus" size={13}/>Add Domain</button>}</div>{addDomainOpen&&<div style={{background:T.bg3,border:`1px solid ${T.bg4}`,borderRadius:10,padding:14,marginBottom:16}}><div style={{display:"flex",gap:8,marginBottom:12}}><input className="field mono" placeholder="example.com" value={newDomain} onChange={e=>setNewDomain(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addDomain()}/><button className="btn btn-primary" onClick={addDomain}>Add</button><button className="btn btn-ghost" onClick={()=>{setAddDomainOpen(false);setNewDomain("");}}>Cancel</button></div><div style={{background:T.bg2,border:`1px solid ${T.bg4}`,borderRadius:8,padding:"12px 14px"}}><div className="mono" style={{fontSize:11,color:T.t2,lineHeight:2}}><div>1. Go to your DNS provider (Cloudflare/GoDaddy/Namecheap)</div><div>2. Add CNAME record:</div><div style={{background:T.bg0,padding:"6px 12px",borderRadius:7,color:T.green,margin:"4px 0"}}>Name: @ or www → Value: {site.sub}.webhost.pro</div><div>3. Save · Propagation: 1–48 hours</div></div></div></div>}{!site.customDomains?.length?<EmptyState icon="link" title="No custom domains" desc="Add your own domain."/>:site.customDomains.map(d=><div key={d.domain} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0",borderBottom:`1px solid ${T.bg4}`}}><Icon name="globe" size={15} color={T.t2}/><div style={{flex:1}}><div className="mono" style={{fontSize:13,color:T.t1}}>{d.domain}</div><div style={{fontSize:11,color:T.t2,marginTop:2}}>Added {fmtDate(d.addedAt)}</div></div><StatusBadge status={d.status==="active"?"live":"paused"}/><button className="btn-icon" onClick={()=>{onUpdate({...site,customDomains:site.customDomains.filter(x=>x.domain!==d.domain)});toast("Domain removed","info");}}><Icon name="trash" size={13} color={T.red}/></button></div>)}</div></div>}

      {tab==="env"&&<div className="card"><div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:4}}>Environment Variables</div><div style={{fontSize:12,color:T.t2,marginBottom:16}}>Key-value pairs baked in at build time.</div>{(site.envVars||[]).length===0&&<EmptyState icon="key" title="No env vars" desc="Add API keys, feature flags, and config."/>}{(site.envVars||[]).map((ev,i)=><div key={i} className="env-row"><span className="mono" style={{fontSize:12,color:T.t1}}>{ev.key}</span><span className="mono" style={{fontSize:12,color:T.t3}}>{"•".repeat(Math.min(ev.value?.length||0,12))}</span><button className="btn-icon" onClick={()=>{onUpdate({...site,envVars:site.envVars.filter((_,j)=>j!==i)});toast("Variable removed","info");}}><Icon name="trash" size={13} color={T.red}/></button></div>)}<div style={{marginTop:14,display:"flex",gap:8}}><input className="field mono" placeholder="KEY_NAME" value={newEnvKey} onChange={e=>setNewEnvKey(e.target.value)} style={{flex:1}}/><input className="field mono" placeholder="value" value={newEnvVal} onChange={e=>setNewEnvVal(e.target.value)} style={{flex:1}}/><button className="btn btn-primary btn-sm" onClick={()=>{if(!newEnvKey.trim())return;onUpdate({...site,envVars:[...(site.envVars||[]),{key:newEnvKey,value:newEnvVal}]});setNewEnvKey("");setNewEnvVal("");toast("Variable added!");}} style={{display:"flex",alignItems:"center",gap:5}}><Icon name="plus" size={13}/>Add</button></div></div>}

      {tab==="settings"&&<div><div className="card" style={{marginBottom:12}}><div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:16}}>Site Configuration</div>{[{key:"https",label:"Force HTTPS",desc:"Redirect HTTP to HTTPS"},{key:"gzip",label:"Gzip Compression",desc:"Compress responses for faster load"},{key:"spa",label:"SPA Mode",desc:"Serve index.html for 404s (React/Vue/Angular)"}].map(({key,label,desc})=><div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.bg4}`}}><div><div style={{fontSize:13,fontWeight:500,color:T.t1}}>{label}</div><div style={{fontSize:11,color:T.t2,marginTop:2}}>{desc}</div></div><Toggle on={site.settings?.[key]||false} onChange={v=>{onUpdate({...site,settings:{...site.settings,[key]:v}});toast("Setting saved");}}/></div>)}</div><div className="card" style={{marginBottom:12}}><div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:10}}>Password Protection</div><div style={{display:"flex",gap:8}}><div style={{position:"relative",flex:1}}><input className="field" type={showPass?"text":"password"} placeholder="Leave empty for public access" value={site.settings?.password||""} onChange={e=>onUpdate({...site,settings:{...site.settings,password:e.target.value}})}/><button className="btn-icon" style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)"}} onClick={()=>setShowPass(p=>!p)}><Icon name={showPass?"eye-off":"eye"} size={14}/></button></div><button className="btn btn-primary" onClick={()=>toast("Password saved!")}>Save</button></div>{site.settings?.password&&<div style={{fontSize:11,color:T.amber,marginTop:8,display:"flex",gap:5,alignItems:"center"}}><Icon name="lock" size={11} color={T.amber}/>Site is password-protected</div>}</div><div className="card" style={{border:`1px solid ${T.red}33`}}><div style={{fontSize:13,fontWeight:600,color:T.red,marginBottom:12}}>Danger Zone</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,color:T.t1}}>Delete this site permanently</div><div style={{fontSize:11,color:T.t2,marginTop:2}}>Cannot be undone</div></div><button className="btn btn-danger" onClick={()=>onDelete(site.id)} style={{display:"flex",alignItems:"center",gap:6}}><Icon name="trash" size={13}/>Delete Site</button></div></div></div>}

      {tab==="logs"&&<div className="card"><div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:14}}>Deployment Logs</div>{!site.logs?.length?<EmptyState icon="terminal" title="No logs" desc="Deployment logs appear here."/>:<div style={{maxHeight:420,overflowY:"auto",background:T.bg0,borderRadius:8,padding:14}}>{site.logs.map((l,i)=><div key={i} className="log-line" style={{color:l.type==="success"?T.green:l.type==="error"?T.red:T.t2}}><span style={{color:T.t3,marginRight:12}}>[{l.time}]</span>{l.msg}</div>)}</div>}</div>}

      {tab==="history"&&<div className="card"><div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:14}}>Deployment History</div>{!site.history?.length?<EmptyState icon="clock" title="No history" desc="Past deployments appear here."/>:site.history.map((h,i)=><div key={h.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<site.history.length-1?`1px solid ${T.bg4}`:""}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:i===0?T.green:T.t3,flexShrink:0}}/><div style={{flex:1}}><div style={{fontSize:13,color:T.t1,fontWeight:i===0?600:400}}>{i===0?"Current":h.trigger||"Manual Upload"}</div><div style={{fontSize:11,color:T.t2,marginTop:2}}>{fmtDate(h.deployedAt)}</div></div>{i===0?<span className="badge badge-green">Current</span>:<button className="btn btn-ghost btn-sm" onClick={()=>{onUpdate({...site,html:h.html||site.html,status:"live"});toast("Rolled back!");}} style={{display:"flex",alignItems:"center",gap:5}}><Icon name="rollback" size={12}/>Rollback</button>}
      </div>)}</div>}
    </div>
  );
});

// ─── AI SUPPORT ───────────────────────────────────────────────────────────────
const Support=memo(({toast})=>{
  const [msgs,setMsgs]=useState([{role:"a",text:"Hi! I'm the WebHost Pro AI assistant. How can I help you today?"}]);
  const [input,setInput]=useState("");const [loading,setLoading]=useState(false);const endRef=useRef();
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,loading]);
  const send=async()=>{const msg=input.trim();if(!msg||loading)return;setInput("");setMsgs(p=>[...p,{role:"u",text:msg}]);setLoading(true);try{const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"You are the WebHost Pro AI support assistant. Be concise and helpful. WebHost Pro is a free static hosting platform with Google login, cloud sync across devices, subdomain deployment, custom domains, code editor, analytics, env vars, and rollback. Respond in clear English.",messages:msgs.filter(m=>m.role==="u").map(m=>({role:"user",content:m.text})).concat([{role:"user",content:msg}])})});const data=await res.json();setMsgs(p=>[...p,{role:"a",text:data?.content?.[0]?.text||"Sorry, try again."}]);}catch{setMsgs(p=>[...p,{role:"a",text:"Connection error. Please try again."}]);}setLoading(false);};
  return(
    <div className="fade-in" style={{maxWidth:600}}>
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.bg4}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,borderRadius:8,background:T.greenDim,border:`1px solid ${T.green}33`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="help" size={14} color={T.green}/></div>
          <div><div style={{fontSize:13,fontWeight:600,color:T.t1}}>AI Support</div><div style={{fontSize:11,color:T.t2}}>Powered by Claude</div></div>
          <span className="badge badge-green" style={{marginLeft:"auto"}}>Online</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",minHeight:340,maxHeight:440,overflowY:"auto",padding:"14px 16px 6px"}}>
          {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="u"?"flex-end":"flex-start",marginBottom:8}}><div style={{padding:"9px 13px",borderRadius:m.role==="u"?"10px 10px 2px 10px":"10px 10px 10px 2px",fontSize:13,maxWidth:"83%",lineHeight:1.6,background:m.role==="u"?T.greenDim:T.bg3,border:`1px solid ${m.role==="u"?T.green+"25":T.bg4}`,color:m.role==="u"?T.t1:T.t2}}>{m.text}</div></div>)}
          {loading&&<div style={{display:"flex",marginBottom:8}}><div style={{padding:"9px 14px",borderRadius:"10px 10px 10px 2px",background:T.bg3,border:`1px solid ${T.bg4}`,display:"flex",alignItems:"center",gap:8,fontSize:13,color:T.t2}}><span className="spin" style={{fontSize:12}}>◌</span>Thinking...</div></div>}
          <div ref={endRef}/>
        </div>
        <div style={{padding:"10px 14px",borderTop:`1px solid ${T.bg4}`,display:"flex",gap:8}}>
          <input className="field" placeholder="Ask a question..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}/>
          <button className="btn btn-primary" onClick={send} disabled={loading||!input.trim()} style={{display:"flex",alignItems:"center",gap:5}}><Icon name="zap" size={13}/>Send</button>
        </div>
      </div>
      <div style={{marginTop:14}}><div style={{fontSize:11,color:T.t3,marginBottom:8}}>Quick questions:</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{["How do I deploy?","Custom domain setup?","What is SPA mode?","How to use env vars?"].map(q=><button key={q} className="btn btn-ghost btn-sm" onClick={()=>setInput(q)} style={{fontSize:11}}>{q}</button>)}</div></div>
    </div>
  );
});

// ─── DOMAIN MANAGER PAGE ─────────────────────────────────────────────────────
const REGISTRARS = [
  { name:"Namecheap",  url:"https://www.namecheap.com/domains/registration/results/?domain=", color:"#de3723", logo:"NC" },
  { name:"GoDaddy",   url:"https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=", color:"#1bdbdb", logo:"GD" },
  { name:"Google Domains", url:"https://domains.google.com/registrar/search?searchTerm=", color:"#4285f4", logo:"G" },
  { name:"Porkbun",   url:"https://porkbun.com/checkout/search?q=", color:"#f76b56", logo:"PB" },
  { name:"Cloudflare",url:"https://www.cloudflare.com/products/registrar/", color:"#f6821f", logo:"CF" },
];

const TLD_PRICES = {
  ".com":"$10.99/yr", ".net":"$12.99/yr", ".org":"$9.99/yr",
  ".io":"$39.99/yr",  ".co":"$24.99/yr",  ".dev":"$14.99/yr",
  ".app":"$14.99/yr", ".site":"$3.99/yr", ".online":"$4.99/yr",
  ".store":"$5.99/yr",".tech":"$7.99/yr", ".me":"$9.99/yr",
};

const DomainManager = memo(({ sites, onUpdateSite, toast }) => {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [connectModal, setConnectModal] = useState(null); // {domain, site}
  const [selectedSite, setSelectedSite] = useState("");
  const [connectStep, setConnectStep] = useState(1);
  const [verifying, setVerifying] = useState(false);
  const [tab, setTab] = useState("search"); // search | connected
  const searchRef = useRef();

  // Collect all connected custom domains across all sites
  const allConnected = useMemo(() => {
    const list = [];
    sites.forEach(s => (s.customDomains||[]).forEach(d => list.push({...d, siteSub:s.sub, siteId:s.id})));
    return list;
  }, [sites]);

  const doSearch = async () => {
    const q = query.trim().toLowerCase().replace(/^https?:\/\//,"").replace(/\/$/, "");
    if (!q) return;
    setSearching(true); setResults(null);
    await new Promise(r => setTimeout(r, 900));

    // Extract base name (strip any tld the user typed)
    const base = q.replace(/\.[a-z]+$/, "");
    const tlds = [".com",".net",".org",".io",".co",".dev",".app",".site",".online",".store",".tech",".me"];

    // Simulate availability: .com taken ~40% for common words
    const commonWords = ["shop","store","app","web","tech","digital","online","pro","hub","labs","studio","cloud","media","solutions","services","agency","design","dev","code","build"];
    const isCommon = commonWords.some(w => base.includes(w));

    const tldResults = tlds.map(tld => {
      let available;
      if (tld === ".com") available = !isCommon && Math.random() > 0.45;
      else if ([".net",".org"].includes(tld)) available = Math.random() > 0.35;
      else available = Math.random() > 0.25;
      return { domain: base + tld, tld, available, price: TLD_PRICES[tld] || "$12.99/yr" };
    });

    setResults({ base, tldResults });
    setSearching(false);
  };

  const openConnect = (domain) => {
    if (!sites.length) { toast("Deploy a site first before connecting a domain","warn"); return; }
    setConnectModal(domain);
    setSelectedSite(sites[0]?.id || "");
    setConnectStep(1);
  };

  const doConnect = () => {
    if (!selectedSite) { toast("Select a site to connect","warn"); return; }
    const site = sites.find(s => s.id === selectedSite);
    if (!site) return;
    // Check not already added
    if ((site.customDomains||[]).find(d => d.domain === connectModal)) {
      toast("Domain already connected to this site","warn"); return;
    }
    const updated = { ...site, customDomains: [...(site.customDomains||[]), { domain: connectModal, status: "pending", addedAt: Date.now() }] };
    onUpdateSite(updated);
    setConnectStep(2);
  };

  const doVerify = async () => {
    setVerifying(true);
    await new Promise(r => setTimeout(r, 2200));
    setVerifying(false);
    // 30% chance "verified" in demo
    if (Math.random() > 0.7) {
      const site = sites.find(s => s.id === selectedSite);
      if (site) {
        const updated = { ...site, customDomains: site.customDomains.map(d => d.domain === connectModal ? {...d, status:"active"} : d) };
        onUpdateSite(updated);
        toast(`✅ ${connectModal} is now live!`);
        setConnectModal(null);
      }
    } else {
      toast("DNS not propagated yet. Check again in a few hours.","warn");
    }
  };

  return (
    <div className="fade-in">
      {/* Tabs */}
      <div style={{display:"flex",gap:4,marginBottom:20,background:T.bg3,padding:3,borderRadius:10,width:"fit-content"}}>
        {[["search","Search & Buy"],["connected","Connected Domains"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:"7px 18px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:500,background:tab===id?T.bg2:"transparent",color:tab===id?T.t1:T.t2,transition:"all .15s"}}>{lbl}
            {id==="connected"&&allConnected.length>0&&<span style={{marginLeft:6,background:T.greenDim,color:T.green,fontSize:10,padding:"1px 6px",borderRadius:100}}>{allConnected.length}</span>}
          </button>
        ))}
      </div>

      {/* ── SEARCH TAB ─────────────────────────────────────────── */}
      {tab==="search" && <>
        {/* Hero */}
        <div style={{background:`linear-gradient(135deg,${T.bg2},${T.bg3})`,border:`1px solid ${T.bg4}`,borderRadius:14,padding:"28px 24px",marginBottom:20,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-30,right:-30,width:180,height:180,background:T.greenDim,borderRadius:"50%",filter:"blur(40px)"}}/>
          <div style={{position:"relative"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{background:T.greenDim,border:`1px solid ${T.green}33`,color:T.green,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:100}}>NEW</span>
              <span style={{fontSize:13,color:T.t2}}>Domain Registration</span>
            </div>
            <h2 style={{fontSize:"1.6rem",fontWeight:700,color:T.t1,marginBottom:8,letterSpacing:"-.02em"}}>Get your <span style={{color:T.green}}>.com</span> domain</h2>
            <p style={{fontSize:13,color:T.t2,marginBottom:20,maxWidth:480,lineHeight:1.6}}>Search for available domains, buy from a trusted registrar, and connect instantly to any of your hosted sites.</p>
            {/* Search bar */}
            <div style={{display:"flex",gap:0,maxWidth:540}}>
              <input ref={searchRef} className="field mono" style={{borderRadius:"8px 0 0 8px",borderRight:"none",fontSize:14,padding:"11px 14px"}}
                placeholder="yourname.com" value={query}
                onChange={e=>setQuery(e.target.value.toLowerCase().replace(/\s/g,""))}
                onKeyDown={e=>e.key==="Enter"&&doSearch()}/>
              <button className="btn btn-primary" style={{borderRadius:"0 8px 8px 0",padding:"11px 22px",fontSize:14}} onClick={doSearch} disabled={!query.trim()||searching}>
                {searching ? <span className="spin">◌</span> : <><Icon name="search" size={14}/>Search</>}
              </button>
            </div>
          </div>
        </div>

        {/* Shimmer loading */}
        {searching && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
            {Array(6).fill(0).map((_,i)=><div key={i} className="shimmer" style={{height:72,borderRadius:10}}/>)}
          </div>
        )}

        {/* Results */}
        {results && !searching && <>
          <div style={{marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,color:T.t2}}>Results for <span className="mono" style={{color:T.t1}}>{results.base}</span></span>
            <span style={{fontSize:12,color:T.t3}}>{results.tldResults.filter(r=>r.available).length} available</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10,marginBottom:24}}>
            {results.tldResults.map(r => (
              <div key={r.tld} className="card-sm" style={{display:"flex",alignItems:"center",gap:12,borderColor:r.available&&r.tld===".com"?T.green+"55":T.bg4,background:r.available&&r.tld===".com"?T.greenDim:T.bg2,position:"relative",overflow:"hidden"}}>
                {r.tld===".com"&&r.available&&<div style={{position:"absolute",top:0,right:0,background:T.green,color:"#000",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:"0 10px 0 6px"}}>BEST</div>}
                <div style={{flex:1,minWidth:0}}>
                  <div className="mono" style={{fontSize:14,fontWeight:600,color:r.available?T.t1:T.t3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.domain}</div>
                  <div style={{fontSize:11,color:r.available?T.green:T.red,marginTop:2,display:"flex",alignItems:"center",gap:5}}>
                    <Icon name={r.available?"check":"x"} size={11} color={r.available?T.green:T.red}/>
                    {r.available?"Available":"Taken"} · <span style={{color:T.t2}}>{r.price}</span>
                  </div>
                </div>
                {r.available && (
                  <div style={{display:"flex",gap:5,flexShrink:0}}>
                    <button className="btn btn-ghost btn-sm" style={{fontSize:11}} onClick={()=>openConnect(r.domain)} title="Connect to a site">
                      <Icon name="link" size={11}/>Connect
                    </button>
                    <button className="btn btn-primary btn-sm" style={{fontSize:11}} onClick={()=>{
                      // open Namecheap in new tab (best price)
                      window.open(`${REGISTRARS[0].url}${r.domain}`,"_blank");
                    }}>
                      Buy
                    </button>
                  </div>
                )}
                {!r.available && (
                  <span className="badge badge-gray" style={{fontSize:10,flexShrink:0}}>Unavailable</span>
                )}
              </div>
            ))}
          </div>

          {/* Registrar links */}
          <div className="card" style={{marginBottom:0}}>
            <div style={{fontSize:11,color:T.t2,fontWeight:500,textTransform:"uppercase",letterSpacing:".06em",marginBottom:14}}>Buy From Trusted Registrars</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
              {REGISTRARS.map(r=>(
                <button key={r.name} onClick={()=>window.open(`${r.url}${results.base}.com`,"_blank")}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:T.bg3,border:`1px solid ${T.bg4}`,borderRadius:9,cursor:"pointer",transition:"all .15s",textAlign:"left"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=r.color+"66";e.currentTarget.style.background=T.bg4;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.bg4;e.currentTarget.style.background=T.bg3;}}>
                  <div style={{width:28,height:28,borderRadius:6,background:r.color+"22",border:`1px solid ${r.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:r.color,flexShrink:0}}>{r.logo}</div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:T.t1}}>{r.name}</div>
                    <div style={{fontSize:10,color:T.t3,display:"flex",alignItems:"center",gap:3}}>Open <Icon name="external" size={9} color={T.t3}/></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>}

        {/* Empty state */}
        {!results && !searching && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
            {[["Search","Type your desired domain name above","search"],["Check Availability","See available .com .net .io and more","check"],["Buy Instantly","Get redirected to a trusted registrar","zap"],["Connect","Link your domain to your hosted site","link"]].map(([t,d,i])=>(
              <div key={t} className="card-sm" style={{textAlign:"center",padding:"20px 16px"}}>
                <div style={{width:36,height:36,borderRadius:9,background:T.bg3,border:`1px solid ${T.bg4}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px"}}><Icon name={i} size={16} color={T.green}/></div>
                <div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:4}}>{t}</div>
                <div style={{fontSize:11,color:T.t2,lineHeight:1.5}}>{d}</div>
              </div>
            ))}
          </div>
        )}
      </>}

      {/* ── CONNECTED DOMAINS TAB ──────────────────────────────── */}
      {tab==="connected" && <>
        {allConnected.length === 0 ? (
          <EmptyState icon="globe" title="No custom domains connected" desc="Search for a domain, buy it, then connect it to any of your sites." action={()=>setTab("search")} actionLabel="Search Domains"/>
        ) : (
          <div className="card" style={{padding:0}}>
            {/* Header */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 140px 120px 100px",padding:"8px 16px",borderBottom:`1px solid ${T.bg4}`}}>
              {["Domain","Connected Site","Status","Added"].map(h=><span key={h} style={{fontSize:11,color:T.t2,fontWeight:500}}>{h}</span>)}
            </div>
            {allConnected.map((d,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 140px 120px 100px",alignItems:"center",padding:"12px 16px",borderBottom:i<allConnected.length-1?`1px solid ${T.bg4}`:""}}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg3+"66"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                style={{transition:"background .12s",cursor:"default",display:"grid",gridTemplateColumns:"1fr 140px 120px 100px",alignItems:"center",padding:"12px 16px",borderBottom:i<allConnected.length-1?`1px solid ${T.bg4}`:""}}>
                <div>
                  <div className="mono" style={{fontSize:13,color:T.t1,fontWeight:500}}>{d.domain}</div>
                  <div style={{fontSize:10,color:T.t3,marginTop:2,display:"flex",alignItems:"center",gap:4}}><Icon name="lock" size={9} color={T.green}/>https://{d.domain}</div>
                </div>
                <div className="mono" style={{fontSize:11,color:T.green}}>{d.siteSub}.webhost.pro</div>
                <StatusBadge status={d.status==="active"?"live":"paused"}/>
                <div style={{fontSize:11,color:T.t3}}>{new Date(d.addedAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
              </div>
            ))}
          </div>
        )}

        {/* DNS help */}
        <div className="card" style={{marginTop:14,borderColor:T.blue+"33"}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <div style={{width:32,height:32,borderRadius:8,background:T.blueDim,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="info" size={15} color={T.blue}/></div>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:6}}>How to activate a pending domain</div>
              <div className="mono" style={{fontSize:11,color:T.t2,lineHeight:2}}>
                <div>1. Log in to your domain registrar (GoDaddy / Namecheap / Cloudflare)</div>
                <div>2. Go to DNS Settings for your domain</div>
                <div>3. Delete any existing A / CNAME records for @ or www</div>
                <div>4. Add new CNAME record:</div>
                <div style={{background:T.bg0,padding:"6px 12px",borderRadius:7,color:T.green,margin:"4px 0"}}>
                  Type: CNAME &nbsp;·&nbsp; Name: @ (or www) &nbsp;·&nbsp; Value: yoursite.webhost.pro &nbsp;·&nbsp; TTL: Auto
                </div>
                <div>5. Save · DNS propagation takes 1–48 hours globally</div>
              </div>
            </div>
          </div>
        </div>
      </>}

      {/* ── CONNECT DOMAIN MODAL ──────────────────────────────── */}
      {connectModal && (
        <div style={{position:"fixed",inset:0,background:"#00000088",backdropFilter:"blur(4px)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>e.target===e.currentTarget&&setConnectModal(null)}>
          <div className="card" style={{width:"100%",maxWidth:500,padding:0,overflow:"hidden"}}>
            {/* Modal header */}
            <div style={{padding:"16px 20px",borderBottom:`1px solid ${T.bg4}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:14,fontWeight:600,color:T.t1}}>Connect Domain</div>
                <div className="mono" style={{fontSize:12,color:T.green,marginTop:2}}>{connectModal}</div>
              </div>
              <button className="btn-icon" onClick={()=>setConnectModal(null)}><Icon name="x" size={16}/></button>
            </div>

            {/* Steps indicator */}
            <div style={{display:"flex",padding:"12px 20px",gap:8,background:T.bg3,borderBottom:`1px solid ${T.bg4}`}}>
              {["Select Site","DNS Setup","Verify"].map((s,i)=>(
                <div key={s} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:connectStep>i?T.green:connectStep===i+1?T.blue:T.bg4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:connectStep>i?"#000":T.t2,flexShrink:0}}>
                    {connectStep>i?<Icon name="check" size={10} color="#000"/>:i+1}
                  </div>
                  <span style={{fontSize:11,color:connectStep===i+1?T.t1:T.t2,fontWeight:connectStep===i+1?500:400}}>{s}</span>
                  {i<2&&<Icon name="chevron-right" size={11} color={T.t3}/>}
                </div>
              ))}
            </div>

            <div style={{padding:"20px"}}>
              {/* Step 1: Select site */}
              {connectStep===1 && <>
                <div style={{fontSize:13,color:T.t2,marginBottom:14}}>Which site should <span className="mono" style={{color:T.t1}}>{connectModal}</span> point to?</div>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                  {sites.map(s=>(
                    <div key={s.id} onClick={()=>setSelectedSite(s.id)}
                      style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:9,border:`1px solid ${selectedSite===s.id?T.green+"66":T.bg4}`,background:selectedSite===s.id?T.greenDim:T.bg3,cursor:"pointer",transition:"all .15s"}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:selectedSite===s.id?T.green:T.t3,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div className="mono" style={{fontSize:12,color:T.t1,fontWeight:600}}>{s.sub}.webhost.pro</div>
                        <div style={{fontSize:11,color:T.t2,marginTop:1}}>{s.files?.length||0} files · {s.framework||"Static HTML"}</div>
                      </div>
                      <StatusBadge status={s.status}/>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                  <button className="btn btn-ghost" onClick={()=>setConnectModal(null)}>Cancel</button>
                  <button className="btn btn-primary" onClick={doConnect} disabled={!selectedSite} style={{display:"flex",alignItems:"center",gap:6}}><Icon name="link" size={13}/>Continue</button>
                </div>
              </>}

              {/* Step 2: DNS instructions */}
              {connectStep===2 && <>
                <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:16}}>
                  <div style={{width:28,height:28,borderRadius:7,background:T.blueDim,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="settings" size={14} color={T.blue}/></div>
                  <div><div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:3}}>Configure DNS Records</div><div style={{fontSize:12,color:T.t2,lineHeight:1.5}}>Log in to your domain registrar and add these DNS records:</div></div>
                </div>
                <div style={{background:T.bg0,borderRadius:8,padding:14,marginBottom:16,border:`1px solid ${T.bg4}`}}>
                  <div style={{display:"grid",gridTemplateColumns:"80px 80px 1fr",gap:8,marginBottom:8,paddingBottom:8,borderBottom:`1px solid ${T.bg4}`}}>
                    {["Type","Name","Value"].map(h=><span key={h} style={{fontSize:10,color:T.t3,fontWeight:600,fontFamily:"'JetBrains Mono',monospace"}}>{h}</span>)}
                  </div>
                  {[
                    ["CNAME","@",`${sites.find(s=>s.id===selectedSite)?.sub||"yoursite"}.webhost.pro`],
                    ["CNAME","www",`${sites.find(s=>s.id===selectedSite)?.sub||"yoursite"}.webhost.pro`],
                  ].map(([type,name,val],i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"80px 80px 1fr",gap:8,padding:"6px 0",borderBottom:i===0?`1px solid ${T.bg4}88`:""}}>
                      <span className="badge badge-blue" style={{width:"fit-content",fontSize:10}}>{type}</span>
                      <span className="mono" style={{fontSize:12,color:T.amber}}>{name}</span>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span className="mono" style={{fontSize:11,color:T.green,wordBreak:"break-all"}}>{val}</span>
                        <button className="btn-icon" style={{flexShrink:0}} onClick={()=>{navigator.clipboard?.writeText(val);toast("Copied!");}}>
                          <Icon name="copy" size={12}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:11,color:T.t3,marginBottom:16,lineHeight:1.6}}>
                  <Icon name="clock" size={11} color={T.t3} style={{verticalAlign:"middle",marginRight:4}}/>
                  DNS propagation takes <strong style={{color:T.t2}}>1–48 hours</strong> to take effect globally.
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                  <button className="btn btn-ghost" onClick={()=>setConnectStep(1)}>Back</button>
                  <button className="btn btn-primary" onClick={()=>setConnectStep(3)} style={{display:"flex",alignItems:"center",gap:6}}><Icon name="check" size={13}/>I've Added the Records</button>
                </div>
              </>}

              {/* Step 3: Verify */}
              {connectStep===3 && <>
                <div style={{textAlign:"center",padding:"10px 0 20px"}}>
                  <div style={{width:56,height:56,borderRadius:14,background:T.greenDim,border:`1px solid ${T.green}33`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
                    <Icon name="shield" size={24} color={T.green}/>
                  </div>
                  <div style={{fontSize:15,fontWeight:600,color:T.t1,marginBottom:8}}>Verify Domain</div>
                  <div style={{fontSize:13,color:T.t2,lineHeight:1.6,marginBottom:4}}>Click verify to check if DNS is propagated for</div>
                  <div className="mono" style={{fontSize:14,color:T.green,marginBottom:20}}>{connectModal}</div>
                  <div style={{fontSize:11,color:T.t3,marginBottom:20,padding:"8px 14px",background:T.bg3,borderRadius:8}}>
                    DNS can take 1–48 hours. If it fails now, wait a few hours and try again from the Connected Domains tab.
                  </div>
                  <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                    <button className="btn btn-ghost" onClick={()=>{setConnectModal(null);toast("Domain saved! Verify later from Connected Domains tab.","info");}}>Save & Check Later</button>
                    <button className="btn btn-primary" onClick={doVerify} disabled={verifying} style={{display:"flex",alignItems:"center",gap:6}}>
                      {verifying?<><span className="spin">◌</span>Checking DNS...</>:<><Icon name="refresh" size={13}/>Verify Now</>}
                    </button>
                  </div>
                </div>
              </>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// ─── DOCS ─────────────────────────────────────────────────────────────────────
const Docs=memo(()=>(
  <div className="fade-in" style={{maxWidth:640}}>
    {[{icon:"upload",title:"Quick Start",body:"1. Sign in with Google\n2. Go to New Deploy\n3. Upload HTML or write code\n4. Choose subdomain → Deploy\n5. Your site is live in 30 seconds!"},{icon:"cloud",title:"Cross-Device Sync",body:"All your sites sync automatically across devices.\nSign in with the same Google account on any device to access all your sites and data instantly."},{icon:"lock",title:"Account Security",body:"Each Google account has its own isolated data.\nOther users cannot access your sites.\nSign out anytime — data stays safe in the cloud."},{icon:"layers",title:"Supported Frameworks",body:"Static HTML · CSS · JavaScript\nReact · Vue · Angular · Next.js · SvelteKit\n\nEnable SPA Mode in Settings for React/Vue/Angular."},{icon:"link",title:"Custom Domain DNS Setup",body:"1. Site → Domains → Add Domain\n2. Enter your domain (e.g. mysite.com)\n3. Add CNAME in your DNS provider:\n   Name: @ → Value: yoursite.webhost.pro\n4. Wait 1–48 hours for propagation"},{icon:"rollback",title:"Rollback System",body:"Every deployment is saved to history.\nSite → History tab → Click Rollback to restore any previous version instantly."},{icon:"key",title:"Environment Variables",body:"Store API keys and config:\nSite → Env tab → Add KEY=value pairs\nThey're baked in at build time securely."},{icon:"zap",title:"Free Plan Limits",body:"10 sites · 500MB storage · 10GB/month bandwidth\nUnlimited custom domains · Free SSL · AI Support"}].map(s=><div key={s.title} className="card" style={{marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}><div style={{width:28,height:28,borderRadius:7,background:T.bg3,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={s.icon} size={13} color={T.t2}/></div><span style={{fontSize:13,fontWeight:600,color:T.t1}}>{s.title}</span></div><div className="mono" style={{fontSize:11,color:T.t2,lineHeight:1.9,whiteSpace:"pre-line"}}>{s.body}</div></div>)}
  </div>
));

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard=memo(({sites,onOpenSite,onNew,user})=>(
  <div className="fade-in">
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:20}}>
      <StatCard icon="grid" label="Total Sites" value={sites.length} sub={`${sites.filter(s=>s.status==="live").length} live`} color={T.green}/>
      <StatCard icon="activity" label="Total Visits" value={sites.reduce((a,s)=>a+s.visits,0)} sub="All sites"/>
      <StatCard icon="shield" label="SSL Active" value={sites.filter(s=>s.ssl).length} sub="Auto-renewed" color={T.blue}/>
      <StatCard icon="zap" label="Bandwidth" value={`${sites.reduce((a,s)=>a+s.bandwidth,0)}MB`} sub="This month" color={T.purple}/>
    </div>
    {sites.length===0?<EmptyState icon="layers" title={`Welcome, ${user?.name?.split(" ")[0]||"there"}!`} desc="Deploy your first website in under 30 seconds — upload an HTML file and choose a subdomain." action={onNew} actionLabel="New Deployment"/>:<>
      <div style={{marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,fontWeight:600,color:T.t1}}>Recent Deployments</span><button className="btn btn-ghost btn-sm" onClick={onNew} style={{display:"flex",alignItems:"center",gap:5}}><Icon name="plus" size={13}/>New</button></div>
      <div className="card" style={{padding:0}}>{sites.slice(0,5).map((s,i)=><div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<Math.min(sites.length,5)-1?`1px solid ${T.bg4}`:"",cursor:"pointer",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=T.bg3+"88"} onMouseLeave={e=>e.currentTarget.style.background="transparent"} onClick={()=>onOpenSite(s)}>
        <div style={{width:36,height:36,borderRadius:9,background:T.bg3,border:`1px solid ${T.bg4}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="globe" size={15} color={T.t2}/></div>
        <div style={{flex:1,minWidth:0}}><div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:2}}><span className="mono" style={{fontSize:12,color:T.green,fontWeight:600}}>{s.sub}.webhost.pro</span><StatusBadge status={s.status}/><span className="fw-badge">{s.framework||"Static HTML"}</span></div><div style={{fontSize:11,color:T.t2}}>{s.files?.length||0} files · {fmtDate(s.deployedAt)}</div></div>
        <Icon name="chevron-right" size={14} color={T.t3}/>
      </div>)}</div>
    </>}
  </div>
));

// ─── SITES LIST ───────────────────────────────────────────────────────────────
const SitesList=memo(({sites,onOpenSite,onNew,onToggle,onDelete})=>(
  <div className="fade-in">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontSize:13,color:T.t2}}>{sites.length} site{sites.length!==1?"s":""}</span><button className="btn btn-primary btn-sm" onClick={onNew} style={{display:"flex",alignItems:"center",gap:5}}><Icon name="plus" size={13}/>New Site</button></div>
    {sites.length===0?<EmptyState icon="layers" title="No sites" desc="Your sites will appear here." action={onNew} actionLabel="Deploy First Site"/>:
    <div className="card" style={{padding:0}}>{sites.map((s,i)=><div key={s.id} style={{padding:"14px 16px",borderBottom:i<sites.length-1?`1px solid ${T.bg4}`:""}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:38,height:38,borderRadius:9,background:T.bg3,border:`1px solid ${T.bg4}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="globe" size={16} color={T.t2}/></div>
        <div style={{flex:1,minWidth:0}}><div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:3}}><span className="mono" style={{fontSize:13,color:T.green,fontWeight:600}}>{s.sub}.webhost.pro</span><StatusBadge status={s.status}/>{s.ssl&&<span className="badge badge-blue" style={{fontSize:10}}><Icon name="lock" size={10}/>SSL</span>}<span className="fw-badge">{s.framework||"Static"}</span></div><div style={{fontSize:11,color:T.t2,display:"flex",flexWrap:"wrap",gap:10}}><span>{s.files?.length||0} files</span><span>{s.visits} visits</span><span>{fmtDate(s.deployedAt)}</span></div></div>
        <div style={{display:"flex",gap:6,flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end"}}><button className="btn btn-ghost btn-sm" onClick={()=>onOpenSite(s)}>Manage</button><button className="btn btn-ghost btn-sm" onClick={()=>onToggle(s.id)}>{s.status==="live"?"⏸ Pause":"▶ Resume"}</button><button className="btn btn-danger btn-sm" onClick={()=>onDelete(s.id)}>Delete</button></div>
      </div>
    </div>)}</div>}
  </div>
));

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  injectStyles();
  const [user, setUser] = useState(null);          // logged-in user
  const [authChecked, setAuthChecked] = useState(false); // done checking session
  const [sites, setSites] = useState([]);
  const [sitesLoaded, setSitesLoaded] = useState(false);
  const [toasts, addToast] = useToast();
  const [page, setPage] = useState("dash");
  const [selId, setSelId] = useState(null);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const selSite = useMemo(()=>sites.find(s=>s.id===selId)||null,[sites,selId]);

  // ── Check local session on mount ──────────────────────────────────────────
  useEffect(()=>{
    const session = getLocalSession();
    if(session?.email) {
      setUser(session);
      loadUserSites(session.email);
    } else {
      setAuthChecked(true);
    }
  },[]);

  // ── Load user sites from cloud ────────────────────────────────────────────
  const loadUserSites = async (email) => {
    setSitesLoaded(false);
    try {
      const data = await cloudGet(`whp:sites:${emailKey(email)}`);
      setSites(data || []);
    } catch { setSites([]); }
    setSitesLoaded(true);
    setAuthChecked(true);
  };

  // ── Save sites to cloud whenever they change ──────────────────────────────
  const saveSites = useCallback(async (updated, email) => {
    setSites(updated);
    setSyncing(true);
    const em = email || user?.email;
    if(em) await cloudSet(`whp:sites:${emailKey(em)}`, updated);
    setTimeout(()=>setSyncing(false), 800);
  },[user]);

  // ── Keyboard shortcut ─────────────────────────────────────────────────────
  useEffect(()=>{
    const h=e=>{if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setCmdOpen(p=>!p);}};
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[]);

  // ── Auth handlers ─────────────────────────────────────────────────────────
  const handleLogin = async (userData) => {
    // If clicked from saved-accounts card — just set session directly (already verified)
    const isSavedLogin = getSavedAccounts().find(a => a.email === userData.email);
    if (isSavedLogin) {
      setUser(userData);
      setLocalSession(userData);
      saveAccount(userData);
      await loadUserSites(userData.email);
      addToast(`Welcome back, ${userData.name.split(" ")[0]}! 👋`);
      return;
    }
    setUser(userData);
    setLocalSession(userData);
    saveAccount(userData); // persist on this device
    await loadUserSites(userData.email);
    addToast(`Welcome back, ${userData.name.split(" ")[0]}! 👋`);
  };

  const handleLogout = () => {
    clearLocalSession();
    setUser(null);
    setSites([]);
    setSelId(null);
    setPage("dash");
    setSitesLoaded(false);
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const navigate = useCallback((p,id=null)=>{setPage(p);if(id){setSelId(id);setPage("site");}else setSelId(null);},[]);
  const openSite = useCallback((site)=>{setSelId(site.id);setPage("site");},[]);

  // ── Site CRUD ─────────────────────────────────────────────────────────────
  const updateSite = useCallback(async(updated)=>{
    const next=sites.map(s=>s.id===updated.id?updated:s);
    await saveSites(next);
  },[sites,saveSites]);

  const deleteSite = useCallback(async(id)=>{
    if(!confirm("Delete this site permanently? This cannot be undone."))return;
    const next=sites.filter(s=>s.id!==id);
    await saveSites(next);
    if(selId===id){setSelId(null);setPage("sites");}
    addToast("Site deleted","info");
  },[sites,saveSites,selId,addToast]);

  const toggleSite = useCallback(async(id)=>{
    const next=sites.map(s=>s.id===id?{...s,status:s.status==="live"?"paused":"live"}:s);
    await saveSites(next);
    const s=next.find(x=>x.id===id);
    addToast(s.status==="live"?"Site resumed!":"Site paused",s.status==="live"?"success":"warn");
  },[sites,saveSites,addToast]);

  const handleDeployed = useCallback(async(site)=>{
    const next=[site,...sites];
    await saveSites(next);
    setSelId(site.id);setPage("site");
  },[sites,saveSites]);

  // ── Not authenticated yet ─────────────────────────────────────────────────
  if(!authChecked){
    return(
      <div style={{display:"flex",height:"100vh",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,background:T.bg0}}>
        <div style={{width:44,height:44,borderRadius:12,background:T.greenDim,border:`1px solid ${T.green}33`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="layers" size={20} color={T.green}/></div>
        <div style={{display:"flex",flexDirection:"column",gap:8,width:200,alignItems:"center"}}>
          <div className="shimmer" style={{width:180,height:10,borderRadius:5}}/>
          <div className="shimmer" style={{width:140,height:10,borderRadius:5}}/>
          <div className="shimmer" style={{width:100,height:10,borderRadius:5}}/>
        </div>
        <div style={{fontSize:12,color:T.t3}}>Loading...</div>
      </div>
    );
  }

  // ── Not logged in → show landing ──────────────────────────────────────────
  if(!user) return <><LoginPage onLogin={handleLogin}/><ToastContainer toasts={toasts}/></>;

  // ── Loading user sites ────────────────────────────────────────────────────
  if(!sitesLoaded){
    return(
      <div style={{display:"flex",height:"100vh",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,background:T.bg0}}>
        <div style={{width:44,height:44,borderRadius:12,background:T.greenDim,border:`1px solid ${T.green}33`,display:"flex",alignItems:"center",justifyContent:"center"}}><span className="spin" style={{fontSize:20,color:T.green}}>◌</span></div>
        <div style={{fontSize:13,color:T.t2}}>Loading your sites from cloud...</div>
        <div style={{fontSize:11,color:T.t3}}>{user.email}</div>
      </div>
    );
  }

  // ── Main app ──────────────────────────────────────────────────────────────
  return(
    <div style={{display:"flex",minHeight:"100vh",background:T.bg0}}>
      <Sidebar page={page} onNav={navigate} sites={sites} sideOpen={sideOpen} setSideOpen={setSideOpen} user={user} onLogout={handleLogout}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        <Topbar page={page} selSite={selSite} onBack={()=>{setPage("sites");setSelId(null);}} onCmd={()=>setCmdOpen(true)} setSideOpen={setSideOpen}/>

        {/* Cloud sync status bar */}
        {syncing && (
          <div style={{background:T.bg2,borderBottom:`1px solid ${T.bg4}`,padding:"6px 22px",display:"flex",alignItems:"center",gap:8,fontSize:11,color:T.t2}}>
            <span className="spin" style={{fontSize:10,color:T.green}}>◌</span>
            <span>Syncing to cloud...</span>
            <Icon name="cloud" size={12} color={T.green} style={{marginLeft:4}}/>
          </div>
        )}

        <main className="main-pad" style={{flex:1,overflowY:"auto",padding:"22px 24px"}}>
          {page==="dash"&&<Dashboard sites={sites} onOpenSite={openSite} onNew={()=>setPage("new")} user={user}/>}
          {page==="sites"&&<SitesList sites={sites} onOpenSite={openSite} onNew={()=>setPage("new")} onToggle={toggleSite} onDelete={deleteSite}/>}
          {page==="new"&&<NewDeploy sites={sites} onDeployed={handleDeployed} toast={addToast}/>}
          {page==="domains"&&<DomainManager sites={sites} onUpdateSite={updateSite} toast={addToast}/>}
          {page==="support"&&<Support toast={addToast}/>}
          {page==="docs"&&<Docs/>}
          {page==="site"&&selSite&&<SiteManager site={selSite} onUpdate={updateSite} onDelete={deleteSite} toast={addToast}/>}
          {page==="site"&&!selSite&&<EmptyState icon="alert" title="Site not found" desc="This site may have been deleted." action={()=>setPage("sites")} actionLabel="Back to Sites"/>}
        </main>
      </div>
      {cmdOpen&&<CommandPalette onClose={()=>setCmdOpen(false)} onNavigate={navigate} sites={sites}/>}
      <ToastContainer toasts={toasts}/>
    </div>
  );
}
