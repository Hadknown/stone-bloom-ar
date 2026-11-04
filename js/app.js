// 石上生花｜第一階段：圖片辨識 + AR 植物
// 流程：載入完成 → 按鈕可按 → 點擊啟動相機 → 辨識到圖片 → 顯示植物

const sceneEl  = document.querySelector('#scene');
const targetEl = document.querySelector('#target');
const overlay  = document.querySelector('#overlay');
const hud      = document.querySelector('#hud');
const hint     = document.querySelector('#hint');
const startBtn = document.querySelector('#startBtn');
const stopBtn  = document.querySelector('#stopBtn');
const errorMsg = document.querySelector('#errorMsg');

// 之後做五國語言時，會把這些文字搬到語言檔
const TEXT = {
  ready:     '開啟相機',
  starting:  '啟動中，請稍候…',
  scanning:  '請將鏡頭對準圖騰，保持光線充足、畫面穩定',
  found:     '已辨識！移動手機看看植物如何跟隨',
  lost:      '圖騰離開畫面了，請重新對準',
  noSecure:  '此頁面不是 HTTPS 連線，手機瀏覽器會禁止使用相機。\n請改用 https:// 開頭的網址（例如 GitHub Pages）。',
  noCamera:  '此瀏覽器不支援相機功能。\n請改用 iPhone 的 Safari 或 Android 的 Chrome 開啟。',
  denied:    '無法使用相機。\n1. 請確認已允許相機權限\n2. 若曾按過「拒絕」，請到瀏覽器的網站設定重新開啟\n3. 確認沒有其他 App 正在使用相機',
  loadFail:  '辨識資料載入失敗。\n請確認 assets/targets/card.mind 存在、路徑正確。',
};

let arSystem = null;

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.hidden = false;
}

function resetToStart() {
  hud.hidden = true;
  overlay.hidden = false;
  startBtn.disabled = false;
  startBtn.textContent = TEXT.ready;
}

// 1) 場景載入完成後才允許按下按鈕
function onSceneReady() {
  arSystem = sceneEl.systems['mindar-image-system'];
  startBtn.disabled = false;
  startBtn.textContent = TEXT.ready;
}
if (sceneEl.hasLoaded) onSceneReady();
else sceneEl.addEventListener('loaded', onSceneReady);

// 2) 點擊按鈕 → 檢查環境 → 啟動 MindAR（會要求相機權限、載入 .mind）
startBtn.addEventListener('click', async () => {
  errorMsg.hidden = true;

  if (!window.isSecureContext) return showError(TEXT.noSecure);
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return showError(TEXT.noCamera);

  startBtn.disabled = true;
  startBtn.textContent = TEXT.starting;

  try {
    await arSystem.start();
  } catch (err) {
    console.error(err);
    showError(TEXT.denied);
    resetToStart();
  }
});

// 3) MindAR 啟動成功
sceneEl.addEventListener('arReady', () => {
  overlay.hidden = true;
  hud.hidden = false;
  hud.classList.remove('found');
  hint.textContent = TEXT.scanning;
});

// 4) MindAR 啟動失敗（相機被拒絕、.mind 找不到等）
sceneEl.addEventListener('arError', (event) => {
  console.error('arError', event);
  const code = event.detail && event.detail.error;
  showError(code === 'VIDEO_FAIL' ? TEXT.denied : TEXT.loadFail);
  resetToStart();
});

// 5) 辨識到 / 失去圖片：植物顯示與隱藏由 MindAR 自動處理，這裡只更新提示文字
targetEl.addEventListener('targetFound', () => {
  hud.classList.add('found');
  hint.textContent = TEXT.found;
});
targetEl.addEventListener('targetLost', () => {
  hud.classList.remove('found');
  hint.textContent = TEXT.lost;
});

// 6) 關閉相機
stopBtn.addEventListener('click', () => {
  try { arSystem.stop(); } catch (e) { console.warn(e); }
  resetToStart();
});
