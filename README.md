# 財富階梯計算機＋小實驗召喚所

- 財富階梯計算機：https://rcchieh.github.io/wealth-ladder/
- 小實驗召喚所：https://rcchieh.github.io/wealth-ladder/summon/

所有試算和角色資料只存在使用者自己的瀏覽器，不會上傳。

## 原始碼與改版流程

`src/` 是單一來源：
- `wealth-ladder.html`、`summon.html`：claude.ai 版本（也是網站版的來源）
- `build_site.py`：轉成網站版（換網址、加 head／OG、加網頁內回饋）。在 `src/` 的上一層放好檔案後執行：`python3 build_site.py`
- `site-feedback.js`：網頁內回饋視窗，送到 Apps Script
- `feedback-apps-script.gs`：試算表裡的 Apps Script 接收端（寫進「網站回饋」分頁）
