/**
 * sends message to content-script.js
 * @param {number} id content script tab id
 * @param {JSON | boolean} message message to content script
 */
export const sendMessageToContentScript = (id, message) => {
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
export const sendMessageToPopup = (message) => {
  chrome.runtime.sendMessage({
    dest: "popup",
    from: "service",
    msg: message
  });
}