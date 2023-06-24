import { isTooltipsEnabled, isTooltipsExist, getTooltipSets, addTooltipSet } from "./service/tooltip_helper.js";
import { sendMessageToContentScript, sendMessageToPopup, sendMessageToCT } from "./service/messaging.js";
import { loginUser, logoutUser, registerUser, getUser } from "./service/auth.js";
import { setCookie } from "./service/cookie.js";
import { pullRoles, getAvailableRoles } from "./service/other.js";

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
      setCookie(sender.url, `tooltips_${sender.url}`, "0");
      break;

    case "getTooltipSets":
      const user = await getUser();
      const roles = await pullRoles(user.roles);
      const tooltips = await getTooltipSets(sender.url, roles);

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

    case "getTooltipsInfo":
      const isTooltipsSite = await isTooltipsExist("site", request.parameters.origin);
      const isTooltipsUrl = await isTooltipsExist("url", request.parameters.url);
      const isTooltipsEnabledSite = await isTooltipsEnabled("site", request.parameters.origin);
      const isTooltipsEnabledUrl = await isTooltipsEnabled("url", request.parameters.url);

      sendMessageToPopup({
        respondTo: request.query,
        answer: {
          isTooltipsSite: isTooltipsSite,
          isTooltipsUrl: isTooltipsUrl,
          isTooltipsEnabledSite: isTooltipsEnabledSite,
          isTooltipsEnabledUrl: isTooltipsEnabledUrl
        }
      });
      break;

    case "setCookieUrl":
      setCookie(request.parameters.url, `tooltips_${request.parameters.url}`, request.parameters.value);
      break;

    case "setCookieSite":
      setCookie(request.parameters.url, "tooltips_site", request.parameters.value);
      break;
  }
}

const resolveCT = async (request) => {
  switch(request.query) {
    case "getAvailableRoles":
      var answer = await getAvailableRoles(request.parameters.url);
      sendMessageToCT({
        respondTo: request.query,
        answer: answer
      })
      break;

    case "addTooltipSet":
      var answer = await addTooltipSet(request.parameters);
      sendMessageToCT({
        respondTo: request.query,
        answer: answer
      })
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
  if (request.from === "create_tooltips") resolveCT(request);
}

/**
 * Listens to messages from popup.js and content-script.js and respond to them
 */
chrome.runtime.onMessage.addListener(
  async (request, sender) => { resolve(request, sender); }
);

// chrome.storage.local.clear();