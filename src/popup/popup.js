/**
 * processes responses from service-worker.js
 * @param {JSON} response response from service-worker.js
 */
const resolveService = async (response) => {
  switch(response.msg.respondTo) {
    case "getTooltipSetsMeta":
        displayTooltipsMeta(response.msg.answer);
        break;

    case "registerUser":
        if (response.msg.answer.status) {
            hideRegisterForm();
            showLoginForm();
            showInfo("suc", "You have successfully registered, now you can login");
        } else {
            showRegisterForm();
            showInfo("err", response.msg.answer.error);
        }
        break;

    case "loginUser":
        if (response.msg.answer) {
            location.reload();
        } else {
            showLoginForm();
            showInfo("err", "Incorrect login or password");
        }
        break;

    case "getUser":
        showUserAndStatus(
            response.msg.answer.isLoggedIn,
            response.msg.answer.roles,
            response.msg.answer.login
        );

        response.msg.answer.isLoggedIn ?
        footer_logged(pullRoles(response.msg.answer.roles)) :
        footer_not_logged();
        break;

    case "getTooltipsInfo":
        if (TOOLTIPS_INFO_RECEIVED) break;

        TOOLTIPS_INFO_RECEIVED = true;
        hideLoadingGif();
        tooltipsInfoInterface(response.msg.answer);
        break;
  }
}

/**
 * processes responses from other components
 * @param {JSON} request request from other components
 */
const resolve = (request) => {
  if (request.dest != "popup") return;

  if (request.from === "service") resolveService(request);
}

/**
 * Listens to messages from service-worker.js and content-script.js
 */
chrome.runtime.onMessage.addListener(async (request) => {
  resolve(request);
})

/**
 * entry point
 */
const main = async () => {
    const origin = await getOrigin();
    const url = await getCurrentTabUrl();
    TOOLTIPS_INFO_RECEIVED = false;
    
    createLoadingGif();
    showLoadingGif();

    queryToService("getTooltipsInfo", { origin: origin, url: url });
    queryToService("getUser");

    createLoginForm();
    createRegisterForm();
    createInfoMessage();
}

const content = document.querySelector(".content");
const control = document.createElement("div");
content.appendChild(control);
main(); // <-- entry point is here
