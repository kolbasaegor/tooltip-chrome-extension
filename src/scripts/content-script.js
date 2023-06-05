const initialMessage = {
  title: `<strong>Ну и дела...</strong>`,
  text: `
  На данной странице доступны подсказки, для продолжения 
  нажмите <strong>"Поехали!"</strong>. <br>
  Для отключения подсказок на этой странице нажмите на 
  <input type="checkbox" style="cursor: pointer" checked> 
  в оконке расширения или нажмите кнопку <strong>"Ни за что"</strong>. 
  Вы всегда можете вновь включить подсказки в расширении.
  `,
  yesBtn: "Поехали!",
  noBtn: "Ни за что"
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
          queryToService("disableTooltipsUrl");
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
 * Adds steps to the tour
 * @param {Shepherd.Tour} tour Shepherd.Tour object 
 * @param {[JSON]} steps array of steps
 * @param {JSON} options tooltip information
 */
const addSteps = (tour, steps) => {
  addInitialStep(tour);

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

/**
 * creates and runs tour on the page
 * @param {JSON} data options and steps of the tour
 */
const runTour = async (data) => {
  includeCss("css/shepherd.css");

  tour = createTour(data.options);
  tour.on('complete', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  addSteps(tour, data.steps);

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
      if (response.msg.answer) queryToService("getTooltips");
      break;

    case "getTooltips":
      runTour(response.msg.answer);
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
}

/**
 * Listens to messages from service-worker.js and popup.js
 */
chrome.runtime.onMessage.addListener(async (request) => {
  resolve(request);
})

queryToService("isTooltips?url"); // <-- entry point is here


