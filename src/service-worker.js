import * as db from "./db/db.js";

/**
 * sends message to content-script.js
 * @param {number} id content script tab id
 * @param {JSON | boolean} message message to content script
 */
const sendMessageToContentScript = (id, message) => {
  chrome.tabs.sendMessage(id, {
    dest: "content-script",
    from: "service",
    msg: message
  });
}

/**
 * sends message to popup.js
 * @param {JSON | boolean} message message to popup
 */
const sendMessageToPopup = (message) => {
  chrome.runtime.sendMessage({
    dest: "popup",
    from: "service",
    msg: message
  });
}

/**
 * searches for and returns cookies with the
 * given parameters, if not then creates 
 * it with a value = defaultValue
 * @param {string} url 
 * @param {string} name 
 * @param {string} defaultValue 
 * @returns cookie
 */
const getCookie = async (url, name, defaultValue="1") => {
  const cookie = await chrome.cookies.get({ url: url, name: name });

  if (!cookie) {
    const newCookie = await chrome.cookies.set({
      url: url, 
      name: name, 
      expirationDate: (new Date().getTime() / 1000) + 60*60*24*30,
      value: defaultValue
    });
    return newCookie;
  } else {
    return cookie;
  }
}

/**
 * set cookie with given parameters
 * @param {string} url 
 * @param {string} name 
 * @param {string} value 
 */
const setCookie = (url, name, value) => {
  chrome.cookies.set({
    url: url, 
    name: name, 
    value: value,
    expirationDate: (new Date().getTime() / 1000) + 60*60*24*30
  });
}

/**
 * checks if there are tooltips for the given url
 * @param {string} on where to see
 * @param {string} url url of the page
 * @returns boolean
 */
const isTooltipsExist = async (on, url) => {
  if (on === "site") return db.isTooltipsDomain(url);
  if (on === "url") return db.isTooltipsUrl(url);
}

/**
 * checks if tooltips enabled for the given url
 * @param {string} on where to see
 * @param {string} url url of the page
 * @returns boolean
 */
const isTooltipsEnabled = async (on, url) => {
  const cookieName = on === "site" ? "tooltips_enabled_site" : "tooltips_enabled_url";
  const cookie = await getCookie(url, cookieName);

  return cookie.value === "1" ? true : false;
}

/**
 * returns tooltips for given url
 * @param {string} url 
 * @returns JSON tooltips for given url
 */
const getTooltips = async (url, type) => {
  const data = await db.getTooltips(url, type);

  return {
    options: data.options,
    steps: data.steps.arr
  };
}

const isEmptyObject = (obj) => {
  return Object.keys(obj).length == 0;
}

const getUserStatus = async () => {
  var status = await chrome.storage.local.get(["user_status"]);
  
  if (isEmptyObject(status)) {
    chrome.storage.local.set({ user_status: "default"});
    return "default";
  }

  return status.user_status;
}

const setUserStatus = async (status) => {
  chrome.storage.local.set({ user_status: status });
}

const getUsername = async () => {
  const username = await chrome.storage.local.get(["username"]);

  return username.username;
}

const setUsername = async (username) => {
  chrome.storage.local.set({ username: username });
}

const isUserLoggedIn = async () => {
  var status = await chrome.storage.local.get(["logged_in"]);
  
  if (isEmptyObject(status)) {
    chrome.storage.local.set({ logged_in: false});
    return false;
  }

  return status.logged_in;
}

const userLoggedIn = async () => {
  chrome.storage.local.set({ logged_in: true });
}



/**
 * processes requests from content-script.js
 * @param {JSON} request request from content-script.js
 */
const resolveContentScript = async (request, sender) => {
  switch(request.query) {
    case "isTooltips?url":
      var answer = await isTooltipsExist("url", sender.url);
      sendMessageToContentScript(sender.tab.id, {
        respondTo: request.query,
        answer: answer
      });
      break;

    case "isTooltipsEnabled?site":
      var answer = await isTooltipsEnabled("site", sender.origin);
      sendMessageToContentScript(sender.tab.id, {
        respondTo: request.query,
        answer: answer
      });
      break;

    case "isTooltipsEnabled?url":
      var answer = await isTooltipsEnabled("url", sender.url);
      sendMessageToContentScript(sender.tab.id, {
        respondTo: request.query,
        answer: answer
      });
      break;

    case "disableTooltipsUrl":
      setCookie(sender.url, "tooltips_enabled_url", "0");
      break;

    case "getTooltips":
      const status = await getUserStatus();
      const tooltips = await getTooltips(sender.url, status);

      sendMessageToContentScript(sender.tab.id, {
        respondTo: request.query,
        answer: tooltips
      });
      break;
  }
}

/**
 * processes requests from popup.js
 * @param {JSON} request request from popup.js
 */
const resolvePopup = async (request) => {
  switch(request.query) {
    case "isUserLoggedIn?":
      var answer = await isUserLoggedIn();
      sendMessageToPopup({
        respondTo: request.query,
        answer: answer
      });
      break;

    case "getUsername":
      var answer = await getUsername();
      sendMessageToPopup({
        respondTo: request.query,
        answer: answer
      });
      break;

    case "setUsername":
      setUsername(request.parameters.username);
      break;

    case "getUserStatus":
      var answer = await getUserStatus();
      sendMessageToPopup({
        respondTo: request.query,
        answer: answer
      });
      break;

    case "setUserStatus":
      setUserStatus(request.parameters.status);
      break;

    case "isTooltips?site":
      var answer = await isTooltipsExist("site", request.parameters.url);
      sendMessageToPopup({
        respondTo: request.query,
        answer: answer
      });
      break;

    case "isTooltips?url":
      var answer = await isTooltipsExist("url", request.parameters.url);
      sendMessageToPopup({
        respondTo: request.query,
        answer: answer
      });
      break;

    case "isTooltipsEnabled?site":
      var answer = await isTooltipsEnabled("site", request.parameters.url);
      sendMessageToPopup({
        respondTo: request.query,
        answer: answer
      });
      break;

    case "isTooltipsEnabled?url":
      var answer = await isTooltipsEnabled("url", request.parameters.url);
      sendMessageToPopup({
        respondTo: request.query,
        answer: answer
      });
      break;

    case "setCookieUrl":
      setCookie(request.parameters.url, "tooltips_enabled_url", request.parameters.value);
      break;

    case "setCookieSite":
      setCookie(request.parameters.url, "tooltips_enabled_site", request.parameters.value);
      break;
  }
}

/**
 * processes responses from other components
 * @param {JSON} request request from other components
 * @param {JSON} sender the one from whom the request came
 */
const resolve = (request, sender) => {
  if (request.dest != "service") return;

  if (request.from === "content-script") resolveContentScript(request, sender);
  if (request.from === "popup") resolvePopup(request);
}


/**
 * Listens to messages from popup.js and content-script.js and respond to them
 */
chrome.runtime.onMessage.addListener(
  async (request, sender) => { resolve(request, sender); }
);
