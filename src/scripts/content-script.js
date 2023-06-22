const generateButtons = (tooltips) => {
  var buttons = [];

  for (let set of tooltips) {
    buttons.push({
      action() {
        TOUR_IS_RUNNGING = false;
        runMainTour(set.options, set.steps.arr);
        return this.complete();
      },
      classes: 'shepherd-button-secondary',
      text: `<div style="color: ${set.role.color};">${set.role.role}</div>`
    });
  }

  buttons.push({
    action() {
      TOUR_IS_RUNNGING = false;
      queryToService("disableTooltipsUrl");
      return this.complete();
    },
    classes: 'shepherd-button-secondary',
    text: "Disable"
  });

  return buttons;
}

const showWelcomeMessage = (tooltips) => {
  if (tooltips.length === 0) return;
  if (TOUR_IS_RUNNGING) return;

  const welcomeTour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: { enabled: true },
      classes: 'custom-class'
    }
  });

  welcomeTour.on('cancel', () => {
    TOUR_IS_RUNNGING = false;
  });

  welcomeTour.addStep({
    title: "This page contains tooltips",
    text: `Below are the buttons that correspond to your roles. 
    Each of them has different tooltips. If you want to disable 
    tooltips for this page, click the "disable" button. You can 
    always turn it back on or off in the extension window.`,
    buttons: generateButtons(tooltips)
  });

  TOUR_IS_RUNNGING = true;
  welcomeTour.start();
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
 * Adds steps to the tour
 * @param {Shepherd.Tour} tour Shepherd.Tour object 
 * @param {[JSON]} steps array of steps
 * @param {JSON} options tooltip information
 */
const addSteps = (tour, steps) => {
  for (let i = 0; i < steps.length; i++) {
    let step = steps[i];
    tour.addStep({
      title: step.title,
      text: step.text,
      attachTo: {
        element: step.attachTo,
        on: step.on
      },
      buttons: [
        {
          action() {
            return this.back();
          },
          classes: 'shepherd-button-secondary',
          text: step.prevBtn
        },
        {
          action() {
            return this.next();
          },
          text: step.nextBtn
        }
      ]
    });
  }
}


const runMainTour = async (options, steps) => {
  tour = createTour(options);
  tour.on('complete', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    TOUR_IS_RUNNGING = false;
  });
  tour.on('cancel', () => {
    TOUR_IS_RUNNGING = false;
  });
  addSteps(tour, steps);

  TOUR_IS_RUNNGING = true;
  tour.start();
}

/**
 * send a request to service-worker.js
 * @param {string} query 
 */
const queryToService = (query) => {
  chrome.runtime.sendMessage({
    dest: "service",
    from: "content-script",
    query: query
  });
}

/**
 * processes responses from service-worker.js
 * @param {JSON} response response from service-worker.js
 */
const resolveService = async (response) => {
  switch(response.msg.respondTo) {
    case "isTooltips?url":
      if (response.msg.answer) queryToService("isTooltipsEnabled?site");
      break;

    case "isTooltipsEnabled?site":
      if (response.msg.answer) queryToService("isTooltipsEnabled?url");
      break;

    case "isTooltipsEnabled?url":
      if (response.msg.answer) queryToService("getTooltipSets");
      break;

    case "getTooltipSets":
      TOOLTIPS = response.msg.answer;
      includeCss("css/shepherd.css");
      showWelcomeMessage(TOOLTIPS);
      break;
  }
}

const resolvePopup = async (request) => {
  switch(request.query) {
    case "showTooltips":
      if (TOOLTIPS) { showWelcomeMessage(TOOLTIPS); }
      else { queryToService("getTooltipSets"); }
      break;
  }
}

/**
 * processes responses from other components
 * @param {JSON} request request from other components
 */
const resolve = (request) => {
  if (request.dest != "content-script") return;

  if (request.from === "service") resolveService(request);
  if (request.from === "popup") resolvePopup(request);
}

/**
 * Listens to messages from service-worker.js and popup.js
 */
chrome.runtime.onMessage.addListener(async (request) => {
  resolve(request);
})

TOUR_IS_RUNNGING = false;
TOOLTIPS = null;
queryToService("isTooltips?url"); // <-- entry point is here


