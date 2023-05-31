const hasTooltipsElement = document.querySelector("#has-tooltips");
const targetElem = document.querySelector("#showTooltips");

/**
 * Creates a button that launches the tutorial when clicked
 * @param {number} tabId current page id
 */
const createTutorialButton = (tabId) => {
    const tutorialButton = document.createElement("button");
    tutorialButton.className = "btn";
    tutorialButton.textContent = "➡️";
    targetElem.appendChild(tutorialButton);

    tutorialButton.addEventListener("click", (event) => {
        chrome.tabs.sendMessage(tabId, {
            dest: "content-script",
            from: "popup",
            query: "runTour"
        });
    });
}

/**
 * Sends to service-worker.js a query to see if the current page has a tooltips
 */
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const url = tabs[0].url;
    const response = await chrome.runtime.sendMessage({
        dest: "service",
        from: "popup",
        query: "anyTooltips?",
        arguments: {
            url: url
        }
    });
    
    hasTooltipsElement.textContent = response ?
    "✅ There are tooltips for this website" :
    "❌ There are no tooltips for this website";

    if (response) createTutorialButton(tabs[0].id);
});
