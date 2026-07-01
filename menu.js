// ==========================================================================
// CENTRAL FNF MENU ENGINE - DEFINITIVE EDITION (全站通用轉場、音效與音樂核心)
// ==========================================================================
let globalBGM = null;

document.addEventListener("DOMContentLoaded", () => {
    // 強制網頁一開機直接進入全亮狀態
    if (document.body) {
        document.body.style.opacity = "1";
        document.body.classList.add("fade-in");
    }

    const currentPath = window.location.pathname;
    const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1).toLowerCase();

    // 🎵 音樂過濾：只有使用者待在死者選單 "dead.html" 時開播
    if (currentFile === "dead.html") {
        let isMusicEnabled = localStorage.getItem("terminalMusicSetting") !== "OFF";
        updateToggleText(isMusicEnabled);
        try {
            globalBGM = new Audio('bgm.mp3'); globalBGM.loop = true; globalBGM.volume = 0.3;           
            const startBGM = () => {
                if (localStorage.getItem("terminalMusicSetting") !== "OFF" && globalBGM) {
                    globalBGM.play().then(() => {
                        document.removeEventListener('click', startBGM); document.removeEventListener('mouseenter', startBGM);
                    }).catch(() => {});
                }
            };
            document.addEventListener('click', startBGM); document.addEventListener('mouseenter', startBGM);
        } catch(e) {}
    }
});

function toggleMusicState() {
    let isMusicEnabled = localStorage.getItem("terminalMusicSetting") !== "OFF";
    if (isMusicEnabled) { localStorage.setItem("terminalMusicSetting", "OFF"); updateToggleText(false); if (globalBGM) globalBGM.pause(); } 
    else { localStorage.setItem("terminalMusicSetting", "ON"); updateToggleText(true); if (globalBGM) globalBGM.play().catch(() => {}); }
}
function updateToggleText(isEnabled) {
    const toggleTextElement = document.getElementById("music-toggle-text");
    if (toggleTextElement) toggleTextElement.innerText = isEnabled ? "MUSIC: ON" : "MUSIC: OFF";
}

let audioCtx = null;
function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }

function playHoverSound() {
    try {
        initAudio(); const osc = audioCtx.createOscillator(), gain = audioCtx.createGain(); osc.type = 'triangle'; osc.frequency.setValueAtTime(440, audioCtx.currentTime); 
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.08); osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.08);
    } catch(e) {}
}

function playConfirmSound() {
    try {
        initAudio(); const now = audioCtx.currentTime; const osc1 = audioCtx.createOscillator(), gain1 = audioCtx.createGain(); osc1.type = 'sawtooth'; osc1.frequency.setValueAtTime(293.66, now); gain1.gain.setValueAtTime(0.08, now); gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.4); osc1.connect(gain1); gain1.connect(audioCtx.destination); osc1.start(); osc1.stop(now + 0.4);
        setTimeout(() => { const osc2 = audioCtx.createOscillator(), gain2 = audioCtx.createGain(); osc2.type = 'square'; osc2.frequency.setValueAtTime(587.33, audioCtx.currentTime); gain2.gain.setValueAtTime(0.06, audioCtx.currentTime); gain2.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3); osc2.connect(gain2); gain2.connect(audioCtx.destination); osc2.start(); osc2.stop(audioCtx.currentTime + 0.3); }, 70);
    } catch(e) {}
}

function fnfNavigate(clickedElement, targetUrl) {
    playConfirmSound(); 
    if (globalBGM && localStorage.getItem("terminalMusicSetting") !== "OFF") {
        let fadeInterval = setInterval(() => { if (globalBGM.volume > 0.02) { globalBGM.volume -= 0.03; } else { globalBGM.volume = 0; globalBGM.pause(); clearInterval(fadeInterval); } }, 30); 
    }
    const allButtons = document.querySelectorAll('.dir-btn');
    const headerGroup = document.getElementById('fnf-header');
    const backButton = document.getElementById('fnf-back');
    const box = document.getElementById('fnf-box');

    if(headerGroup) headerGroup.classList.add('fnf-hide');
    if(backButton) backButton.classList.add('fnf-hide');

    allButtons.forEach(btn => { if (btn === clickedElement) { btn.classList.add('fnf-selected'); } else { btn.classList.add('fnf-fade-out'); } });

    const boxCenter = box.offsetHeight / 2;
    const btnCenter = clickedElement.offsetTop + (clickedElement.offsetHeight / 2);
    const targetOffset = boxCenter - btnCenter;
    clickedElement.style.transform = `translateY(${targetOffset}px) scale(1.05)`;

    setTimeout(() => {
        if (document.body) { document.body.style.opacity = "0"; document.body.classList.remove("fade-in"); document.body.classList.add("fade-out"); }
        
        // 💡 智慧路由防禦：目的地只要寫 index.html，一律最高優先權強行換成大廳 lobby.html
        let destination = targetUrl;
        if (targetUrl === "index.html" || targetUrl === "lobby.html") {
            destination = "lobby.html";
        }
        setTimeout(() => { window.location.href = destination; }, 450); 
    }, 550);
}

function fadeTo(url) {
    if (globalBGM && localStorage.getItem("terminalMusicSetting") !== "OFF") {
        let fadeInterval = setInterval(() => { if (globalBGM.volume > 0.02) { globalBGM.volume -= 0.04; } else { globalBGM.volume = 0; globalBGM.pause(); clearInterval(fadeInterval); } }, 30);
    }
    if (document.body) {
        document.body.style.opacity = "0"; document.body.classList.remove("fade-in"); document.body.classList.add("fade-out");
    }
    // 💡 智慧強制校正：不管是從 characters 還是 dead 退出來，只要敢寫 index.html，通通強制撥回 lobby.html
    let destination = url;
    if (url === "index.html" || url === "lobby.html") {
        destination = "lobby.html";
    }
    setTimeout(() => { window.location.href = destination; }, 450);
}