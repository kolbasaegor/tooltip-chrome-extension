const addStatus = async (hasTooltips) => {
    const status = document.querySelector("#has-tooltips");

    status.textContent = hasTooltips ?
    "✅ Для этой страницы есть подсказки" :
    "❌ Для этой страницы нет подсказок";
}

const getCurrentTabUrl = async () => {
    const currentTab = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTabUrl = currentTab[0].url;

    return currentTabUrl;
}

const getOrigin = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const origin = new URL(tabs[0].url).origin;

    return origin;
}

const isTooltipsEnabledForThisSite = async () => {
    const origin = await getOrigin();

    chrome.runtime.sendMessage({
        dest: "service",
        from: "popup",
        query: "isTooltipsEnabled?",
        url: origin
    });
}

const isTooltips = async () => {
    const currentTabUrl = await getCurrentTabUrl();

    const response = await chrome.runtime.sendMessage({
        dest: "service",
        from: "popup",
        query: "anyTooltips?",
        url: currentTabUrl
    });

    return response;
}

const setCookies = async (url, newValue) => {
    chrome.runtime.sendMessage({
        dest: "service",
        from: "popup",
        query: "setCookie",
        url: url,
        newValue: newValue ? "1" : "0"
    });
}

const createTooltipsCheckbox = (status) => {
    const checkbox = document.createElement('input');
    checkbox.className = "checkbox";
    checkbox.type = 'checkbox';
    checkbox.checked = status;

    const checkboxLine = document.createElement("div");
    checkboxLine.className = "container entry";

    const title = document.createElement("p");
    title.textContent = "Show tooltips on this website";

    checkboxLine.appendChild(title);
    checkboxLine.appendChild(checkbox);

    const content = document.querySelector(".content");
    content.appendChild(checkboxLine);

    checkbox.addEventListener('change', async (event) => {
        const status = event.target.checked;
        const origin = await getOrigin();

        setCookies(origin, status);
    });
}

chrome.runtime.onMessage.addListener( async (request) => {
    console.log(request);
    if (request.dest === "popup") {
        if (request.msg.responseTo === "isTooltipsEnabled?") {
            createTooltipsCheckbox(request.msg.answer);
        }
    }
})

const main = async () => {
    const isTt = await isTooltips();
    addStatus(isTt);

    if (isTt) isTooltipsEnabledForThisSite();
}

main();

