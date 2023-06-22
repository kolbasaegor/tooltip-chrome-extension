chrome.runtime.onMessage.addListener(async (message) => { 
    if (message.dest != "create_tooltips") return;

    switch (message.from) {
        case "popup":
            titleNroles(message);
            break;

        case "service":
            if (message.msg.respondTo === "getAvailableRoles") tooltipConstructor(message.msg.answer);

            if (message.msg.respondTo === "addTooltipSet") {
                const status = message.msg.answer;
                hideLoadingGif();

                if (!status) showInfo("err", "Не удалось добавить набор подсказок", "#ct-form");

                if (status) {
                    warning(`Набор подсказок успешно добавлен! 
                    Можете закрыть эту сраницу`);
                }
            }

            break;
    }
});

const queryToService = async (query, parameters={}) => {
  chrome.runtime.sendMessage({
    dest: "service",
    from: "create_tooltips",
    query: query,
    parameters: parameters
  });
}

const makeTitle = (url, origin) => {
    const title1 = document.querySelector("#for-url");
    const title2 = document.querySelector("#for-origin");
    
    const href1 = document.createElement("a");
    href1.href = url;
    href1.text = url;
    const href2 = document.createElement("a");
    href2.href = origin;
    href2.text = origin;

    title1.appendChild(href1);
    title2.appendChild(href2);
}

const titleNroles = async (parameters) => {
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

const warning = (text) => {
    const warning = document.createElement("div");
    warning.className = "overlay";
    const centeredText = document.createElement("div");
    centeredText.className = "centered-text";
    const warningText = document.createElement("h1");
    warningText.textContent = text;

    centeredText.appendChild(warningText);
    warning.appendChild(centeredText);
    document.body.prepend(warning);
}

const onField = (parent) => {
    const positions = ['top', 'top-start', 'top-end',
    'bottom', 'bottom-start', 'bottom-end', 'right',
    'right-start', 'right-end', 'left', 'left-start',
    'left-end'];

    const selection = document.createElement("select");
    selection.id = "on-field"; 
    for (let pos of positions) {
        let option = document.createElement("option");
        option.value = pos;
        option.text = pos;

        selection.appendChild(option);
    }

    const title = document.createElement("div");
    title.textContent = "position of tooltip -> ";

    parent.appendChild(title);
    parent.appendChild(selection);
}

const attachToField = (parent) => {
    const attachToInput = document.createElement("input");
    attachToInput.type = "text";
    attachToInput.id = "attachTo-field";
    attachToInput.placeholder = "#id-of-element or .class.of.element";
    attachToInput.className = "long-input";

    const title = document.createElement("div");
    title.textContent = "attachTo -> ";

    parent.appendChild(title);
    parent.appendChild(attachToInput);
}

const nextBtnField = (parent) => {
    const nextBtnInput = document.createElement("input");
    nextBtnInput.type = "text";
    nextBtnInput.id = "nextBtn-field";
    nextBtnInput.className = "long-input";

    const title = document.createElement("div");
    title.textContent = "next button text -> ";

    parent.appendChild(title);
    parent.appendChild(nextBtnInput);
}

const prevBtnField = (parent) => {
    const prevBtnInput = document.createElement("input");
    prevBtnInput.type = "text";
    prevBtnInput.id = "prevBtn-field";
    prevBtnInput.className = "long-input";

    const title = document.createElement("div");
    title.textContent = "prev button text -> ";

    parent.appendChild(title);
    parent.appendChild(prevBtnInput);
}

const titleField = (parent) => {
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "title-field";
    titleInput.className = "long-input";

    const title = document.createElement("div");
    title.textContent = "title -> ";

    parent.appendChild(title);
    parent.appendChild(titleInput);
}

const textField = (parent) => {
    const textArea = document.createElement("textarea");
    textArea.id = "text-field";
    textArea.placeholder = "Text of the tooltip"

    const title = document.createElement("div");
    title.textContent = "text ->";

    parent.appendChild(title);
    parent.appendChild(textArea);
}



const addStep = (parent) => {
    const step = document.createElement("div");
    step.className = "step";

    const deleteButton = document.createElement("div");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "❌";
    deleteButton.onclick = () => { step.remove(); }
    step.appendChild(deleteButton);

    onField(step);
    attachToField(step);
    nextBtnField(step);
    prevBtnField(step);
    titleField(step);
    textField(step);

    parent.appendChild(step);
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
    createRoleSelector(roles);
    createOptionsSelector();
    stepsConstructor();
}

const createLoadingGif = () => {
    const loadingGif = document.createElement("img");
    loadingGif.src = "../icons/loading.gif";
    loadingGif.className = "loading-gif";
    loadingGif.hidden = true;
    loadingGif.alt = "";

    document.querySelector("#ct-form").appendChild(loadingGif);
}

const showLoadingGif = () => {
    document.querySelector(".loading-gif").hidden = false;
}

const hideLoadingGif = () => {
    document.querySelector(".loading-gif").hidden = true;
}