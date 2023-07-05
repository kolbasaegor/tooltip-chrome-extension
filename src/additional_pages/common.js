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

const onField = (parent, defaultValue=null) => {
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

    if (defaultValue) selection.value = defaultValue;

    parent.appendChild(title);
    parent.appendChild(selection);
}

const attachToField = (parent, defaultValue=null) => {
    const attachToInput = document.createElement("input");
    attachToInput.type = "text";
    attachToInput.id = "attachTo-field";
    attachToInput.placeholder = "#id-of-element or .class.of.element";
    attachToInput.className = "long-input";
    if (defaultValue) attachToInput.value = defaultValue;

    const title = document.createElement("div");
    title.textContent = "attachTo -> ";

    parent.appendChild(title);
    parent.appendChild(attachToInput);
}

const nextBtnField = (parent, defaultValue=null) => {
    const nextBtnInput = document.createElement("input");
    nextBtnInput.type = "text";
    nextBtnInput.id = "nextBtn-field";
    nextBtnInput.className = "long-input";
    if (defaultValue) nextBtnInput.value = defaultValue;

    const title = document.createElement("div");
    title.textContent = "next button text -> ";

    parent.appendChild(title);
    parent.appendChild(nextBtnInput);
}

const prevBtnField = (parent, defaultValue=null) => {
    const prevBtnInput = document.createElement("input");
    prevBtnInput.type = "text";
    prevBtnInput.id = "prevBtn-field";
    prevBtnInput.className = "long-input";
    if (defaultValue) prevBtnInput.value = defaultValue;

    const title = document.createElement("div");
    title.textContent = "prev button text -> ";

    parent.appendChild(title);
    parent.appendChild(prevBtnInput);
}

const titleField = (parent, defaultValue=null) => {
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "title-field";
    titleInput.className = "long-input";
    if (defaultValue) titleInput.value = defaultValue;

    const title = document.createElement("div");
    title.textContent = "title -> ";

    parent.appendChild(title);
    parent.appendChild(titleInput);
}

const textField = (parent, defaultValue=null) => {
    const textArea = document.createElement("textarea");
    textArea.id = "text-field";
    textArea.placeholder = "Text of the tooltip"
    if (defaultValue) textArea.value = defaultValue;

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

const createLoadingGif = () => {
    const loadingGif = document.createElement("img");
    loadingGif.src = "../icons/loading.gif";
    loadingGif.className = "loading-gif";
    loadingGif.hidden = true;
    loadingGif.alt = "";

    document.querySelector("#ct-form").appendChild(loadingGif);
}

const showLoadingGif = () => { document.querySelector(".loading-gif").hidden = false; }

const hideLoadingGif = () => { document.querySelector(".loading-gif").hidden = true; }
