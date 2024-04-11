chrome.runtime.onInstalled.addListener(function () {
	chrome.contextMenus.create({
		id: "CauldronContext",
		title: "Add to Cauldron",
		contexts: ["all"],
	});
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
	if (info.menuItemId === "CauldronContext") {

            
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

                let title = tabs[0].title;
                let content = info.srcUrl || info.selectionText || info.linkUrl || info.frameUrl || '';

                

                if (info.srcUrl) {
                    add_cargo(title, info.srcUrl, info.pageUrl);

                }

                else if (info.selectionText) {
                    add_cargo(title, info.pageUrl, content);

                }

                else if (info.linkUrl) {
                    add_cargo(title, info.linkUrl, info.pageUrl);

                }

                else if (info.frameUrl) {
                    add_cargo(title, info.frameUrl, info.pageUrl);

                } 

                else {
                    add_cargo(title, info.pageUrl, null);

                }

            });


	}
});

function add_cargo(title, link, content) {

	let currentDate = new Date();

	let day = String(currentDate.getDate()).padStart(2, "0");
	let month = String(currentDate.getMonth() + 1).padStart(2, "0");
	let year = currentDate.getFullYear();

	let date = day + "/" + month + "/" + year;

	let time = currentDate.toLocaleTimeString();

	let new_cargo = {
            ref: self.crypto.randomUUID(),
            title: title,
            link: link,
            more: content,
            date: date,
            time: time,
        };

	chrome.storage.sync.get("cargo", function (result) {
		let cargo = result.cargo || [];
		cargo.push(new_cargo);

		chrome.storage.sync.set({ cargo: cargo }, function () {

		});
	});
}
