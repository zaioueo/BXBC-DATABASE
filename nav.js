// ==========================================================================
// GLOBAL NAVIGATION & RENDER MANAGER (最終標題鎖死與路由智慧分配渲染引擎)
// ==========================================================================

// 💡 核心新增：就是這行最高權限指令！網頁一開機全自動強行將瀏覽器分頁標題更換、鎖死為大寫的 CHARACTERS
document.title = "CHARACTERS";

document.addEventListener("DOMContentLoaded", () => {
    const navContainer = document.getElementById("global-nav");
    if (!navContainer) return;

    // 🔴 全站死者名單庫
    const deadItems = [
        { name: "HOLLY CALLAHAN", url: "bonabi.html" },
        { name: "TRIXIE SHERMAN", url: "mangle.html" },
        { name: "JOSHUA WOODSIDE", url: "joshua.html" },
        { name: "OSCAR WOODSIDE", url: "oscar.html" },
        { name: "VICTOR CALLAHAN", url: "victor.html" }
    ];

    // 🟢 全站生還者名單庫
    const aliveItems = [
        { name: "DOMINIC", url: "dom.html" }
    ];

    const currentPath = window.location.pathname;
    const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || "bonabi.html";

    // 智慧路由判定：讀取外部資料檔案宣告的 isAliveSubject 變數
    const isAlive = (typeof currentCharacterData !== "undefined" && currentCharacterData.isAliveSubject === true);
    
    // 依據資料檔案的宣告，分派對應的網址、狀態文字與 CSS 樣式
    const parentMenu = isAlive ? "alive.html" : "dead.html";
    const statusLabel = isAlive ? "[ ALIVE ]" : "[ DEAD ]";
    const labelClass = isAlive ? "alive-label" : "dead-label";
    const currentList = isAlive ? aliveItems : deadItems;

    // 1. 生成回上一層分類選單按鈕
    let htmlContent = `<a onclick="fadeTo('${parentMenu}')" class="nav-btn submenu-btn">< SELECTION MENU</a>`;
    
    // 2. 建立專屬類別列並自動套用 active 高亮狀態
    htmlContent += `<div class="nav-status-group"><span class="group-label ${labelClass}">${statusLabel}</span>`;
    currentList.forEach(item => {
        const isActive = currentFile.toLowerCase() === item.url.toLowerCase() ? "active" : "";
        htmlContent += `<a onclick="fadeTo('${item.url}')" class="nav-btn ${isActive}">${item.name}</a>`;
    });
    htmlContent += `</div>`;

    navContainer.innerHTML = htmlContent;

    // 3. 全自動清單邊距壓縮
    const overrideStyle = document.createElement("style");
    overrideStyle.innerHTML = `
        .lore-text, .list-spacing, .toggle-content {
            white-space: pre-line !important; 
            padding: 0 !important;
            margin: 0 !important;
            padding-left: 5px !important;    
            text-align: left !important;
        }
    `;
    document.head.appendChild(overrideStyle);

    // 4. 核心畫面渲染
    if (typeof currentCharacterData !== "undefined") {
        renderCharacter(currentCharacterData);
    }

    setTimeout(() => { if (document.body) document.body.classList.add("fade-in"); }, 10);
});

// 通用 HTML 物理畫面渲染引擎
function renderCharacter(data) {
    let notesHTML = "";
    if (data.notes && Array.isArray(data.notes)) {
        notesHTML = data.notes.map((note, index) => `<div class="small-note">${index + 1}. ${note}</div>`).join('');
    }

    const layout = document.getElementById('view-layout');
    if (!layout) return;

    // 資訊欄位分流控制
    const fourthLabel = data.isAliveSubject ? "LOCATION:" : "DIED:";
    const fourthValue = data.isAliveSubject ? "Hurricane, Utah" : data.died;

    layout.innerHTML = `
        <div class="wiki-infobox">
            <div class="infobox-title" style="color: ${data.titleColor}; border-bottom-color: ${data.titleColor};">${data.name}</div>
            <img src="${data.pfp}" class="infobox-pfp" onerror="this.src='https://placehold.co'">
            <table class="infobox-table">
                <tr><td class="label">Name</td><td>${data.name}</td></tr>
                <tr><td class="label">Alias</td><td>${data.alias}</td></tr>
                <tr><td class="label">Gender</td><td>${data.gender}</td></tr>
                <tr><td class="label">${fourthLabel}</td><td>${fourthValue}</td></tr>
            </table>
        </div>
        <div class="lore-content-area">
            <h1 style="color: ${data.titleColor}">${data.name}</h1>
            <div class="quote-block">"${data.quote}"</div>
            
            <h2 class="collapsible-header" onclick="toggleSection(this)">PURPOSE</h2>
            <div class="toggle-content" style="display: none;"><div class="lore-text">${data.purpose}</div></div>
            
            <h2 class="collapsible-header" onclick="toggleSection(this)">BACKGROUND</h2>
            <div class="toggle-content" style="display: none;"><div class="lore-text">${data.bg}</div></div>
            
            <h2 class="collapsible-header" onclick="toggleSection(this)">PERSONALITY</h2>
            <div class="toggle-content" style="display: none;"><div class="lore-text">${data.pers}</div></div>
            
            <h2 class="collapsible-header" onclick="toggleSection(this)">LIKES</h2>
            <div class="toggle-content" style="display: none;"><div class="lore-text">${data.likes}</div></div>

            <h2 class="collapsible-header" onclick="toggleSection(this)">DISLIKES</h2>
            <div class="toggle-content" style="display: none;"><div class="lore-text">${data.dislikes}</div></div>
            
            <h2 class="collapsible-header" onclick="toggleSection(this)">RELATIONSHIPS</h2>
            <div class="toggle-content" style="display: none;"><div class="lore-text">${data.rel}</div></div>

            <h2 class="collapsible-header" onclick="toggleSection(this)">NOTES</h2>
            <div class="toggle-content" style="display: none;"><div class="list-spacing">${notesHTML}</div></div>
        </div>
    `;
}

function toggleSection(element) {
    const content = element.nextElementSibling;
    content.style.display = (content.style.display === "none" || content.style.display === "") ? "block" : "none";
}

function fadeTo(url) {
    if (document.body) { document.body.classList.remove("fade-in"); document.body.classList.add("fade-out"); }
    let dest = (url === "index.html") ? "lobby.html" : url;
    setTimeout(() => { window.location.href = dest; }, 450);
}