/**
 * get current tab ulr
 * @returns current tab url
 */
const getCurrentTabUrl = async () => {
    const currentTab = await chrome.tabs.query({ active: true, currentWindow: true });
    return currentTab[0].url;
}

/**
 * get origin of the page
 * @returns current tab origin url
 */
const getOrigin = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return new URL(tabs[0].url).origin;
}

const getCurrentTabId = async () => {
  const currentTab = await chrome.tabs.query({ active: true, currentWindow: true });
  return currentTab[0].id;
}

/**
 * send a request to service-worker.js
 * @param {string} query 
 * @param {JSON} parameters 
 */
const queryToService = async (query, parameters={}) => {
  chrome.runtime.sendMessage({
    dest: "service",
    from: "popup",
    query: query,
    parameters: parameters
  });
}

/**
 * send a request to content-script.js
 * @param {string} query 
 * @param {JSON} parameters 
 */
const queryToContentScript = async (query, parameters={}) => {
  const id = await getCurrentTabId();

  chrome.tabs.sendMessage(id, {
    dest: "content-script",
    from: "popup",
    query: query,
    parameters: parameters
  });
}
