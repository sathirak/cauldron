// When the contest menu opes on an image or a hyperlink, it calls this script to get the innerHTML or alt of the image to set as title

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    // If request is for a hyperlink, get the inner text of the link
    if (request.action === 'getInnerHTML') {

        const elements = document.querySelectorAll(request.selector);
        if (elements.length > 0) {

            const content_array = [];
            elements.forEach(element => {
                content_array.push(element.innerText);
            });

            sendResponse({ content: content_array });

        } else {

            sendResponse({ content: null });

        }
    }

    // If the request is for an image, get the alt name of the image
    if (request.action === 'getAlt') {

        const elements = document.querySelectorAll(request.selector);
        if (elements.length > 0) {

            const content_array = [];
            elements.forEach(element => {
                content_array.push(element.alt);
            });

            sendResponse({ content: alt });

        } else {

            sendResponse({ content: null });

        }
    }

});

