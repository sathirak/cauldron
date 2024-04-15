// This script handles the context menu options main process

// This is the Cargo class
class Cargo {

	constructor(title, link, more, date, time, src, tags) {
		this.ref = self.crypto.randomUUID();
		this.title = title;
		this.link = link;
		this.more = more !== '' ? more : null;
		this.date = date;
		this.time = time;
		this.src = src;
		this.tags = tags || [];
	}

}

chrome.runtime.onInstalled.addListener(function () {
	chrome.contextMenus.create({
		id: "CauldronContext",
		title: "Add to Cauldron",
		contexts: ["all"],
	});
});

//  Executes when the context menu is clicked
chrome.contextMenus.onClicked.addListener(function (info, tab) {
	if (info.menuItemId === "CauldronContext") {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			let title = tabs[0].title.trim();

			let content;

			// If context menu is on image
			if (info.srcUrl) {

				const url = new URL(info.srcUrl);
				const path = url.pathname;

				chrome.tabs.sendMessage(tabs[0].id, { action: "getAlt", selector: `img[src*="${path}"]` }, function (response) {

					try {

						if (response && response.content !== null) {
							content = response.content;
						} else {
							content = title;
						}

					} catch (error) {
						content = title;
					}

					add_cargo(content.trim(), info.srcUrl, null, info.pageUrl, ["image"]);
				});

			// If context menu is on selected text
			} else if (info.selectionText) {

				add_cargo(info.selectionText.substring(0, 35), info.pageUrl, info.selectionText.trim(), info.pageUrl, ["text", "code"]);

			// If context menu is on <a> link
			} else if (info.linkUrl) {

				const url = new URL(info.linkUrl);
				const path = url.pathname.substring(1);

				chrome.tabs.sendMessage(tabs[0].id, { action: "getInnerHTML", selector: `a[href*="${path}"]` }, function (response) {

					try {

						if (response && response.content !== null) {
							content = response.content[0];
						} else {
							content = title;
						}

					} catch (error) {
						content = title;
					}

					add_cargo(content.trim(), info.linkUrl, null, info.pageUrl, ["link"]);
				});
                
			// If context menu is on a <frame>
			} else if (info.frameUrl) {

				add_cargo(title, info.frameUrl, null, info.pageUrl, ["bookmark"]);

			// Catch all 
			} else {

				add_cargo(title, info.pageUrl, null, info.pageUrl, ["bookmark"]);

			}

		});
	}
});

function add_cargo(title, link, content, src, tags) {

	// Send a silent notificaton
	chrome.notifications.create({
		type: 'basic',
		iconUrl: 'images/icon.png',
		title: "Cauldron",
		message: `🪄 Saved as "${title}"`,
		silent: true
	});


	// Get time and date
	let current_date = new Date();
	let timezone_day = String(current_date.getDate()).padStart(2, "0");
	let timezone_month = String(current_date.getMonth() + 1).padStart(2, "0");
	let timezone_year = current_date.getFullYear();
	let timezone_date = timezone_day + "/" + timezone_month + "/" + timezone_year;
	let timezone_time = current_date.toLocaleTimeString();

	let new_cargo = new Cargo(title, link, content, timezone_date, timezone_time, src, tags);

	chrome.storage.local.get("cargo", function (result) {

		let cargo = result.cargo || [];
		cargo.push(new_cargo);

		chrome.storage.local.set({ cargo: cargo }, function () {});
	});

}
