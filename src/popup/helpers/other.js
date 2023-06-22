/**
 * Message for showing important info in popup.
 * Initially is hidden
 */
const createInfoMessage = () => {
    const infoMessage = document.createElement("p");
    infoMessage.id = "info-message";
    infoMessage.hidden = true;

    content.appendChild(infoMessage);
}

/**
 * Shows info message
 * @param {string} type err | suc
 * @param {string} text displayed text
 */
const showInfo = (type, text) => {
    const infoMessage = document.querySelector("#info-message");
    infoMessage.className = type;
    infoMessage.textContent = text;
    infoMessage.hidden = false;
}

/**
 * Opens new page
 * @param {JSON} parameters url and origin of current page
 */
const openNewPage = (parameters) => {
    const newPageUrl = "../../create_tooltips_page/create_tooltips.html";

    chrome.tabs.create({url: newPageUrl, active:false}, (tab) => { 
        setTimeout(()=>{
          chrome.tabs.sendMessage(tab.id, parameters, () => {
              chrome.tabs.update(tab.id, {active: true});
          })
        },500)
    });
}

/**
 * Checks if CreateTooltipsPage is open
 * @returns boolean
 */
const isCreateTooltipsPageOpen = async () => {
    const tabs = await chrome.tabs.query({});

    for (var tab of tabs) {
        if (tab.url.endsWith("create_tooltips_page/create_tooltips.html")) {
            return true;
        }
    }

    return false;
}

/**
 * Opens CreateTooltipsPage
 * @returns boolean
 */
const openCreateTooltipsPage = async () => {
    const isOpen = await isCreateTooltipsPageOpen();
    if (isOpen) return false;

    const origin = await getOrigin();
    const url = await getCurrentTabUrl();
    const parameters = {
        dest: "create_tooltips",
        from: "popup",
        origin: origin,
        url: url
    }

    openNewPage(parameters);
    return true;
}