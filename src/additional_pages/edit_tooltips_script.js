chrome.runtime.onMessage.addListener(async (message) => { 
    if (message.dest != "edit_tooltips") return;

    switch (message.from) {
        case "popup":
            SET_ID = message.setId;

            makeTitle(message.url, message.origin);
            queryToService("getTooltipSetById", { id: SET_ID });
            break;

        case "service":
            if (message.msg.respondTo === "getTooltipSetById") tooltipEditConstructor(message.msg.answer);
            if (message.msg.respondTo === "updateTooltipSet") respondToUser(message.msg.answer);
            break;
    }
});

const respondToUser = (status) => {
  hideLoadingGif();

  status ?
  warning(`Набор подсказок успешно изменён! Можете закрыть эту страницу`) :
  showInfo("err", "Не удалось изменить набор подсказок", "#ct-form");
}

const queryToService = async (query, parameters={}) => {
  chrome.runtime.sendMessage({
    dest: "service",
    from: "edit_tooltips",
    query: query,
    parameters: parameters
  });
}

const tooltipEditConstructor = (tour) => {
  submitButton();
  createLoadingGif();
  createNameInput(tour.name);
  createRoleSelector(tour.role);
  createOptionsSelector(tour.options);
  displayAlreadyExistingSteps(tour.steps);
}

const submitButton = () => {
  const submitBtn = document.createElement("input");
  submitBtn.type = "button";
  submitBtn.className = "submit-button";
  submitBtn.value = "Update";
  submitBtn.onclick = () => {
      clearAllInfoMessages();
      // TODO
      submitUpdatedToDb(SET_ID);
  } 
  
  document.querySelector("#ct-form").appendChild(submitBtn);
}

const createNameInput = (defaultValue) => {
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "name-input";
  nameInput.value = defaultValue;
  nameInput.className = "long-input";

  document.querySelector('#tour-name').appendChild(nameInput);
}

const createRoleSelector = (role) => {
  const roleSelection = document.querySelector('#role-selection');

  let roleRadioButton = document.createElement("input");
  roleRadioButton.type = "radio";
  roleRadioButton.checked = true;
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

const createOptionsSelector = (_options) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "modal-overlay-option"; // #modal-overlay-option
  checkbox.checked = _options.useModalOverlay;

  const label = document.createElement("label");
  label.htmlFor = checkbox.id;
  label.textContent = "use modal overlay";

  const p = document.createElement("p");
  p.appendChild(checkbox);
  p.appendChild(label);

  const options = document.querySelector('#options');
  options.appendChild(p);
}

const displayAlreadyExistingSteps = (steps) => {
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

  for (let step of steps.arr) {
    addAlreadyExistingStep(stepsSection, step.on, step.attachTo,
      step.nextBtn, step.prevBtn, step.title, step.text);
  }

  const _stepsSection = document.querySelector("#steps");
  _stepsSection.appendChild(stepsSection);
  _stepsSection.appendChild(addStepButton);
}

const addAlreadyExistingStep = (parent,
  onFieldValue, attachToFieldValue, nextBtnFieldVAlue,
  prevBtnFieldVAlue, titleFieldValue, textFieldValue) => 
{
  const step = document.createElement("div");
  step.className = "step";

  const deleteButton = document.createElement("div");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "❌";
  deleteButton.onclick = () => { step.remove(); }
  step.appendChild(deleteButton);

  onField(step, onFieldValue);
  attachToField(step, attachToFieldValue);
  nextBtnField(step, nextBtnFieldVAlue);
  prevBtnField(step, prevBtnFieldVAlue);
  titleField(step, titleFieldValue);
  textField(step, textFieldValue);

  parent.appendChild(step);
}


