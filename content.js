chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getInnerHTML') {

        console.log("cauldron ext > content.js fired with ", request.selector);

        const elements = document.querySelectorAll(request.selector);
        if (elements.length > 0) {
            console.log("cauldron ext > content.js found element(s)");
            // Assuming you want to send back innerText of all matched elements
            const innerTextArray = [];
            elements.forEach(element => {
                innerTextArray.push(element.innerText);
            });
            sendResponse({ innerText: innerTextArray });
        } else {
            console.log("cauldron ext > content.js responded with no element found");
            sendResponse({ innerText: null });
        }
    }

    if (request.action === 'getAlt') {

        console.log("cauldron ext > content.js fired with ", request.selector);

        const elements = document.querySelectorAll(request.selector);
        if (elements.length > 0) {
            console.log("cauldron ext > content.js found element(s)");
            // Assuming you want to send back innerText of all matched elements
            const altArray = [];
            elements.forEach(element => {
                altArray.push(element.alt);
            });
            sendResponse({ altArray: altArray });
        } else {
            console.log("cauldron ext > content.js responded with no element found");
            sendResponse({ altArray: null });
        }
    }


});

console.log("cauldron ext > content.js loaded");
