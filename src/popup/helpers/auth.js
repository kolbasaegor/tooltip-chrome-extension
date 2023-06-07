const createLoginForm = async () => {
    const loginForm = document.createElement("form");
    loginForm.id = "login-form";
    loginForm.className = "entry";
    loginForm.hidden = true;
    loginForm.onsubmit = async () => {
        queryToService("loginUser", {
            login: loginField.value,
            password: passwordField.value
        });
    }

    const title = document.createElement("p");
    title.textContent = "Log In form";

    const loginField = document.createElement("input");
    loginField.type = "text";
    loginField.required = true;
    loginField.placeholder = "login";

    const passwordField = document.createElement("input");
    passwordField.type = "password";
    passwordField.required = true;
    passwordField.placeholder = "password";

    const submitButton = document.createElement("input");
    submitButton.className = "submit-button";
    submitButton.type = "submit";
    submitButton.value = "login";

    const empty = document.createElement("div");

    loginForm.appendChild(title);
    loginForm.appendChild(loginField);
    loginForm.appendChild(passwordField);
    loginForm.appendChild(empty);
    loginForm.appendChild(submitButton);

    content.appendChild(loginForm);
}

const createRegisterForm = async () => {
    const registerForm = document.createElement("form");
    registerForm.id = "register-form";
    registerForm.className = "entry";
    registerForm.hidden = true;
    registerForm.onsubmit = async () => {
        queryToService("registerUser", {
            login: loginField.value,
            password: passwordField.value
        });
    }

    const title = document.createElement("p");
    title.textContent = "Register form";

    const loginField = document.createElement("input");
    loginField.type = "text";
    loginField.required = true;
    loginField.placeholder = "login";

    const passwordField = document.createElement("input");
    passwordField.type = "password";
    passwordField.required = true;
    passwordField.placeholder = "password";

    const submitButton = document.createElement("input");
    submitButton.className = "submit-button";
    submitButton.type = "submit";
    submitButton.value = "register";

    const empty = document.createElement("div");

    registerForm.appendChild(title);
    registerForm.appendChild(loginField);
    registerForm.appendChild(passwordField);
    registerForm.appendChild(empty);
    registerForm.appendChild(submitButton);

    content.appendChild(registerForm);
}

const showUserAndStatus = (isLoggedIn, _status, login) => {
    const header = document.querySelector(".header");

    const container = document.createElement("div");
    container.className = "container";

    const username = document.createElement("p");
    username.className = "username";
    username.textContent = isLoggedIn ? login : "unauthorized";

    const status = document.createElement("p");
    status.className = "status";
    status.textContent = _status;

    container.appendChild(username);
    container.appendChild(status);
    header.appendChild(container);
}

const showRegisterForm = () => {
    const registerFrom = document.querySelector("#register-form");
    registerFrom.hidden = false;
}

const hideRegisterForm = () => {
    const registerFrom = document.querySelector("#register-form");
    registerFrom.hidden = true;
}

const showLoginForm = () => {
    const loginFrom = document.querySelector("#login-form");
    loginFrom.hidden = false;
}

const hideLoginForm = () => {
    const loginFrom = document.querySelector("#login-form");
    loginFrom.hidden = true;
}
