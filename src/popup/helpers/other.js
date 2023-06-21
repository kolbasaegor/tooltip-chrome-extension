const displayMessage = (type, text) => {
    const elem = document.querySelector(element);
    elem.textContent = text;
    elem.className = type;
    elem.hidden = false;
}

const createInfoMessage = () => {
    const infoMessage = document.createElement("p");
    infoMessage.id = "info-message";
    infoMessage.hidden = true;

    content.appendChild(infoMessage);
}

const showInfo = (type, text) => {
    const infoMessage = document.querySelector("#info-message");
    infoMessage.className = type;
    infoMessage.textContent = text;
    infoMessage.hidden = false;
}

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

const isCreateTooltipsPageOpen = async () => {
    const tabs = await chrome.tabs.query({});

    for (var tab of tabs) {
        if (tab.url.endsWith("create_tooltips_page/create_tooltips.html")) {
            return true;
        }
    }

    return false;
}

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