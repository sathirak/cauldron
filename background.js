chrome.runtime.onInstalled.addListener(function () {
	chrome.contextMenus.create({
		id: "CauldronContext",
		title: "Add to Cauldron",
		contexts: ["all"],
	});
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
	if (info.menuItemId === "CauldronContext") {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			let title = tabs[0].title;

			let content;

			if (info.srcUrl) {

				const url = new URL(info.srcUrl);
				const path = url.pathname;

				chrome.tabs.sendMessage(tabs[0].id, { action: "getAlt", selector: `img[src*="${path}"]` }, function (response) {
					const content = response.altArray !== undefined && response.altArray !== null ? response.altArray : title;
					console.log("cauldron ext > alt received", response);

					add_cargo(content, info.srcUrl, 'source from <a target="blank_" href="' + info.pageUrl + '" >' + info.pageUrl + "</a>");
				});

			} else if (info.selectionText) {

				add_cargo(title, info.pageUrl, info.selectionText);

			} else if (info.linkUrl) {

				const url = new URL(info.linkUrl);
				const path = url.pathname.substring(1);

				chrome.tabs.sendMessage(tabs[0].id, { action: "getInnerHTML", selector: `a[href*="${path}"]` }, function (response) {

					content = response.innerText[0];

					console.log("cauldron ext > innerHtml received", content);

					add_cargo(content, info.linkUrl, 'source from <a target="blank_" href="' + info.pageUrl + '" >' + info.pageUrl + "</a>");
				});
                
			} else if (info.frameUrl) {

				add_cargo(title, info.frameUrl, 'source from <a target="blank_" href="' + info.pageUrl + '" >' + info.pageUrl + "</a>");

			} else {

				add_cargo(title, info.pageUrl, null);

			}

		});
	}
});

function add_cargo(title, link, content) {

	chrome.notifications.create({
		type: 'basic',
		iconUrl: 'icon.png',
		title: "Cauldron",
		message: `✓✓ Saved as "${title}"`,
		silent: true
	});


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

	chrome.storage.local.get("cargo", function (result) {
		let cargo = result.cargo || [];
		cargo.push(new_cargo);

		chrome.storage.local.set({ cargo: cargo }, function () {});
	});
}
