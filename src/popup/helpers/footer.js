const footer_not_logged = () => {
    const loginButton = document.createElement("a");
    loginButton.href = "#";
    loginButton.textContent = "login";

    const registerButton = document.createElement("a");
    registerButton.href = "#";
    registerButton.textContent = "register";

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

const footer_logged = () => {
    const logoutButton = document.createElement("a");
    logoutButton.href = "#";
    logoutButton.textContent = "logout";

    logoutButton.onclick = () => {
        queryToService("logoutUser");
        location.reload();
    }

    const footer = document.querySelector(".footer");
    footer.appendChild(logoutButton);
}
