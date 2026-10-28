// 財富階梯網站回饋接收端：網頁 POST 一筆 JSON → 寫進「網站回饋」分頁
// 防灌：欄位白名單＋長度上限、隱藏欄位擋機器人、每分鐘全站上限、同一瀏覽器 30 秒內不重複
const SHEET = '網站回饋';
const HEAD = ['時間戳記', '每週時間', '你的目標', '回饋', '工作', '來源', '匿名摘要'];
const MAX_PER_MIN = 30;

function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.website) return out({ ok: true });                       // 隱藏欄位有值＝機器人，假裝成功
    const cache = CacheService.getScriptCache();
    const n = Number(cache.get('rate') || 0);
    if (n >= MAX_PER_MIN) return out({ ok: false, error: 'busy' });
    cache.put('rate', String(n + 1), 60);
    const cid = String(d.cid || '').slice(0, 40);
    if (cid) { if (cache.get('c' + cid)) return out({ ok: false, error: 'too_fast' }); cache.put('c' + cid, '1', 30); }
    const clip = (v, m) => String(v == null ? '' : v).replace(/^[=+\-@]/, "'$&").slice(0, m);   // 防試算表公式注入
    const row = [new Date(), clip(d.hours, 20), clip(d.goal, 30), clip(d.note, 500), clip(d.job, 20), clip(d.source, 40), clip(d.summary, 300)];
    if (!row[1] || !row[2] || !row[3]) return out({ ok: false, error: 'missing' });
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
    if (sh.getLastRow() === 0) sh.appendRow(HEAD);
    sh.appendRow(row);
    if (row[5] === '預約 AI 量身卡') {                               // 預約：回傳這是第幾位預約者
      const src = sh.getRange(2, 6, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
      return out({ ok: true, n: src.filter(r => r[0] === '預約 AI 量身卡').length });
    }
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: 'server' });
  }
}
function doGet() { return out({ ok: true, hello: 'wealth-ladder feedback' }); }
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
