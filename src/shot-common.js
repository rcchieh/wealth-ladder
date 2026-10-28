/* ---- 分享結果圖：畫成 1080×1350 圖片，先預覽，再分享或儲存 ---- */
const SHOT={dl:null};
(async()=>{ try{ if(window.claude&&window.claude.use) SHOT.dl=await window.claude.use("downloads"); }catch(e){} })();
function wrapText(ctx,text,maxW){ const out=[]; let line="";
  for(const ch of String(text)){ if(ch==="\n"){ out.push(line); line=""; continue; } const t=line+ch; if(ctx.measureText(t).width>maxW && line){ out.push(line); line=ch.trim()?ch:""; } else line=t; }
  if(line) out.push(line); return out; }
function rrect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function openShot(canvas,{filename,text,url}){
  const old=document.getElementById("shotModal"); if(old) old.remove();
  const m=document.createElement("div"); m.id="shotModal"; m.className="shot-modal"; m.setAttribute("role","dialog"); m.setAttribute("aria-label","分享結果圖");
  const box=document.createElement("div"); box.className="shot-box";
  const img=document.createElement("img"); img.alt="我的結果圖"; img.src=canvas.toDataURL("image/png");
  const row=document.createElement("div"); row.className="shot-row";
  const note=document.createElement("p"); note.className="shot-note"; note.textContent="手機可以長按圖片儲存，電腦可以按右鍵另存。";
  const mk=(t,cls)=>{ const b=document.createElement("button"); b.type="button"; b.textContent=t; if(cls) b.className=cls; row.appendChild(b); return b; };
  canvas.toBlob(blob=>{
    const file=new File([blob],filename,{type:"image/png"});
    if(navigator.canShare && navigator.canShare({files:[file]})){
      mk("分享圖片","shot-main").addEventListener("click",async()=>{ try{ await navigator.share({files:[file],text:text+" "+url}); note.textContent="謝謝分享！"; }catch(e){ if(!(e&&e.name==="AbortError")) note.textContent="這裡沒辦法直接分享圖片，請長按圖片儲存後再分享。"; } });
    }
    if(SHOT.dl){ mk("儲存圖片").addEventListener("click",async()=>{ try{ await SHOT.dl.save({filename,data:blob}); note.textContent="已儲存！"; }catch(e){ note.textContent="沒有儲存。也可以長按或右鍵另存圖片。"; } }); }
    mk("複製連結").addEventListener("click",async()=>{ try{ await navigator.clipboard.writeText(text+" "+url); note.textContent="連結已複製，貼在圖片下面一起分享吧！"; }catch(e){ note.textContent="連結："+url; } });
    mk("關閉","shot-x").addEventListener("click",()=>m.remove());
  },"image/png");
  m.addEventListener("click",e=>{ if(e.target===m) m.remove(); });
  document.addEventListener("keydown",function esc(e){ if(e.key==="Escape"){ m.remove(); document.removeEventListener("keydown",esc); } });
  box.append(img,row,note); m.appendChild(box); document.body.appendChild(m);
}
