import { isTooltipsEnabled, isTooltipsExist, getTooltips } from "./service/tooltip_helper.js";
import { sendMessageToContentScript, sendMessageToPopup } from "./service/messaging.js";
import { loginUser, logoutUser, registerUser, getUser } from "./service/auth.js";
import { setCookie } from "./service/cookie.js";

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
      const user = await getUser();
      const tooltips = await getTooltips(sender.url, user.status);

      sendMessageToContentScript(sender.tab.id, {
        respondTo: request.query,
        answer: tooltips
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
    case "registerUser":
      var answer = await registerUser(request.parameters.login, request.parameters.password);
      sendMessageToPopup({
        respondTo: request.query,
        answer: answer
      });
      break;

    case "getUser":
      var answer = await getUser();
      sendMessageToPopup({
        respondTo: request.query,
        answer: answer
      });
      break;

    case "loginUser":
      var answer = await loginUser(request.parameters.login, request.parameters.password);
      sendMessageToPopup({
        respondTo: request.query,
        answer: answer
      });
      break;

    case "logoutUser":
      logoutUser();
      break;

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
