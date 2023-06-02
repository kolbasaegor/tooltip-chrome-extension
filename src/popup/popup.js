// const addStatus = async (hasTooltips) => {
//     const status = document.querySelector("#has-tooltips");

//     status.textContent = hasTooltips ?
//     "✅ Для этой страницы есть подсказки" :
//     "❌ Для этой страницы нет подсказок";
// }


const getCurrentTabUrl = async () => {
    const currentTab = await chrome.tabs.query({ active: true, currentWindow: true });
    return currentTab[0].url;
}

const getOrigin = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return new URL(tabs[0].url).origin;
}


// const isTooltipsEnabledForThisSite = async () => {
//     const origin = await getOrigin();

//     chrome.runtime.sendMessage({
//         dest: "service",
//         from: "popup",
//         query: "isTooltipsEnabledForThisSite?",
//         url: origin
//     });
// }

// const isTooltipsEnabledForThisUrl = async () => {
//     const url = await getCurrentTabUrl();

//     chrome.runtime.sendMessage({
//         dest: "service",
//         from: "popup",
//         query: "isTooltipsEnabledForThisUrl?",
//         url: url
//     });
// }

// const isTooltips_site = async () => {
//     const origin = await getOrigin();

//     const response = await chrome.runtime.sendMessage({
//         dest: "service",
//         from: "popup",
//         query: "anyTooltipsForThisSite?",
//         url: origin
//     });

//     return response;
// }

// const isTooltips_url = async () => {
//     const currentTabUrl = await getCurrentTabUrl();

//     const response = await chrome.runtime.sendMessage({
//         dest: "service",
//         from: "popup",
//         query: "anyTooltipsForThisUrl?",
//         url: currentTabUrl
//     });

//     return response;
// }

// const setCookies = async (url, newValue) => {
//     chrome.runtime.sendMessage({
//         dest: "service",
//         from: "popup",
//         query: "setCookie",
//         url: url,
//         newValue: newValue ? "1" : "0"
//     });
// }

// const createTooltipsCheckbox = (status) => {
//     const checkbox = document.createElement('input');
//     checkbox.className = "checkbox";
//     checkbox.type = 'checkbox';
//     checkbox.checked = status;

//     const checkboxLine = document.createElement("div");
//     checkboxLine.className = "container entry";

//     const title = document.createElement("p");
//     title.textContent = "Show tooltips on this website";

//     checkboxLine.appendChild(title);
//     checkboxLine.appendChild(checkbox);

//     const content = document.querySelector(".content");
//     content.appendChild(checkboxLine);

//     checkbox.addEventListener('change', async (event) => {
//         const status = event.target.checked;
//         const origin = await getOrigin();

//         setCookies(origin, status);
//     });
// }

const content = document.querySelector(".content");

const firstLine = async (status) => {
    const statusElem = document.createElement("div");
    statusElem.id = "site-has-tooltips";
    statusElem.className = "container entry";

    const statusTitle = document.createElement("p");
    statusTitle.textContent = status ?
    "Show tooltips on this site" :
    "No tooltips on this site";

    statusElem.appendChild(statusTitle);
    content.appendChild(statusElem);

    const origin = await getOrigin();
    if (status) queryToService("isTooltipsEnabled?site", {url: origin});
}

const firstLineCheckbox = async (status) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = status;

    const statusElem = document.querySelector("#site-has-tooltips");
    statusElem.appendChild(checkbox);

    const url = await getCurrentTabUrl();
    checkbox.addEventListener('change', async (event) => {
        const status = event.target.checked;
        const origin = await getOrigin();

        queryToService("setCookieSite", {
            url: origin,
            value: status ? "1" : "0"
        });

        location.reload();
    });

    if (status) queryToService("isTooltips?url", {url: url});
}

const secondLine = async (status) => {
    const statusElem = document.createElement("div");
    statusElem.id = "url-has-tooltips";
    statusElem.className = "container entry";

    const statusTitle = document.createElement("p");
    statusTitle.textContent = status ?
    "Show tooltips on this page" :
    "No tooltips on this page";

    statusElem.appendChild(statusTitle);
    content.appendChild(statusElem);

    const url = await getCurrentTabUrl();
    if (status) queryToService("isTooltipsEnabled?url", {url: url});
}

const secondLineCheckbox = async (status) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = status;

    const statusElem = document.querySelector("#url-has-tooltips");
    statusElem.appendChild(checkbox);

    checkbox.addEventListener('change', async (event) => {
        const status = event.target.checked;
        const url = await getCurrentTabUrl();

        queryToService("setCookieUrl", {
            url: url,
            value: status ? "1" : "0"
        });
    });
}


const queryToService = (query, parameters) => {
  chrome.runtime.sendMessage({
    dest: "service",
    from: "popup",
    query: query,
    parameters: parameters
  });
}

const resolveService = async (response) => {
  switch(response.msg.respondTo) {
    case "isTooltips?site":
        firstLine(response.msg.answer);
        break;

    case "isTooltipsEnabled?site":
        firstLineCheckbox(response.msg.answer);
        break;

    case "isTooltips?url":
        secondLine(response.msg.answer);
        break;

    case "isTooltipsEnabled?url":
        secondLineCheckbox(response.msg.answer);
        break;
  }
}

const resolve = (request) => {
  if (request.dest != "popup") return;

  if (request.from === "service") resolveService(request);
}

chrome.runtime.onMessage.addListener(async (request) => {
  resolve(request);
})


const main = async () => {
    const origin = await getOrigin();
    queryToService("isTooltips?site", {url: origin});
}

main();
