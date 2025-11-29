// content.js — ADVANCED YOUTUBE SCRAPER + CENTER POPUP UI

function scrapeYoutube() {
    let title = document.querySelector('#title h1')?.innerText || "";
    let moreBtn = document.querySelector('#description #expand');
    if (moreBtn) moreBtn.click();

    let description =
        document.querySelector('#description')?.innerText ||
        "";

    let comments = [...document.querySelectorAll('#content #content-text')]
        .slice(0, 5)
        .map(c => c.innerText)
        .join(" | ");

    return `
    TITLE: ${title}
    DESCRIPTION: ${description}
    COMMENTS: ${comments}
    `;
}

function scrapePage() {
    const url = window.location.href;

    if (url.includes("youtube.com/watch")) {
        return scrapeYoutube();
    }

    return document.body.innerText.slice(0, 2000);
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {

    if (req.action === "scrape") {
        sendResponse({ text: scrapePage() });
    }

    if (req.action === "showWarning") {
        showCenterPopup(req.confidence);
    }
});

function showCenterPopup(conf) {

    // Create backdrop blur
    let blurBG = document.createElement("div");
    blurBG.id = "pm-blur-bg";
    blurBG.style = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.35);
        backdrop-filter: blur(8px);
        z-index: 999999999;
    `;

    // Create popup container
    let box = document.createElement("div");
    box.id = "pm-popup-box";
    box.style = `
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        padding: 28px 32px;
        width: 360px;

        background: rgba(25, 25, 25, 0.65);
        border: 1px solid rgba(255,255,255,0.12);
        box-shadow: 0 8px 40px rgba(0,0,0,0.45);
        border-radius: 18px;
        backdrop-filter: blur(18px);

        text-align: center;
        font-family: 'Inter', sans-serif;
        color: white;

        opacity: 0;
        transition: 0.25s ease-out;
    `;

    // Modern gradient headline
    box.innerHTML = `
        <h2 style="
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 12px;
            background: linear-gradient(135deg, #ff4d4d, #ff944d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        ">
            ⚠ Unproductive Page Detected
        </h2>

        <p style="
            font-size: 15px;
            opacity: 0.9;
            margin-bottom: 18px;
            line-height: 1.4;
        ">
            This page is likely unproductive.<br>
            Confidence: <b>${(conf * 100).toFixed(1)}%</b><br><br>
            <span style="color:#ff6b6b;">
                If you stay on this page for 5 minutes,<br>
                <b>the tab will automatically close.</b>
            </span>
        </p>

        <button id="pm-close-btn" style="
            padding: 10px 24px;
            background: linear-gradient(135deg, #3a86ff, #6a4cfc);
            border: none;
            border-radius: 10px;
            color: white;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: 0.2s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        ">
            Got it
        </button>
    `;

    // Attach to DOM
    blurBG.appendChild(box);
    document.body.appendChild(blurBG);

    // Animate IN
    setTimeout(() => {
        box.style.transform = "translate(-50%, -50%) scale(1)";
        box.style.opacity = "1";
    }, 20);

    // Close button
    box.querySelector("#pm-close-btn").onclick = () => {
        blurBG.remove();
    };
}
