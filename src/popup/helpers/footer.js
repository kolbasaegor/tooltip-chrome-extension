/**
 * Creates footer for unauthorized user
 */
const footer_not_logged = () => {
    const loginButton = document.createElement("a");
    loginButton.href = "#";
    loginButton.textContent = "[login]";

    const registerButton = document.createElement("a");
    registerButton.href = "#";
    registerButton.textContent = "[register]";

    loginButton.onclick = () => {
        hideRegisterForm();
        showLoginForm();
    }

    registerButton.onclick = () => {
        hideLoginForm();
        showRegisterForm();
    }

    const footer = document.querySelector(".footer");
    footer.appendChild(loginButton);
    footer.appendChild(registerButton);
}

/**
 * Creates footer for authorized user
 */
const footer_logged = async () => {
    const footer = document.querySelector(".footer");

    const logoutButton = document.createElement("a");
    logoutButton.href = "#";
    logoutButton.textContent = "[logout]";
    logoutButton.onclick = () => {
        queryToService("logoutUser");
        location.reload();
    }
    footer.appendChild(logoutButton);

    const url = await getCurrentTabUrl();
    if (url.startsWith("https://") || url.startsWith("http://")) {
        addCreateTooltipsBtn(footer);
    }
}

/**
 * Creates button which opens the CreateTooltipsPage
 * @param {HTMLElement} footer 
 */
const addCreateTooltipsBtn = (footer) => {
    const createTooltipSetButton = document.createElement("a");
    createTooltipSetButton.href = "#";
    createTooltipSetButton.textContent = "[create tooltip set]";
    createTooltipSetButton.onclick = async () => {
        const status = await openCreateTooltipsPage();
        if (!status) showInfo("err", "Страница для создания подсказок уже открыта!");
    }
    footer.appendChild(createTooltipSetButton);
}