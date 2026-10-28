/* ---- 12 個 Q 版角色（SVG，同一套畫風：圓臉、大眼、腮紅；差在頭飾、髮色、法袍） ---- */
const CHARS={
  wizard:{nm:"星帽小法師", hair:"#6b4a9e", robe:"#7b5cd6", gem:"#f2c14e", top:"hat",  hatC:"#4b3a9a"},
  elf:   {nm:"月光精靈",   hair:"#e8e2f7", robe:"#5fbf9a", gem:"#c9a2ff", top:"elf",  long:1},
  fox:   {nm:"狐狸術士",   hair:"#f08a3c", robe:"#f6c26b", gem:"#ff8fb1", top:"fox",  earC:"#f08a3c", inC:"#fff3e6"},
  cat:   {nm:"黑貓魔導",   hair:"#2e2a3d", robe:"#3c3a6b", gem:"#7fe3cf", top:"cat",  earC:"#2e2a3d", inC:"#ff9bb0"},
  bunny: {nm:"兔兔治癒師", hair:"#f7d9e3", robe:"#ff9bb8", gem:"#ffffff", top:"bunny",earC:"#fbeaf0", inC:"#ffb3c6"},
  bear:  {nm:"熊熊守護者", hair:"#8a5a3c", robe:"#b9824f", gem:"#f2c14e", top:"bear", earC:"#8a5a3c", inC:"#e9b98f"},
  owl:   {nm:"貓頭鷹賢者", hair:"#9b7b5a", robe:"#5b6b9e", gem:"#f2c14e", top:"owl",  earC:"#9b7b5a"},
  druid: {nm:"花冠德魯伊", hair:"#7a5232", robe:"#6fbf73", gem:"#ff8fb1", top:"flower",long:1},
  star:  {nm:"星砂占星師", hair:"#2f4a8a", robe:"#26315f", gem:"#f2c14e", top:"hood", hatC:"#3a4c8f"},
  dragon:{nm:"小龍騎士",   hair:"#2f8f86", robe:"#3fb8a8", gem:"#ffcf5c", top:"horns",earC:"#ffd27a", rare:1},
  uni:   {nm:"獨角獸聖女", hair:"#ffd1ec", robe:"#c9b6ff", gem:"#8cf0ff", top:"uni",  long:1, rare:1},
  mer:   {nm:"人魚歌姬",   hair:"#4fc3d9", robe:"#5ad1c4", gem:"#ffb3d1", top:"shell",long:1, rare:1}
};
const CHAR_IDS=Object.keys(CHARS), RARE_IDS=CHAR_IDS.filter(k=>CHARS[k].rare), COMMON_IDS=CHAR_IDS.filter(k=>!CHARS[k].rare);
const rollAvatar=()=> Math.random()<0.15? pickOne(RARE_IDS) : pickOne(COMMON_IDS);
const isRare=a=>!!(CHARS[a]&&CHARS[a].rare);
const charName=a=>(CHARS[a]||{}).nm||"冒險者";
function avatarSVG(id){
  const c=CHARS[id]||CHARS.wizard, skin="#ffe3d1", ink="#3b2d4f", P=[];
  // 長髮在後面
  if(c.long) P.push(`<path d="M50 100 Q44 170 62 196 L138 196 Q156 170 150 100 Z" fill="${c.hair}"/>`);
  // 頭頂的耳朵（在頭後面）
  const ears={
    cat:`<path d="M58 78 L64 30 L94 60 Z" fill="${c.earC}"/><path d="M142 78 L136 30 L106 60 Z" fill="${c.earC}"/><path d="M66 68 L69 44 L86 60 Z" fill="${c.inC}"/><path d="M134 68 L131 44 L114 60 Z" fill="${c.inC}"/>`,
    fox:`<path d="M54 80 L58 20 L96 58 Z" fill="${c.earC}"/><path d="M146 80 L142 20 L104 58 Z" fill="${c.earC}"/><path d="M63 68 L65 36 L86 58 Z" fill="${c.inC}"/><path d="M137 68 L135 36 L114 58 Z" fill="${c.inC}"/>`,
    bunny:`<ellipse cx="76" cy="34" rx="13" ry="38" transform="rotate(-12 76 34)" fill="${c.earC}"/><ellipse cx="124" cy="34" rx="13" ry="38" transform="rotate(12 124 34)" fill="${c.earC}"/><ellipse cx="76" cy="36" rx="6" ry="28" transform="rotate(-12 76 36)" fill="${c.inC}"/><ellipse cx="124" cy="36" rx="6" ry="28" transform="rotate(12 124 36)" fill="${c.inC}"/>`,
    bear:`<circle cx="62" cy="62" r="17" fill="${c.earC}"/><circle cx="138" cy="62" r="17" fill="${c.earC}"/><circle cx="62" cy="62" r="9" fill="${c.inC}"/><circle cx="138" cy="62" r="9" fill="${c.inC}"/>`,
    owl:`<path d="M60 70 L56 36 L84 58 Z" fill="${c.earC}"/><path d="M140 70 L144 36 L116 58 Z" fill="${c.earC}"/>`
  };
  if(ears[c.top]) P.push(ears[c.top]);
  // 身體（法袍）＋領口寶石
  P.push(`<path d="M46 200 Q48 146 100 140 Q152 146 154 200 Z" fill="${c.robe}"/>`,
         `<path d="M80 146 L100 168 L120 146" fill="none" stroke="#ffffff88" stroke-width="4" stroke-linecap="round"/>`,
         `<circle cx="100" cy="170" r="7" fill="${c.gem}" stroke="#ffffffaa" stroke-width="2"/>`);
  // 精靈耳朵（頭的兩側）
  if(c.top==="elf") P.push(`<path d="M56 104 L28 86 L58 120 Z" fill="${skin}"/><path d="M144 104 L172 86 L142 120 Z" fill="${skin}"/>`);
  // 頭
  P.push(`<circle cx="100" cy="102" r="46" fill="${skin}"/>`);
  // 瀏海
  P.push(`<path d="M54 104 Q52 54 100 52 Q148 54 146 104 Q138 82 120 78 Q112 90 100 88 Q86 90 80 78 Q62 84 54 104 Z" fill="${c.hair}"/>`);
  // 臉
  P.push(`<ellipse cx="84" cy="108" rx="5.5" ry="7.5" fill="${ink}"/><ellipse cx="116" cy="108" rx="5.5" ry="7.5" fill="${ink}"/>`,
         `<circle cx="86" cy="105" r="2" fill="#fff"/><circle cx="118" cy="105" r="2" fill="#fff"/>`,
         `<ellipse cx="73" cy="121" rx="8" ry="4.5" fill="#ff9bb0" opacity=".55"/><ellipse cx="127" cy="121" rx="8" ry="4.5" fill="#ff9bb0" opacity=".55"/>`,
         `<path d="M94 123 Q100 129 106 123" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`);
  // 頭頂裝飾（在最上層）
  const tops={
    hat:`<ellipse cx="100" cy="66" rx="62" ry="12" fill="${c.hatC}"/><path d="M60 64 Q78 30 108 2 Q118 30 140 64 Z" fill="${c.hatC}"/><path d="M62 62 Q100 54 138 62" fill="none" stroke="#f2c14e" stroke-width="5"/><path d="M104 26 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="#f2c14e"/>`,
    hood:`<path d="M48 108 Q44 44 100 38 Q156 44 152 108 Q146 70 100 64 Q54 70 48 108 Z" fill="${c.hatC}"/><circle cx="74" cy="56" r="3" fill="#f2c14e"/><circle cx="126" cy="52" r="2.4" fill="#f2c14e"/><path d="M100 40 l2.4 5 5.6 .8 -4 4 1 5.6 -5 -2.6 -5 2.6 1 -5.6 -4 -4 5.6 -.8z" fill="#f2c14e"/>`,
    owl:`<circle cx="84" cy="108" r="13" fill="none" stroke="#6b5a3c" stroke-width="3"/><circle cx="116" cy="108" r="13" fill="none" stroke="#6b5a3c" stroke-width="3"/><path d="M97 108 L103 108" stroke="#6b5a3c" stroke-width="3"/>`,
    flower:`${[60,78,100,122,140].map((x,i)=>`<circle cx="${x}" cy="${i%2?58:62}" r="9" fill="${["#ff8fb1","#ffd36e","#ffffff","#ffd36e","#ff8fb1"][i]}"/><circle cx="${x}" cy="${i%2?58:62}" r="3.5" fill="#f2a33a"/>`).join("")}<path d="M54 66 Q100 50 146 66" fill="none" stroke="#5c9f5f" stroke-width="3"/>`,
    horns:`<path d="M66 64 Q56 40 70 30 Q70 48 80 58 Z" fill="${c.earC}"/><path d="M134 64 Q144 40 130 30 Q130 48 120 58 Z" fill="${c.earC}"/><circle cx="72" cy="88" r="3" fill="#7fe3cf"/><circle cx="128" cy="88" r="3" fill="#7fe3cf"/>`,
    uni:`<path d="M92 56 L100 4 L108 56 Z" fill="#ffd27a"/><path d="M94 46 L106 40 M95 34 L105 28 M97 22 L103 18" stroke="#f2a33a" stroke-width="2.4"/><path d="M58 70 Q66 44 92 52" fill="none" stroke="#c9a2ff" stroke-width="7" stroke-linecap="round"/><path d="M142 70 Q134 44 108 52" fill="none" stroke="#8cf0ff" stroke-width="7" stroke-linecap="round"/>`,
    shell:`<path d="M126 60 Q140 46 154 60 Q150 72 140 74 Q130 72 126 60 Z" fill="#ffb3d1"/><path d="M140 52 L140 72 M133 56 L136 72 M147 56 L144 72" stroke="#ff7fae" stroke-width="1.6"/><circle cx="64" cy="70" r="4" fill="#ffffff"/><circle cx="72" cy="62" r="3" fill="#ffffff"/>`,
    fox:"", cat:"", bunny:"", bear:"", elf:`<path d="M66 64 Q100 44 134 64" fill="none" stroke="#c9a2ff" stroke-width="3"/><circle cx="100" cy="52" r="5" fill="#c9a2ff"/>`
  };
  P.push(tops[c.top]||"");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%" role="img" aria-label="${c.nm}">${P.join("")}</svg>`;
}
function avatarImage(id){ return new Promise(res=>{ const im=new Image(); im.onload=()=>res(im); im.onerror=()=>res(null); im.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(avatarSVG(id)); }); }
