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

const sendMessageToTab = (id, dest, message) => {
  chrome.tabs.sendMessage(id, {
    dest: dest,
    from: "service",
    msg: message
  });
}

const isTooltipsEnabled = async (url, name) => {
  const cookie = await chrome.cookies.get({ url: url, name: name });

  var answer = false;
  if (!cookie) {
    chrome.cookies.set({ url: url, name: name, value: "1" });
    answer = true;
  } else {
    answer = cookie.value === "1" ? true : false;
  }

  return answer;
}


/**
 * Listens to messages from popup.js and content-script.js and respond to them
 */
chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse) => {
    if (request.dest === "service") {
      if (request.query === "setCookie") {
        if (request.from === "popup") {
          chrome.cookies.set({ url: request.url, name: "tooltipsEnabled", value: request.newValue });
        } else if (request.from === "content-script") {
          chrome.cookies.set({ url: sender.origin, name: "tooltipsEnabled", value: request.newValue });
        }
      }

      if (request.query === "isTooltipsEnabled?") {
        if (request.from === "content-script") {
          const isTt = await isTooltipsEnabled(sender.origin, "tooltipsEnabled");

          sendMessageToTab(sender.tab.id, "content-script", {
            responseTo: request.query,
            answer: isTt
          });
        } else if (request.from === "popup") {
          const isTt = await isTooltipsEnabled(request.url, "tooltipsEnabled");

          console.log("popup -> ", isTt);

          chrome.runtime.sendMessage({
            dest: "popup",
            from: "service",
            msg: {
              responseTo: request.query,
              answer: isTt
            }
          });
        }
      }

      if (request.query === "anyTooltips?") {
        if (request.from === "content-script") {
          sendResponse(availableUrls.includes(sender.url));
        } else if (request.from === "popup") {
          sendResponse(availableUrls.includes(request.url));
        }
      }

      if (request.query === "getTooltips") {
        sendResponse(tooltips[sender.url]);
      }
    }
  }
);

