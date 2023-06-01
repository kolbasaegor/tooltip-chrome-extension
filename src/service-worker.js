const availableUrls = [
    "https://en.wikipedia.org/wiki/Main_Page"
]

const tooltips = {
  "https://en.wikipedia.org/wiki/Main_Page": {
    options: {
      useModalOverlay: true,
      initialTitle: `Welcome to wikipedia.org!`,
      initialText: `jsgyvruyhegruvgh eiyrvg ukfygv eygv jebfv jdfvjbdfh vsdfhjvg`,
      numOfSteps: 2,
      noBtn: "No",
      yesBtn: "Yes",
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
  const cookie = await chrome.cookies.get({url: url, name: name});

  var answer = false;
  if(!cookie) {
    chrome.cookies.set({url: url, name: name, value: "1"});
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
        chrome.cookies.set({url: request.url, name: "tooltipsEnabled", value: request.newValue});
      }

      if (request.query === "isTooltipsEnabled?") {
        if (request.from === "content-script") {
          const isTt = await isTooltipsEnabled(sender.origin, "tooltipsEnabled");

          sendMessageToTab(sender.tab.id, "content-script", {
            responseTo: request.query,
            answer: isTt
          });
        } else if (request.from === "popup"){
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

