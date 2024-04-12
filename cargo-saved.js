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
                                    ${item.more !== null? `<svg xmlns="http://www.w3.org/2000/svg" style="display:block;" class="more-info-icon" width="16" height="16" viewBox="0 0 24 24"  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paperclip"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`: ""}  
                                    <p class="more-info">
                                        ${item.more !== null ? item.more : ""}
                                    </p>
                                </div>

								<div style="all:unset;display:flex;	">
									<button class="edit_entry" data-index="${index}">
										<svg xmlns="http://www.w3.org/2000/svg" style="display:block;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>                                </button>
									<button class="delete_entry" data-index="${index}">
										<svg xmlns="http://www.w3.org/2000/svg" style="display:block;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
											<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
										</svg>
									</button>
								</div>
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


		let editButtons = document.querySelectorAll(".edit_entry");
        editButtons.forEach(function (button) {
            button.addEventListener("click", function (event) {
                let index = parseInt(event.target.dataset.index);
                edit_cargo(index, cargo);
                console.log("Edit button clicked for item at index:", index);
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
		const delete_all_btn = document.getElementById("delete_all");

		delete_all_btn.addEventListener("click", function () {
			chrome.storage.local.remove("cargo", function () {
				location.reload();
			});
		});

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

    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hard-drive"><line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/></svg>
			${size} ${unit} used`;
}

function edit_cargo(index, cargo) {

    const cargoItem = cargo[index];

    const modal = document.getElementById("editModal");

	console.log(cargo);
	console.log(index);
	console.log(cargo[index]);
    
    // Populate the input fields in the modal with cargoItem details
    // For example:
    const titleInput = modal.querySelector("#titleInput");
    titleInput.value = cargoItem.title;

    const linkInput = modal.querySelector("#linkInput");
    linkInput.value = cargoItem.link;

    const moreInput = modal.querySelector("#moreInput");
    moreInput.value = cargoItem.more;

    // Display the modal
    modal.style.display = "block";

    // Assuming you have a close button in your modal with class "close"
    const closeButton = modal.querySelector(".close");
    closeButton.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Assuming you have a save button in your modal with id "save_changes"
    const saveButton = modal.querySelector("#save_changes");
    saveButton.addEventListener("click", function() {
        // Update cargoItem details with values from input fields
        cargoItem.title = titleInput.value;
        cargoItem.link = linkInput.value;
        cargoItem.more = moreInput.value;

        // Update cargo array with the edited cargoItem
        cargo[index] = cargoItem;

        // Save updated cargo array to storage
        chrome.storage.local.set({ cargo: cargo });

        // Close the modal
        modal.style.display = "none";

        // Reload the page or update cargo display as needed
        // For example:
        run({ cargo: cargo }); // Assuming run function exists
    });
}
