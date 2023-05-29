const availableUrls = [
    "https://en.wikipedia.org/wiki/Main_Page"
]

const checkUrl = (url) => {
    return url in availableUrls ? true : false;
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    // console.log(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension");
    // if (request.greeting === "hello")
    //   sendResponse({farewell: "goodbye"});
    sendResponse({hasTooltips: checkUrl(request.url)});
  }
);