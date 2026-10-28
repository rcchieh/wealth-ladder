# 把 claude.ai 版的兩個網頁轉成 GitHub Pages 用的獨立網站（單一來源：wealth-ladder.html、summon.html）
import os, re
BASE="https://rcchieh.github.io/wealth-ladder/"
CALC_OLD="https://claude.ai/artifact/7gStPfA8QH7CEgJsU4vXH5"; GAME_OLD="https://claude.ai/artifact/LAmnsNW3BStZihxreRjdRD"
CALC_NEW=BASE; GAME_NEW=BASE+"summon/"
RESET=""":root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
body{margin:0;font:14px/1.5 system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}"""
def head(title,desc,url,emoji,theme):
    fav=f"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>{emoji}</text></svg>"
    return f"""<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="{desc}">
<meta name="theme-color" content="{theme}">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="{fav}">
<style>{RESET}</style>
"""
DL_FALLBACK='''else { const a=document.createElement("a"); a.textContent="下載圖片"; a.className="shot-dl"; a.href=URL.createObjectURL(blob); a.download=filename; row.appendChild(a); }'''
def convert(src,dst,title,desc,url,emoji,theme):
    s=open(src,encoding="utf-8").read()
    s=s.replace(CALC_OLD,CALC_NEW).replace(GAME_OLD,GAME_NEW)
    # 網站上可以直接下載圖片（claude.ai 版要靠平台的下載功能）
    i=s.index("if(SHOT.dl){ mk(\"儲存圖片\")"); j=s.index("}); }",i)+len("}); }")
    s=s[:j]+" "+DL_FALLBACK+s[j:]
    s=s.replace(".shot-note{", ".shot-dl{display:inline-flex;align-items:center;min-height:42px;padding:8px 16px;border-radius:999px;text-decoration:none;font:700 14px sans-serif;background:#ffffff22;color:inherit;border:1px solid currentColor}\n.shot-note{",1)
    out=head(title,desc,url,emoji,theme)+s.replace("<title>","<title>",1)
    # 把頁面自己的 <title>…<style> 前段留在 head，第一個 </style> 之後才是 body
    k=out.index("</style>", out.index("<style>", out.index("<title>")))+len("</style>")
    fb=open("site-feedback.js",encoding="utf-8").read()
    out=out[:k]+"\n</head>\n<body>\n"+out[k:]+"\n<script>\n"+fb+"</script>\n</body>\n</html>\n"
    os.makedirs(os.path.dirname(dst),exist_ok=True); open(dst,"w",encoding="utf-8").write(out)
convert("wealth-ladder.html","site/index.html","財富階梯計算機","算算你還要幾年爬到財富階梯的下一階，以及現在哪根槓桿最有效。數字只存在你的裝置。",CALC_NEW,"🪜","#2a78d6")
convert("summon.html","site/summon/index.html","小實驗召喚所","建立時間、社交、心智、身體四項能力的角色，每天召喚一張 7 天小實驗卡，打卡練成魔法。",GAME_NEW,"🔮","#12122b")
open("site/.nojekyll","w").write("")
print("built")
