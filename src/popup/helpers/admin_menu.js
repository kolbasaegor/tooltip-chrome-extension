const createAdminMenu = async () => {
    const url = await getCurrentTabUrl();
    queryToService("getTooltipSetsMeta", { url: url });

    const adminMenu = document.createElement("div");
    adminMenu.className = "admin-menu";
    adminMenu.hidden = true;

    const closeButton = document.createElement("div");
    closeButton.className = "close-button";
    closeButton.textContent = "❌";
    closeButton.onclick = () => { adminMenu.hidden = true; }

    const title = document.createElement("p");
    title.textContent = "Created tours for this page:";
    title.style.textDecoration = "underline";

    const scrollableContainer = document.createElement("div");
    scrollableContainer.className = "scrollable-container";

    const button = document.createElement("input");
    button.type = "button";
    button.className = "wide-button";
    button.value = "Create new tour";
    button.onclick = () => {
        openCreateTooltipsPage();
    }

    
    adminMenu.appendChild(closeButton);
    adminMenu.appendChild(title);
    adminMenu.appendChild(scrollableContainer);
    adminMenu.appendChild(button);
    content.appendChild(adminMenu);

    return adminMenu;
}

const addLine = (set, container) => {
    let line = document.createElement("div");
    line.className = "container";

    let title = document.createElement("div");
    title.className = "set-name";
    title.textContent = set.name;

    let role = document.createElement("div");
    role.className = "role";
    role.style.backgroundColor = set.role.color;
    role.textContent = set.role.role;

    let removeButton = document.createElement("div");
    removeButton.textContent = "❌";
    removeButton.className = "remove-and-change-buttons";
    removeButton.onclick = () => {
        line.remove();
        queryToService("removeTooltipSet", { id: set.id });
    }

    let changeButton = document.createElement("div");
    changeButton.textContent = "✏️";
    changeButton.className = "remove-and-change-buttons";
    changeButton.onclick = () => {
        openEditTooltipSetPage(set.id);
    }

    let removeAndChangeButtons = document.createElement("div");
    removeAndChangeButtons.className = "remove-and-change-buttons-container";
    removeAndChangeButtons.appendChild(changeButton);
    removeAndChangeButtons.appendChild(removeButton);

    line.appendChild(title);
    line.appendChild(role);
    line.appendChild(removeAndChangeButtons);
    container.appendChild(line);
}

const displayTooltipsMeta = (data) => {
    const scrollableContainer = document.querySelector(".scrollable-container");

    for (let set of data) {
        addLine(set, scrollableContainer);
    }

    if (data.length === 0) {
        let infoText = document.createElement("p");
        infoText.textContent = "No tooltip sets have been created for this page yet";
        scrollableContainer.appendChild(infoText);
    }

    console.log(data);
}