const submitToDb = async (origin, url) => {
    const { status, role, options, steps } = validate();

    if (!status) return false;

    showLoadingGif();
    queryToService("addTooltipSet", {
        origin: origin,
        url: url,
        role: role.id,
        options: options.options,
        steps: { arr: steps.arr }
    });
}

const validate = () => {
    const role = grabRole();
    const options = grabOptions();
    const steps = grabSteps();

    if (!(role.status & options.status & steps.status)) return { status: false };

    return {
        status: true,
        role: role,
        options: options,
        steps: steps
    };
}

const grabSteps = () => {
    const steps = document.getElementsByClassName("step");

    if (steps.length === 0) {
        showInfo("err", "Вы не добавили ни одного шага (нужен как минимум один)", "#steps")
        return { status: false, arr: null };
    }

    var arr = []
    for (var step of steps) {
        arr.push({
            on: step.querySelector("#on-field").value,
            text: step.querySelector("#text-field").value,
            title: step.querySelector("#title-field").value,
            nextBtn: step.querySelector("#nextBtn-field").value,
            prevBtn: step.querySelector("#prevBtn-field").value,
            attachTo: step.querySelector("#attachTo-field").value 
        });
    }

    return { status: true, arr: arr };
}

const grabOptions = () => {
    const modalOverlayOption = document.querySelector("#modal-overlay-option");

    return {
        status: true,
        options: {
            useModalOverlay: modalOverlayOption.checked
        }
    };
}

const grabRole = () => {
    var radios = document.getElementsByName('role-option');
    var selectedOption = null;
    
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            selectedOption = radios[i].value;
            break;
        }
    }

    if (!selectedOption) showInfo("err", "Выберите роль", "#role-selection");
    
    return {
        status: selectedOption ? true : false,
        id: selectedOption
    };
}

const showInfo = (type, text, id) => {
    const infoMessage = document.createElement("p");
    infoMessage.className = `info-message ${type}`;
    infoMessage
    infoMessage.textContent = text;

    const target = document.querySelector(id);
    target.appendChild(infoMessage);
    target.scrollIntoView({ behavior: 'smooth' });
}

const clearAllInfoMessages = () => {
    const msgs = document.getElementsByClassName("info-message err");
    for (let i = 0; i < msgs.length; i++) {
        msgs[i].remove();
    }
}
