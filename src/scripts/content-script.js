const initialMessage = {
  title: `<strong>Ну и дела...</strong>`,
  text: `
  На данной странице доступны подсказки, для продолжения 
  нажмите <strong>"Поехали!"</strong>, <br>
  для отключения подсказок на этом сайте нажмите на 
  <input type="checkbox" style="cursor: pointer" checked> 
  в оконке расширения или нажмите кнопку <strong>"Ни за что"</strong>. 
  Вы всегда можете вновь включить подсказки в расширении.
  `,
  yesBtn: "Поехали!",
  noBtn: "Ни за что"
}

const disableTooltips = () => {
  chrome.runtime.sendMessage({
    dest: "service",
    from: "content-script",
    query: "setCookie",
    newValue: "0"
  });

  console.log("tooltips is disabled");
}

/**
 * Inserts styles into the page where tooltips will be shown
 * @param {string} pathToCss local path to css file
 */
const includeCss = (pathToCss) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL(pathToCss);
  document.head.appendChild(link);
}

/**
 * Creates and returns a tour
 * @param {JSON} options tooltip information
 * @returns Shepherd.Tour object
 */
const createTour = (options) => {
  return new Shepherd.Tour({
    useModalOverlay: options.useModalOverlay,
    defaultStepOptions: {
      cancelIcon: {
        enabled: true
      },
      scrollTo: { behavior: 'smooth', block: 'center' },
      when: {
        show() {
          const currentStepElement = tour.currentStep.el;
          const header = currentStepElement.querySelector('.shepherd-header');
          const progress = document.createElement('span');
          progress.style['margin-right'] = '15px';
          progress.innerText = `${tour.steps.indexOf(tour.currentStep) + 1}/${tour.steps.length}`;
          header.insertBefore(progress, currentStepElement.querySelector('.shepherd-cancel-icon'));
        }
      }
    }
  });
}

/**
 * Adds first step to the tour
 * @param {Shepherd.Tour} tour Shepherd.Tour object
 * @param {JSON} options tooltip information
 */
const addInitialStep = (tour) => {
  tour.addStep({
    title: initialMessage.title,
    text: initialMessage.text,
    buttons: [
      {
        action() {
          disableTooltips();
          return this.complete();
        },
        classes: 'shepherd-button-secondary',
        text: initialMessage.noBtn
      },
      {
        action() {
          return this.next();
        },
        text: initialMessage.yesBtn
      }
    ],
  });
}

/**
 * Returns buttons according to step number
 * @param {number} step step number
 * @param {JSON} options tooltip information
 * @returns array of buttons | example ->
 * [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: options.prevBtn
      },
      {
        action() {
          return this.complete();
        },
        text: options.doneBtn
      }
    ]
 */
const getButtonsForStep = (stepNum, options) => {
  if (stepNum === options.numOfSteps - 1) {
    return [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: options.prevBtn
      },
      {
        action() {
          return this.complete();
        },
        text: options.doneBtn
      }
    ];
  } else if (stepNum === 0) {
    return [
      {
        action() {
          return this.next();
        },
        text: options.nextBtn
      }
    ];
  } else {
    return [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: options.prevBtn
      },
      {
        action() {
          return this.next();
        },
        text: options.nextBtn
      }
    ];
  }
}

/**
 * Adds steps to the tour
 * @param {Shepherd.Tour} tour Shepherd.Tour object 
 * @param {[JSON]} steps array of steps
 * @param {JSON} options tooltip information
 */
const addSteps = (tour, steps, options) => {
  addInitialStep(tour);

  for (let i = 0; i < options.numOfSteps; i++) {
    let step = steps[i];
    tour.addStep({
      title: step.title,
      text: step.text,
      attachTo: {
        element: step.attachTo,
        on: step.on
      },
      buttons: getButtonsForStep(i, options)
    });
  }
}

const anyTooltips = async () => {
  const response = await chrome.runtime.sendMessage({
    dest: "service",
    from: "content-script",
    query: "anyTooltips?"
  });

  console.log("anyTooltips? -> ", response);
  return response;
}

const isTooltipsEnabledForThisSite = async () => {
  chrome.runtime.sendMessage({
    dest: "service",
    from: "content-script",
    query: "isTooltipsEnabled?"
  })
}

const runTour = async () => {
  includeCss("css/shepherd.css");

  const response = await chrome.runtime.sendMessage({
    dest: "service",
    from: "content-script",
    query: "getTooltips"
  });

  tour = createTour(response.options);
  tour.on('complete', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  addSteps(tour, response.steps, response.options);

  tour.start();
}

//-----------------------------------------------------------------------------------------------------------------------------
chrome.runtime.onMessage.addListener(async (request) => {
  if (request.dest === "content-script") {
    if (request.msg.responseTo === "isTooltipsEnabled?") {
      if (request.msg.answer) runTour();
    }
  }
})

const main = async () => {
  const isTt = await anyTooltips();

  if (isTt) isTooltipsEnabledForThisSite();
}

main();


