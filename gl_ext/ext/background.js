// background.js — PRODUCTIVE/UNPRODUCTIVE LOGIC + AUTO CLOSE

const API_URL = "http://127.0.0.1:8000/predict";
const TAB_EVENT_URL = "http://127.0.0.1:8000/tab-event";

const CLASSIFY_DELAY = 60 * 1000; // 1 minute
const AUTO_CLOSE_DELAY = 5 * 60 * 1000; // 5 minutes

let activeTimers = {}; // store per-tab timer data

async function logTabEvent(url) {
    const page_type = url.includes("youtube.com/watch") ? "youtube" : "webpage";
    await fetch(TAB_EVENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, page_type })
    });
}

chrome.tabs.onActivated.addListener(async (info) => {
    const tab = await chrome.tabs.get(info.tabId);

    chrome.scripting.executeScript({
        target: { tabId: info.tabId },
        files: ["content.js"]
    });

    startMonitoring(info.tabId, tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {

        chrome.scripting.executeScript({
            target: { tabId },
            files: ["content.js"]
        });

        startMonitoring(tabId, changeInfo.url);
    }
});

function startMonitoring(tabId, url) {
    logTabEvent(url);

    console.log("▶ Monitoring started:", url);

    // Clear previous timers for this tab
    clearTimeout(activeTimers[tabId]?.classifyTimer);
    clearTimeout(activeTimers[tabId]?.closeTimer);

    // Start new timers
    activeTimers[tabId] = {
        url,
        classifyTimer: setTimeout(() => classifyPage(tabId, url), CLASSIFY_DELAY),
        closeTimer: null // set later IF unproductive
    };
}

async function classifyPage(tabId, expectedUrl) {
    const tab = await chrome.tabs.get(tabId);

    if (!tab || tab.url !== expectedUrl) {
        console.log("⏩ URL changed, stopping classification.");
        return;
    }

    console.log("⏳ 1 minute reached → scraping & classifying:", expectedUrl);

    try {
        let scraped = await chrome.tabs.sendMessage(tabId, { action: "scrape" });

        let resp = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: scraped.text })
        });

        let result = await resp.json();

        console.log("📥 AI result:", result);

        if (result.unproductive < 0.5) {
            console.log("🟢 Productive → No popup. Monitoring ends.");
            return;
        }

        // UNPRODUCTIVE → show popup + schedule close
        chrome.tabs.sendMessage(tabId, {
            action: "showWarning",
            confidence: result.unproductive
        });

        // schedule auto close at 5 min
        activeTimers[tabId].closeTimer = setTimeout(() => {
            chrome.tabs.remove(tabId);
            console.log("❌ TAB CLOSED due to low productivity:", expectedUrl);
        }, AUTO_CLOSE_DELAY);

    } catch (err) {
        console.error("🔥 ERROR:", err);
    }
}
