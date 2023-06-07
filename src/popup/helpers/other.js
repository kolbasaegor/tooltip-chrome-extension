const displayMessage = (type, text) => {
    const elem = document.querySelector(element);
    elem.textContent = text;
    elem.className = type;
    elem.hidden = false;
}

const createInfoMessage = () => {
    const infoMessage = document.createElement("p");
    infoMessage.id = "info-message";
    infoMessage.hidden = true;

    content.appendChild(infoMessage);
}

const showInfo = (type, text) => {
    const infoMessage = document.querySelector("#info-message");
    infoMessage.className = type;
    infoMessage.textContent = text;
    infoMessage.hidden = false;
}
