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
const footer_logged = async (roles) => {
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
        if (roles.includes("admin")) addCreateTooltipsBtn(footer);
    }
}

/**
 * Creates button which opens the CreateTooltipsPage
 * @param {HTMLElement} footer 
 */
const addCreateTooltipsBtn = async (footer) => {
    const adminMenu = await createAdminMenu();

    const openAdminMenuButton = document.createElement("a");
    openAdminMenuButton.href = "#";
    openAdminMenuButton.textContent = "[admin menu]";
    openAdminMenuButton.onclick = async () => {
        adminMenu.hidden = false;
    }
    footer.appendChild(openAdminMenuButton);
}