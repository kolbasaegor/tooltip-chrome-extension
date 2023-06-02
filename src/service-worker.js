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

const sendMessageToContentScript = (id, message) => {
  chrome.tabs.sendMessage(id, {
    dest: "content-script",
    from: "service",
    msg: message
  });
}

const sendMessageToPopup = (message) => {
  chrome.runtime.sendMessage({
    dest: "popup",
    from: "service",
    msg: message
  });
}

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

const setCookie = (url, name, value) => {
  chrome.cookies.set({
    url: url, 
    name: name, 
    value: value,
    expirationDate: (new Date().getTime() / 1000) + 60*60*24*30
  });
}

const isTooltipsExist = async (on, url) => {
  if (on === "site") return availableSites.includes(url);
  if (on === "url") return availableUrls.includes(url);
}

const isTooltipsEnabled = async (on, url) => {
  const cookieName = on === "site" ? "tooltips_enabled_site" : "tooltips_enabled_url";
  const cookie = await getCookie(url, cookieName);

  return cookie.value === "1" ? true : false;
}

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

