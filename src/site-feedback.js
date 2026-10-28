/* ---- 網站版回饋：在頁面裡直接送出到試算表（Apps Script），不用跳頁 ---- */
(()=>{ const EP="https://script.google.com/macros/s/AKfycbyXxpdCeGRTerEjItdr_QZqmLIU--j4Zh3yeGDSsrnKj00v49GCu8CJ8B8Wlwu2-X485w/exec";
  const FORM="https://docs.google.com/forms/d/e/1FAIpQLSeSHMRJA2FxhyhOGMp6OqYmRweTcOnaQxnyK_2YDo0rqmRrKg/viewform";
  const HOURS=["不到 1 小時","1–3 小時","3–8 小時","8 小時以上"], GOALS=["看清財務進度","找到副業方向","把想法變成行動","平衡財富、健康和時間"], JOBS=["科技業／工程","其他上班族","自由工作者／創業","學生","其他"];
  const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}}, set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
  let cid=ls.get("wl-fb-cid"); if(!cid){ cid=Math.random().toString(36).slice(2,12); ls.set("wl-fb-cid",cid); }
  const css=document.createElement("style"); css.textContent=`
.wfb{position:fixed;inset:0;z-index:90;background:rgba(12,14,24,.66);display:grid;place-items:end center;padding:12px;padding-bottom:calc(12px + env(safe-area-inset-bottom,0px))}
@media (min-width:640px){.wfb{place-items:center}}
.wfb-box{background:#fff;color:#1d2230;border-radius:18px;width:min(460px,100%);max-height:calc(100% - 8px);overflow:auto;padding:18px;display:grid;gap:12px;font:15px/1.6 "Noto Sans TC","PingFang TC",system-ui,sans-serif;box-shadow:0 20px 50px rgba(0,0,0,.3)}
.wfb-box h3{margin:0;font-size:18px}.wfb-box p{margin:0}.wfb-lead{font-size:13.5px;color:#5a6172}
.wfb-q{display:grid;gap:6px}.wfb-q>b{font-size:14px}.wfb-q>b small{font-weight:400;color:#8a90a0}
.wfb-chips{display:flex;flex-wrap:wrap;gap:6px}.wfb-chips button{min-height:40px;border-radius:999px;border:1px solid #d6dae3;background:#f6f7fa;color:#3a4152;padding:6px 12px;font:500 13.5px inherit;font-family:inherit;cursor:pointer}
.wfb-chips button[aria-pressed="true"]{background:#2a78d6;border-color:#2a78d6;color:#fff}
.wfb-box textarea{min-height:90px;border-radius:12px;border:1px solid #d6dae3;padding:10px;font:16px inherit;font-family:inherit;resize:vertical}
.wfb-sum{font-size:12px;color:#8a90a0;background:#f6f7fa;border-radius:10px;padding:8px 10px}
.wfb-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.wfb-send{min-height:46px;border:0;border-radius:999px;background:#2a78d6;color:#fff;font:700 15px inherit;font-family:inherit;padding:10px 22px;cursor:pointer}
.wfb-send:disabled{opacity:.6}.wfb-x{margin-left:auto;background:none;border:0;color:#5a6172;font:14px inherit;font-family:inherit;cursor:pointer;min-height:40px}
.wfb-msg{font-size:13px;color:#c0392b}.wfb-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.wfb-done{text-align:center;padding:16px 0;display:grid;gap:8px}.wfb-done .big{font-size:44px}`; document.head.appendChild(css);
  const el=(t,c,x)=>{ const e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e; };
  function chips(list,opt){ const w=el("div","wfb-chips"); let val=""; list.forEach(v=>{ const b=el("button",null,v); b.type="button"; b.setAttribute("aria-pressed","false");
      b.addEventListener("click",()=>{ val= (opt && val===v)? "" : v; [...w.children].forEach(c=>c.setAttribute("aria-pressed",String(c.textContent===val))); }); w.appendChild(b); });
    return {w, get:()=>val}; }
  function open(ctx){
    const old=document.querySelector(".wfb"); if(old) old.remove();
    const m=el("div","wfb"), box=el("div","wfb-box"); m.setAttribute("role","dialog"); m.setAttribute("aria-label","告訴我怎麼讓它更好");
    box.append(el("h3",null,"💬 告訴我怎麼讓它更好"), el("p","wfb-lead","這是我一個人做的小工具，沒有廣告、不賣東西。全程匿名，30 秒回答 3 題就是最好的支持 🙏"));
    const qh=chips(HOURS), qg=chips(GOALS), qj=chips(JOBS,true);
    const q=(t,node,sm)=>{ const d=el("div","wfb-q"), b=el("b",null,t); if(sm) b.appendChild(el("small",null," "+sm)); d.append(b,node); return d; };
    const ta=el("textarea"); ta.maxLength=500; ta.placeholder="最喜歡或最想改的地方"; ta.setAttribute("aria-label","回饋");
    const hp=el("input","wfb-hp"); hp.tabIndex=-1; hp.autocomplete="off"; hp.setAttribute("aria-hidden","true");
    box.append(q("每週願意花在副業或自我成長的時間",qh.w), q("你的目標",qg.w), q("回饋",ta), q("工作",qj.w,"（選填）"), hp);
    if(ctx.summary) box.append(el("p","wfb-sum","會一起送出的匿名摘要（不含任何金額）："+ctx.summary));
    const msg=el("p","wfb-msg"), row=el("div","wfb-row"), send=el("button","wfb-send","送出"), x=el("button","wfb-x","關閉"); send.type=x.type="button";
    row.append(send,x); box.append(row,msg); m.appendChild(box); document.body.appendChild(m);
    const close=()=>m.remove(); x.addEventListener("click",close); m.addEventListener("click",e=>{ if(e.target===m) close(); });
    document.addEventListener("keydown",function esc(e){ if(e.key==="Escape"){ close(); document.removeEventListener("keydown",esc); } });
    send.addEventListener("click",async()=>{
      const d={hours:qh.get(), goal:qg.get(), note:ta.value.trim(), job:qj.get(), source:ctx.source||document.title, summary:ctx.summary||"", cid, website:hp.value};
      if(!d.hours||!d.goal||!d.note){ msg.textContent="三題都要填喔（工作可以不填）。"; return; }
      send.disabled=true; send.textContent="送出中…"; msg.textContent="";
      let ok=false; try{ const r=await fetch(EP,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(d)}); const j=await r.json().catch(()=>({ok:r.ok})); ok=!!j.ok;
        if(!ok && j.error==="too_fast"){ msg.textContent="剛剛已經收到了，等 30 秒再送一次。"; } }
      catch(e){ try{ await fetch(EP,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(d)}); ok=true; }catch(_){ ok=false; } }
      if(ok){ ls.set("wl-fb-last",String(Date.now())); box.textContent=""; const dn=el("div","wfb-done"); dn.append(el("div","big","🙏"), el("h3",null,"收到了，謝謝你！"), el("p","wfb-lead","你的回饋會直接讓下一版變得更好。"));
        const c=el("button","wfb-send","關閉"); c.type="button"; c.addEventListener("click",close); dn.append(c); box.append(dn); }
      else { send.disabled=false; send.textContent="再送一次"; if(!msg.textContent){ msg.textContent="送出失敗了。可以再試一次，或改用"; const a=el("a",null,"Google 表單"); a.href=FORM; a.target="_blank"; a.rel="noopener"; msg.append(a); } }
    });
  }
  // 原本連到 Google 表單的按鈕，改成打開這個視窗；來源和摘要沿用原本的帶入內容
  ["fabFb","dkFb","fbFab","wantAi"].forEach(id=>{ const a=document.getElementById(id); if(!a) return;
    a.addEventListener("click",e=>{ e.preventDefault(); e.stopImmediatePropagation(); a.dispatchEvent(new MouseEvent("mousedown"));
      let u; try{ u=new URL(a.href); }catch(_){ u=null; }
      open({source:u? u.searchParams.get("entry.1404172522")||"" : "", summary:u? u.searchParams.get("entry.610336213")||"" : ""}); }, true); });
})();
