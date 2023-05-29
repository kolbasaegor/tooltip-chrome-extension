const availableUrls = [
    "https://en.wikipedia.org/wiki/Main_Page",
    "https://github.com/"
]

const tooltips = {
  "https://en.wikipedia.org/wiki/Main_Page": {
    "name": "wikipedia.org",
    "numOfSteps": 2,
    "steps": [
      {
          "attachTo": "#searchform",
          "title": "Поиск",
          "text": "Напишите что-нибудь, может найдете что-нибудь... а может и нет",
          "on": "bottom"
      },
      {
        "attachTo": "#p-lang-btn",
        "title": "Языки",
        "text": `В википедии представлены статьи на 40+ языках
        <img src="https://translator-school.com/storage/blogs/February2022/01-kitajskij-yazyk-uchit-ili-ne-uchit.jpg" alt="">`,
        "on": "left"
      },
    ]
  },
  "https://github.com/": {
    "name": "GitHub",
    "numOfSteps": 3,
    "steps": [
      {
          "attachTo": ".btn.btn-sm.btn-primary",
          "title": `<strong>Сreate a new repository</strong>`,
          "text": `By clicking on this button you can create a 
          new repository in github. <br>
          Read more about how to create a repository on github: 
          <a href="https://docs.github.com/en/github-ae@latest/get-started/quickstart/create-a-rep" target=_blank>
          docs.github.com</a>`,
          "on": "right"
      },
      {
        "attachTo": ".octicon.octicon-bell",
        "title": "Сampanula",
        "text": `<img src="http://i.stack.imgur.com/SBv4T.gif" alt="">`,
        "on": "left"
      },
      {
        "attachTo": ".search-input",
        "title": `🙃`,
        "text": `<iframe width="100%" src="https://www.youtube.com/embed/-ug-wxnSuZ4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
        "on": "bottom"
      }
    ]
  }
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.msg === "get_tt") {
      console.log(sender.tab.url);
      if (availableUrls.includes(sender.tab.url))
        sendResponse({"status": true, "data": tooltips[sender.tab.url]});
      else
        sendResponse({"status": false, "data": null});
    }

    else if (request.msg === "is_tt") {
      sendResponse({"status": availableUrls.includes(sender.tab.url)})
    }
    
  }
);