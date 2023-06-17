/**
 * creates an element that shows the presence of tooltips on the site, 
 * if there are any, it also creates a checkbox for them
 * @param {boolean} status are there any tooltips for this site
 */
const firstLine = async (status) => {
    const statusElem = document.createElement("div");
    statusElem.id = "site-has-tooltips";
    statusElem.className = "container entry";

    const statusTitle = document.createElement("p");
    statusTitle.textContent = status ?
    "Show tooltips on this site" :
    "No tooltips on this site";

    statusElem.appendChild(statusTitle);
    control.appendChild(statusElem);

    const origin = await getOrigin();
    if (status) queryToService("isTooltipsEnabled?site", {url: origin});
}

/**
 * creates a checkbox with which you can 
 * enable/disable tooltips on the site
 * @param {boolean} status are tooltips for this site enabled in cookies
 */
const firstLineCheckbox = async (status) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = status;

    const statusElem = document.querySelector("#site-has-tooltips");
    statusElem.appendChild(checkbox);

    const url = await getCurrentTabUrl();
    checkbox.addEventListener('change', async (event) => {
        const status = event.target.checked;
        const origin = await getOrigin();

        queryToService("setCookieSite", {
            url: origin,
            value: status ? "1" : "0"
        });

        location.reload();
    });

    if (status) queryToService("isTooltips?url", {url: url});
}

/**
 * creates an element that shows the presence of tooltips on the url, 
 * if there are any, it also creates a checkbox for them
 * @param {boolean} status are there any tooltips for this url
 */
const secondLine = async (status) => {
    const statusElem = document.createElement("div");
    statusElem.id = "url-has-tooltips";
    statusElem.className = "container entry";

    const statusTitle = document.createElement("p");
    statusTitle.textContent = status ?
    "Show tooltips on this page" :
    "No tooltips on this page";

    statusElem.appendChild(statusTitle);
    control.appendChild(statusElem);

    const url = await getCurrentTabUrl();
    if (status) queryToService("isTooltipsEnabled?url", {url: url});
}

/**
 * creates a checkbox with which you can 
 * enable/disable tooltips on the url
 * @param {boolean} status are tooltips for this url enabled in cookies
 */
const secondLineCheckbox = async (status) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = status;

    const statusElem = document.querySelector("#url-has-tooltips");
    statusElem.appendChild(checkbox);

    const showTooltipsBtn = getShowTooltipsButton();

    checkbox.addEventListener('change', async (event) => {
        const status = event.target.checked;
        showTooltipsBtn.hidden = !status;
        const url = await getCurrentTabUrl();

        queryToService("setCookieUrl", {
            url: url,
            value: status ? "1" : "0"
        });
    });

    if (status) showTooltipsBtn.hidden = false;
}

const getShowTooltipsButton = () => {
    const title = document.createElement("a");
    title.href = "#";
    title.textContent = "->SHOW<-";

    title.addEventListener('click', async () => {
        queryToContentScript("showTooltips");
    })

    const showTooltipsBtn = document.createElement("div");
    showTooltipsBtn.className = "entry";
    showTooltipsBtn.style.textAlign = "center";
    showTooltipsBtn.hidden = true;
    showTooltipsBtn.appendChild(title);

    control.appendChild(showTooltipsBtn);

    return showTooltipsBtn;
}
