// include css
const includeCss = (pathToCss) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL(pathToCss);
  document.head.appendChild(link);
}

// create Tour
const createTour = () => {
  return new Shepherd.Tour({
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

// add initial tooltip to the tour
const addInitialStep = (tour, websiteName) => {
  tour.addStep({
    title: `<strong>Welcome to ${websiteName}!</strong>`,
    text: `Tips are available on this site. 
          They will tell you about the site and teach you how 
          to use some of the site's elements. 
          Do you want to go through the tutorial?`,
    buttons: [
      {
        action() {
          return this.complete();
        },
        classes: 'shepherd-button-secondary',
        text: 'No'
      },
      {
        action() {
          return this.next();
        },
        text: 'Sure'
      }
    ],
  });
}

// return buttons
const getButtonsForStep = (step, length) => {
  if (step === length-1){
    return [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        action() {
          return this.complete();
        },
        text: 'Done'
      }
    ];
  } else if (step === 0) {
    return [
      {
        action() {
          return this.next();
        },
        text: 'Next'
      }
    ];
  } else {
    return [
      {
        action() {
          return this.back();
        },
        classes: 'shepherd-button-secondary',
        text: 'Back'
      },
      {
        action() {
          return this.next();
        },
        text: 'Next'
      }
    ];
  }
}

// add steps to the tour
const addSteps = (tour, data) => {
  addInitialStep(tour, data.name);

  for (let i = 0; i < data.numOfSteps; i++) {
    let step = data.steps[i];
    tour.addStep({
      title: step.title,
      text: step.text,
      attachTo: {
        element: step.attachTo,
        on: step.on
      },
      buttons: getButtonsForStep(i, data.numOfSteps)
    });
  }
}


const goTour = async (tour) => {
  const response = await chrome.runtime.sendMessage({msg: "get_tt"});
  
  if (response.status) {
    console.log('tooltips in enabled on this site');
    addSteps(tour, response.data);
    tour.start();
  }
}

//---------------- main ----------------
includeCss("css/shepherd.css");

const tour = createTour();
goTour(tour);
