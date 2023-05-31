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

/**
 * Listens to messages from popup.js and content-script.js and respond to them
 */
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.dest === "service") {
      if (request.query === "anyTooltips?")
        sendResponse(availableUrls.includes(request.arguments.url));

      if (request.query === "getTooltips") {
        sendResponse(tooltips[sender.tab.url]);
      }
    }
  }
);
