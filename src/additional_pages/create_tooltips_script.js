chrome.runtime.onMessage.addListener(async (message) => { 
    if (message.dest != "create_tooltips") return;

    switch (message.from) {
        case "popup":
            titleAndRoles(message);
            break;

        case "service":
            if (message.msg.respondTo === "getAvailableRoles") tooltipConstructor(message.msg.answer);
            if (message.msg.respondTo === "addTooltipSet") respondToUser(message.msg.answer);
            break;
    }
});

const respondToUser = (status) => {
    hideLoadingGif();

    status ?
    warning(`Набор подсказок успешно добавлен! Можете закрыть эту страницу`) :
    showInfo("err", "Не удалось добавить набор подсказок", "#ct-form");
}

const queryToService = async (query, parameters={}) => {
  chrome.runtime.sendMessage({
    dest: "service",
    from: "create_tooltips",
    query: query,
    parameters: parameters
  });
}

const titleAndRoles = async (parameters) => {
    _URL = parameters.url;
    ORIGIN = parameters.origin;

    makeTitle(_URL, ORIGIN);
    queryToService("getAvailableRoles", { url: _URL });
}

const createRoleSelector = (roles) => {
    const roleSelection = document.querySelector('#role-selection');

    for (let role of roles) {
        let roleRadioButton = document.createElement("input");
        roleRadioButton.type = "radio";
        roleRadioButton.name = "role-option"; // name = role-option
        roleRadioButton.value = role.id;
        roleRadioButton.id = `role_${role.id}`;

        let label = document.createElement("label");
        label.htmlFor = roleRadioButton.id;
        label.textContent = role.role;
        label.style.backgroundColor = role.color;

        let p = document.createElement("p");
        p.appendChild(roleRadioButton);
        p.appendChild(label);

        roleSelection.appendChild(p);
    }
}

const createOptionsSelector = () => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "modal-overlay-option"; // #modal-overlay-option

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = "use modal overlay";

    const p = document.createElement("p");
    p.appendChild(checkbox);
    p.appendChild(label);

    const options = document.querySelector('#options');
    options.appendChild(p);
}

const createNameInput = () => {
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "name-input";
    nameInput.placeholder = "untitled";
    nameInput.className = "long-input";

    document.querySelector('#tour-name').appendChild(nameInput);
}

const stepsConstructor = () => {
    const stepsSection = document.createElement("div");
    stepsSection.id = "step-section"; // #step-section
    const addStepButton = document.createElement("input");
    addStepButton.type = "button";
    addStepButton.value = "(+) Add step";
    addStepButton.className = "add-button";
    addStepButton.onclick = () => {
        addStep(stepsSection);
        addStepButton.scrollIntoView({ behavior: 'smooth' });
    }

    addStep(stepsSection);

    const _stepsSection = document.querySelector("#steps");
    _stepsSection.appendChild(stepsSection);
    _stepsSection.appendChild(addStepButton);
}

const submitButton = () => {
    const submitBtn = document.createElement("input");
    submitBtn.type = "button";
    submitBtn.className = "submit-button";
    submitBtn.value = "Submit";
    submitBtn.onclick = () => {
        clearAllInfoMessages();
        submitToDb(ORIGIN, _URL);
    } 
    
    document.querySelector("#ct-form").appendChild(submitBtn);
}

const tooltipConstructor = (roles) => {
    if (roles.length === 0) {
        warning("Для этого сайта нельзя сделать подсказку. Нет достпуных ролей");
        return;
    }

    submitButton();
    createLoadingGif();
    createNameInput();
    createRoleSelector(roles);
    createOptionsSelector();
    stepsConstructor();
}
