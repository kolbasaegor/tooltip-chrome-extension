/**
 * get current tab ulr
 * @returns current tab url
 */
const getCurrentTabUrl = async () => {
    const currentTab = await chrome.tabs.query({ active: true, currentWindow: true });
    return currentTab[0].url;
}

/**
 * get origin of the page
 * @returns current tab origin url
 */
const getOrigin = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return new URL(tabs[0].url).origin;
}

/**
 * creates an element that shows the presence of tooltips on the site, 
 * if there are any, it also creates a checkbox for them
 * @param {boolean} status are there any tooltips for this site
 */
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

/**
 * creates a checkbox with which you can 
 * enable/disable tooltips on the site
 * @param {boolean} status are tooltips for this site enabled in cookies
 */
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

/**
 * creates an element that shows the presence of tooltips on the url, 
 * if there are any, it also creates a checkbox for them
 * @param {boolean} status are there any tooltips for this url
 */
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

/**
 * creates a checkbox with which you can 
 * enable/disable tooltips on the url
 * @param {boolean} status are tooltips for this url enabled in cookies
 */
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

const footer = () => {
    const loginButton = document.createElement("a");
    loginButton.href = "#";
    loginButton.textContent = "login";

    const registerButton = document.createElement("a");
    registerButton.href = "#";
    registerButton.textContent = "register";

    loginButton.onclick = () => {
        hideRegisterForm();
        showLoginForm();
    }

    registerButton.onclick = () => {
        hideLoginForm();
        showRegisterForm();
    }

    const footer = document.querySelector(".footer");
    footer.appendChild(loginButton);
    footer.appendChild(registerButton);
}

const createLoginForm = async () => {
    const loginFrom = document.createElement("div");
    loginFrom.id = "login-form";
    loginFrom.className = "entry";

    const title = document.createElement("p");
    title.textContent = "Log In Form";

    const loginTitle = document.createElement("p");
    loginTitle.textContent = "login:";

    const passwordTitle = document.createElement("p");
    passwordTitle.textContent = "password:";

    loginFrom.appendChild(title);
    loginFrom.appendChild(loginTitle);
    loginFrom.appendChild(passwordTitle);
    loginFrom.hidden = true;

    setTimeout(() => {
        content.appendChild(loginFrom);
    }, "1000");
}

const createRegisterForm = async () => {
    const registerFrom = document.createElement("div");
    registerFrom.id = "register-form";
    registerFrom.className = "entry";
    registerFrom.hidden = true;

    registerFrom.textContent = "Register Form:";

    setTimeout(() => {
        content.appendChild(registerFrom);
    }, "1500");
}

const showRegisterForm = () => {
    const registerFrom = document.querySelector("#register-form");
    registerFrom.hidden = false;
}

const hideRegisterForm = () => {
    const registerFrom = document.querySelector("#register-form");
    registerFrom.hidden = true;
}

const showLoginForm = () => {
    const loginFrom = document.querySelector("#login-form");
    loginFrom.hidden = false;
}

const hideLoginForm = () => {
    const loginFrom = document.querySelector("#login-form");
    loginFrom.hidden = true;
}

/**
 * send a request to service-worker.js
 * @param {string} query 
 * @param {JSON} parameters 
 */
const queryToService = (query, parameters={}) => {
  chrome.runtime.sendMessage({
    dest: "service",
    from: "popup",
    query: query,
    parameters: parameters
  });
}

/**
 * processes responses from service-worker.js
 * @param {JSON} response response from service-worker.js
 */
const resolveService = async (response) => {
  switch(response.msg.respondTo) {
    case "isUserLoggedIn?":
        if (!response.msg.answer) footer();
        break;

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

    case "getUserStatus":
        console.log(response.msg.answer);
        break;
  }
}

/**
 * processes responses from other components
 * @param {JSON} request request from other components
 */
const resolve = (request) => {
  if (request.dest != "popup") return;

  if (request.from === "service") resolveService(request);
}

/**
 * Listens to messages from service-worker.js and content-script.js
 */
chrome.runtime.onMessage.addListener(async (request) => {
  resolve(request);
})

/**
 * entry point
 */
const main = async () => {
    createLoginForm();
    createRegisterForm();

    const origin = await getOrigin();
    queryToService("isTooltips?site", {url: origin});;
    queryToService("isUserLoggedIn?");
}

const content = document.querySelector(".content"); // global variable
main(); // <-- entry point is here
