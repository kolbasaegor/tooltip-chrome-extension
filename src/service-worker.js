const availableUrls = [
    "https://en.wikipedia.org/wiki/Main_Page"
]

const tooltips = {
  "https://en.wikipedia.org/wiki/Main_Page": {
    "name": "wikipedia.org",
    "numOfSteps": 2,
    "steps": [
      {
          "attachTo": "#searchform",
          "title": "Hi",
          "text": "1",
          "on": "bottom"
      },
      {
        "attachTo": "#p-lang-btn",
        "title": "Hi",
        "text": "2",
        "on": "top"
      },
    ]
  }
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.greeting === "hello") 
      if (availableUrls.includes(sender.tab.url))
        sendResponse({"status": true, "data": tooltips[sender.tab.url]});
      else
        sendResponse({"status": false, "data": null});
  }
);