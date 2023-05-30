const hasTooltipsElement = document.querySelector("#has-tooltips");
const content = document.querySelector(".content");

chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const url = tabs[0].url;
    const response = await chrome.runtime.sendMessage({
        dest: "service",
        from: "popup",
        query: "anyTooltips?",
        arguments: {
            url: url
        }
    });
    
    hasTooltipsElement.textContent = response ?
    "✅ There are tooltips for this website" :
    "❌ There are no tooltips for this website";

    if (response) {
        const tutorialButton = document.createElement("button");
        tutorialButton.id = "tutorialButton";
        tutorialButton.textContent = "Go through tutorial";
        content.appendChild(tutorialButton);

        tutorialButton.addEventListener("click", (event) => {
            console.log("button clicked");
            console.log(tabs[0]);
            chrome.tabs.sendMessage(tabs[0].id, {
                dest: "content-script",
                from: "popup",
                query: "runTour"
            });
        });
    }
});
