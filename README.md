# 石上生花｜AR 原型（第一階段）

技術：HTML + CSS + JavaScript、A-Frame 1.5.0（3D）、MindAR 1.2.5（圖片辨識）。無需安裝任何套件。

## 一、專案結構

```
stone-bloom-ar/
├─ index.html              頁面 + AR 場景 + 植物（3D 模型用 A-Frame 標籤組成）
├─ css/style.css           開始畫面、提示列樣式
├─ js/app.js               按鈕、相機啟動、錯誤處理、提示文字
└─ assets/targets/
   ├─ card.mind            【需自行下載】辨識資料
   └─ card.png             【需自行下載】測試用圖片
```

## 二、取得測試用圖片與 .mind（先用官方範例）

1. 用瀏覽器打開 MindAR 官方範例資源：
   https://github.com/hiukim/mind-ar-js/tree/master/examples/image-tracking/assets/card-example
2. 下載 `card.png` 與 `card.mind`（點檔案 → 右上角下載圖示 "Download raw file"）。
3. 放進 `assets/targets/`，檔名維持 `card.png`、`card.mind`。
4. 測試時把 `card.png` 顯示在另一台螢幕上，或列印出來。

## 三、之後製作自己的 .mind（換成石板圖騰時）

1. 開啟 MindAR 官方編譯工具：https://hiukim.github.io/mind-ar-js-doc/tools/compile
2. 上傳圖騰圖片（可一次上傳多張，順序即 targetIndex 0、1、2…）。
3. 按 Start，等待完成後按 Download，得到 `targets.mind`。
4. 放進 `assets/targets/`，並修改 `index.html` 中 `imageTargetSrc` 的檔名。
5. 圖片品質要點：對比明顯、細節豐富且不規則、避免大面積純色或重複紋路、避免反光。
   工具會顯示特徵點分布，亮點越多、越均勻，辨識越穩。
   石板雕刻對比通常較低，請務必拿實體樣品掃描測試，必要時調整雕刻深淺或加上輔助紋理。

## 四、Windows 本機執行

先安裝 VS Code（https://code.visualstudio.com），再擇一：

- 方法 A：VS Code 安裝 "Live Server" 擴充 → 在 index.html 按右鍵 → Open with Live Server。
  電腦用 `http://localhost` 可開相機（localhost 視為安全環境）。
- 方法 B：安裝 Python 後，在專案資料夾開 PowerShell：`py -m http.server 8080`，
  開 `http://localhost:8080`。

注意：不可直接雙擊 index.html（file:// 無法載入 .mind，也無法開相機）。
手機不能用電腦的 `http://192.168.x.x` 測試相機（不是 HTTPS），請見第六點。

## 五、部署到 GitHub Pages

1. 註冊 GitHub → New repository（例如 `stone-bloom-ar`，Public）。
2. 把專案資料夾內的所有檔案（含 card.mind、card.png）上傳到 repo 根目錄：
   最簡單：repo 頁面 → Add file → Upload files → 把檔案與資料夾拖進去 → Commit。
3. Settings → Pages → Source 選 "Deploy from a branch" → Branch 選 `main`、資料夾 `/ (root)` → Save。
4. 等 1～3 分鐘，網址為 `https://你的帳號.github.io/stone-bloom-ar/`（自動 HTTPS）。
5. 之後更新檔案後，若手機仍是舊版，請清除瀏覽器快取或在網址後加 `?v=2`。

## 六、手機測試

1. 用手機打開 GitHub Pages 網址（可用電腦產生 QR Code 掃描）。
2. iPhone 用 Safari、Android 用 Chrome。
3. 按「開啟相機」→ 允許相機權限 → 對準另一個螢幕上的 card.png 或列印出來的圖片。
4. 應看到綠色植物長在圖片上；移動手機，植物會跟隨；移開圖片，植物消失。

本機即時測試手機（不想每次部署）：可用 Cloudflare Tunnel（`cloudflared tunnel --url http://localhost:8080`）
或 ngrok 取得臨時 https 網址。

## 七、常見問題

| 狀況 | 原因 / 解法 |
|---|---|
| 按鈕一直「載入中」 | CDN 沒載入。檢查網路；確認 index.html 的兩個 script 網址未被改動 |
| 提示「不是 HTTPS」 | 用了 http:// 或區網 IP。改用 GitHub Pages 或 tunnel 網址 |
| 相機被拒絕 | iPhone：設定 → Safari → 相機；Android Chrome：網址列左側鎖頭 → 權限 → 相機。改完重新整理 |
| 「辨識資料載入失敗」 | card.mind 路徑或檔名錯誤，注意大小寫（GitHub Pages 區分大小寫） |
| 在 LINE / Instagram 內開啟無法用相機 | App 內建瀏覽器限制。請點右上角「用預設瀏覽器開啟」（之後階段會做自動偵測與提示） |
| 相機開了但植物不出現 | 圖片太小、反光、光線太暗；或 .mind 與實際圖片不是同一張 |
| 植物很小 / 很大 / 位置偏 | 調整 index.html 中 `#plant` 的 `scale` 與 `position` |
| 植物倒在圖片上（躺平） | 檢查 `#plant` 是否有 `rotation="90 0 0"` |
| 畫面卡頓 | 關閉其他分頁、降低 3D 面數；遇到時可再加優化 |
| 修改後手機沒變化 | 快取。網址加 `?v=數字` 或清除網站資料 |
| 按「關閉相機」後再開失敗 | 重新整理頁面即可（之後可再優化） |

## 八、原理速記

- MindAR 在瀏覽器內分析相機畫面，比對 .mind 中預先計算的圖片特徵點，算出圖片相對相機的位置與角度。
- 它把 `mindar-image-target` 這個 entity 放在算出的位置，裡面的子物件就會「貼」在圖片上；失去追蹤時自動隱藏。
- 座標：圖片中心是原點，圖片寬 = 1 單位；Z 軸朝向使用者，所以植物外層旋轉 90°，把「向上」轉成「從圖片長出來」。
- 用按鈕啟動：手機瀏覽器要求相機必須由使用者操作觸發。
