const availableSites = [
  "https://github.com",
  "https://en.wikipedia.org"
]

const availableUrls = [
  "https://en.wikipedia.org/wiki/Main_Page",
  "https://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=Main+Page",
  "https://github.com/"
]

const tooltips = {
  "https://en.wikipedia.org/wiki/Main_Page": {
    options: {
      useModalOverlay: true,
      numOfSteps: 2,
      nextBtn: "Next",
      prevBtn: "Back",
      doneBtn: "Done"
    },
    steps: [
      {
        attachTo: "#searchform",
        title: "Поиск",
        text: "Напишите что-нибудь, может найдете что-нибудь... а может и нет",
        on: "bottom"
      },
      {
        attachTo: "#p-lang-btn",
        title: "Языки",
        text: `В википедии представлены статьи на 40+ языках
        <img src="https://translator-school.com/storage/blogs/February2022/01-kitajskij-yazyk-uchit-ili-ne-uchit.jpg" alt="">`,
        on: "left"
      },
    ]
  },
  "https://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=Main+Page": {
    options: {
      useModalOverlay: true,
      numOfSteps: 1,
      nextBtn: "Next",
      prevBtn: "Back",
      doneBtn: "Done"
    },
    steps: [
      {
        attachTo: ".mw-input.mw-htmlform-nolabel",
        title: "Log In",
        text: "Тут даже добавить нечего",
        on: "right"
      }
    ]
  },
  "https://github.com/": {
    options: {
      useModalOverlay: true,
      numOfSteps: 1,
      nextBtn: "Next",
      prevBtn: "Back",
      doneBtn: "Done"
    },
    steps: [
      {
        attachTo: ".search-input-container.search-with-dialog.position-relative.d-flex.flex-row.flex-items-center.mr-4.rounded",
        title: "Поиск на гитхабе",
        text: "Можно найти репозитории и пользователей",
        on: "bottom"
      }
    ]
  }
}

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
  if (on === "site") return availableSites.includes(url);
  if (on === "url") return availableUrls.includes(url);
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
      sendMessageToContentScript(sender.tab.id, {
        respondTo: request.query,
        answer: tooltips[sender.url]
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

