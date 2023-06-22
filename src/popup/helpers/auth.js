/**
 * Creates Login form
 */
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

/**
 * Creates Register form
 */
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

/**
 * Shows user's login and user's roles
 */
const showUserAndStatus = (isLoggedIn, roles, login) => {
    const header = document.querySelector(".header");

    const username = document.createElement("p");
    username.className = "username";
    username.textContent = isLoggedIn ? login : "unauthorized";
    header.appendChild(username);

    for (let role of roles) {
        let roleElem = document.createElement("div");
        roleElem.className = "role";
        roleElem.style.backgroundColor = role.color;
        roleElem.textContent = role.role;

        header.appendChild(roleElem);
    }
}

const showRegisterForm = () => { document.querySelector("#register-form").hidden = false; }

const hideRegisterForm = () => { document.querySelector("#register-form").hidden = true; }

const showLoginForm = () => { document.querySelector("#login-form").hidden = false; }

const hideLoginForm = () => { document.querySelector("#login-form").hidden = true; }
