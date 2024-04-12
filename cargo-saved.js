function run(result) {
	let cargo_dump = document.getElementById("cargo_dump");
	let memory_dump = document.getElementById("memory_dump");
	let cargo = result.cargo || [];

	const cargoSize = getCargoSize(cargo);
	memory_dump.innerHTML = cargoSize;

	if (cargo.length > 0) {

		let cargo_list = "<ol>";

		cargo.forEach((item, index) => {

			cargo_list += `<li class="cargo-item">
                                <div>
                                    <a target="_blank" href="${item.link}">
                                        ${item.title}
                                    </a>${item.date + ", " + item.time}
                                    ${item.more !== null? `<svg xmlns="http://www.w3.org/2000/svg" class="more-info-icon" width="16" height="16" viewBox="0 0 24 24"  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paperclip"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`: ""}  
                                    <p class="more-info">
                                        ${item.more !== null ? item.more : ""}
                                    </p>
                                </div>
                                <button class="delete_entry" data-index="${index}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
                                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                                    </svg>
                                </button>
                           </li>`;

		});

		cargo_list += "</ol>";

		cargo_dump.innerHTML = cargo_list;

		document.querySelectorAll(".more-info-icon").forEach((icon) => {
			icon.addEventListener("click", (event) => {
				const moreInfo = event.target.closest(".cargo-item").querySelector(".more-info");
				moreInfo.classList.toggle("show");
			});
		});

		// Adding event listners to all delete buttons
		let deleteButtons = document.querySelectorAll(".delete_entry");
		deleteButtons.forEach(function (button) {
			button.addEventListener("click", function (event) {
				let index = parseInt(event.target.dataset.index);
				cargo.splice(index, 1);
				chrome.storage.local.set({ cargo: cargo });
				location.reload();
			});
		});

		// Creating and appending the delete all button
		const delete_all_btn = document.createElement("button");
		delete_all_btn.id = "delete_all";
		delete_all_btn.innerHTML =
			`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>  Delete All`;

		delete_all_btn.addEventListener("click", function () {
			chrome.storage.local.remove("cargo", function () {
				location.reload();
			});
		});

		cargo_dump.appendChild(delete_all_btn);

	} else {

		cargo_dump.innerHTML = `<p style="width:100%;text-align:center;color: var(--primary-color);font-size: medium;font-weight: 600;" >Nothing saved here...</p>`;

	}
}

document.addEventListener("DOMContentLoaded", function () {

	chrome.storage.local.get("cargo", run);

	const refresh_btn = document.getElementById("refresh_now");

	refresh_btn.addEventListener("click", function () {
		chrome.storage.local.get("cargo", run);
	});

});


function getCargoSize(cargo) {
    const cargoString = JSON.stringify(cargo);
    const cargoSizeInBytes = new Blob([cargoString]).size;

    // Define size thresholds
    const KB = 1024;
    const MB = 1024 * KB;

    // Convert to appropriate unit
    let size, unit;
    if (cargoSizeInBytes < KB) {
        size = cargoSizeInBytes;
        unit = "bytes";
    } else if (cargoSizeInBytes < MB) {
        size = (cargoSizeInBytes / KB).toFixed(2);
        unit = "KB";
    } else {
        size = (cargoSizeInBytes / MB).toFixed(2);
        unit = "MB";
    }

    return `${size} ${unit}`;
}
