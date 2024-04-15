
// This is the base function that displayes the cargo items in the cargo_dump HTML tag
function run(result) {
	let cargo_dump = document.getElementById("cargo_dump");
	let memory_dump = document.getElementById("memory_dump");
	let cargo = result.cargo || [];

	const cargo_size = get_cargo_size(cargo);
	memory_dump.innerHTML = cargo_size;

    // If given cargo size is larger than 0, create and append the HTML
	if (cargo.length > 0) {

		let cargo_list = "<ol>";

		cargo.forEach((item, index) => {

			cargo_list += `<li class="cargo-item">

                                <div>
                                    <a target="_blank" href="${item.link}">
                                        ${item.title}
                                    </a>${item.date + ", " + item.time}

                                    <article class="more-info">

                                        <p>
                    
                                            <copy>${item.more ?? ''}</copy>
                                            ${item.src ? 'source from <a href="'+ item.src +'" target="_blank">' + item.src + '</a>' :'No source found'}
                                            
                                            ${item.tags.map(tag => `<tag>${tag}</tag>`).join('')}
                                            

                                        </p>

                                        <div style="all:unset;gap: 6px;display: flex;">

                                            <button class="star_button ${item.tags.includes('star') ? 'starred' : ''}" data-index="${index}">
                                                <svg xmlns="http://www.w3.org/2000/svg" style="display:block;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>                                            
                                            </button>

                                            <button class="edit_entry" data-index="${index}">
                                                <svg xmlns="http://www.w3.org/2000/svg" style="display:block;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>                                
                                            </button>

                                            <button class="delete_entry" data-index="${index}">
                                                <svg xmlns="http://www.w3.org/2000/svg" style="display:block;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                            </button>

                                        </div>
                                    </article>

                                </div>

								

                                    <button class="more_entry">
                                        <svg xmlns="http://www.w3.org/2000/svg" style="display:block;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-2"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
                                    </button>
                           </li>`;

		});

		cargo_list += "</ol>";

		cargo_dump.innerHTML = cargo_list;

        

        // Adding an event listner for all more info icons
		document.querySelectorAll(".more_entry").forEach((icon) => {
			icon.addEventListener("click", (event) => {
                
				const more_info_icons = event.target.closest(".cargo-item").querySelector(".more-info");
				more_info_icons.classList.toggle("show");

                cargo_dump.querySelectorAll('.star_button').forEach(tagElement => {
                    tagElement.removeEventListener("click", star_listener);
                });

                cargo_dump.querySelectorAll('.star_button').forEach(tagElement => {
                    tagElement.addEventListener("click", star_listener);
                });

                // Remove all event lisntners for copy tags inside the cargo
                cargo_dump.querySelectorAll("copy").forEach(tagElement => {
                    tagElement.removeEventListener("dblclick", copy_listner);
                });

                // Add event lisntners for all visible copy tags inside the cargo
                cargo_dump.querySelectorAll("copy").forEach(tagElement => {
                    tagElement.addEventListener("dblclick", copy_listner);
                });
			});
		});

        // Adding event listners for all edit icons
        document.querySelectorAll(".edit_entry").forEach(function (button) {
            button.addEventListener("click", function (event) {
                let index = parseInt(event.target.dataset.index);
                edit_cargo(index, cargo);
            });
        });

		// Adding event listners to all delete buttons
		let deleteButtons = document.querySelectorAll(".delete_entry");
		deleteButtons.forEach(function (button) {
			button.addEventListener("click", function (event) {
                if (confirm("Are you sure you want to delete this entry?")) {
                    let index = parseInt(event.target.dataset.index);
                    cargo.splice(index, 1);
                    chrome.storage.local.set({ cargo: cargo });
                    location.reload();
                }
			});
		});

		// Creating and appending the delete all button
		const delete_all_btn = document.getElementById("delete_all");

		delete_all_btn.addEventListener("click", function () {
            if (confirm("Are you sure you want to delete all entries?")) {
                chrome.storage.local.remove("cargo", function () {
                    location.reload();
                });
            }
		});

	} else {

        // If cargo is not more than 0 give the "Nothing saved here..." text
		cargo_dump.innerHTML = `<p style="width:100%;text-align:center;color: var(--primary-color);font-size: medium;font-weight: 600;" >Nothing saved here...</p>`;

	}
}

function star_listener(event) {

    chrome.storage.local.get('cargo', function(result) {

        const cargo = result.cargo || [];
        const index = parseInt(event.target.dataset.index);
        const tagIndex = cargo[index].tags.indexOf('star');

        if (tagIndex === -1) {
            cargo[index].tags.push('star');
        } else {
            cargo[index].tags.splice(tagIndex, 1);
        }
        // Save cargo after modification
        chrome.storage.local.set({ cargo: cargo });
        // Rerun the function to update the cargo display
        run({ cargo: cargo });
    })

}

// Function to copy items with a double click
function copy_listner() {

    const textToCopy = this.innerText;
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert("Text copied to clipboard!!");
        })
        .catch(err => {
            console.error("Failed to copy to clipboard:", err);
        });
}

function get_cargo_size(cargo) {
    
    const cargo_string = JSON.stringify(cargo);
    const cargo_size_bytes = new Blob([cargo_string]).size;

    // Define size thresholds
    const KB = 1024;
    const MB = 1024 * KB;

    // Convert to appropriate unit
    let size, unit;
    if (cargo_size_bytes < KB) {
        size = cargo_size_bytes;
        unit = "bytes";
    } else if (cargo_size_bytes < MB) {
        size = (cargo_size_bytes / KB).toFixed(2);
        unit = "KB";
    } else {
        size = (cargo_size_bytes / MB).toFixed(2);
        unit = "MB";
    }

    // Return the size with relavant units with the harddisk icon
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hard-drive"><line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/></svg>
			${size} ${unit} used`;
}

// This function works when the edit button is clicked
function edit_cargo(index, cargo) {

    const cargo_item = cargo[index];

    const modal = document.getElementById("editModal");
    
    // Populate the input fields in the modal with cargoItem details
    const title_input = modal.querySelector("#titleInput");
    title_input.value = cargo_item.title;

    const link_input = modal.querySelector("#linkInput");
    link_input.value = cargo_item.link;

    const more_input = modal.querySelector("#moreInput");
    more_input.value = cargo_item.more;

    const tags_input = modal.querySelector("#tagsInput");
    tags_input.value = cargo_item.tags.join(", ")

    // Display the modal
    modal.style.display = "block";

    // Add event listner to the close button
    const close_btn = modal.querySelector(".close");
    close_btn.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Save changes when the save_changes button is clicked
    const save_btn = modal.querySelector("#save_changes");
    save_btn.addEventListener("click", function() {
        // Update cargoItem details with values from input fields
        cargo_item.title = title_input.value;
        cargo_item.link = link_input.value;
        cargo_item.more = more_input.value;
        cargo_item.tags = tags_input.value.split(",").map(tag => tag.trim()).filter(tag => tag !== "");

        // Update cargo array with the edited cargoItem
        cargo[index] = cargo_item;

        // Save updated cargo array to storage
        chrome.storage.local.set({ cargo: cargo });

        // Close the modal
        modal.style.display = "none";

        // Reload the page or update cargo display as needed
        // For example:
        run({ cargo: cargo }); // Assuming run function exists
    });
}

function search_cargo(query, cargo) {
    query = query.toLowerCase().trim();

    // If query is empty, return all cargo items
    if (query === "") return cargo; 

    return cargo.filter(item => {

        // Search in title, link, and more fields for the query
        const title_match = item.title.toLowerCase().includes(query);
        const link_match = item.link.toLowerCase().includes(query);
        const more_match = item.more !== null && item.more.toLowerCase().includes(query);
        const tag_match = item.tags.some(itemTag => itemTag.toLowerCase().includes(query));

        return title_match || link_match || more_match || tag_match;
    });
}

// This event listner is added to the search form to listen and run form submissions
document.getElementById("search_form").addEventListener("submit", function(event) {
    
    event.preventDefault();

    const query = document.getElementById("search_query").value;

    chrome.storage.local.get("cargo", function(result) {

        const filtered_cargo = search_cargo(query, result.cargo || []);
        run({ cargo: filtered_cargo });

    });

});

function search_cargo_tags(tag, cargo) {

    tag = tag.toLowerCase().trim();

    // If tag is empty, return all cargo items
    if (tag === "all") return cargo; 

    return cargo.filter(item => {

        // Search in title, link, and more fields for the tag
        const tag_match = item.tags.some(itemTag => itemTag.toLowerCase().includes(tag));
        return tag_match;

    });
}

document.querySelectorAll(".filter-button").forEach(function (button) {
    button.addEventListener("click", function (event) {
        

        chrome.storage.local.get("cargo", function(result) {

            let tag = event.target.getAttribute("tag");
        
            const filtered_cargo = search_cargo_tags(tag, result.cargo || []);
            run({ cargo: filtered_cargo });
    
        });
    });
});

// Adding an event lisnter to the refresh button
document.addEventListener("DOMContentLoaded", function () {

	chrome.storage.local.get("cargo", run);

	const refresh_btn = document.getElementById("refresh_now");

	refresh_btn.addEventListener("click", function () {
		chrome.storage.local.get("cargo", run);
	});

});

const export_btn = document.getElementById("export_cargo");

export_btn.addEventListener("click", function () {

    chrome.storage.local.get("cargo", function (data) {
        // Convert cargo data to JSON
        const json_data = JSON.stringify(data.cargo);

        // Create a blob with the JSON data
        const blob = new Blob([json_data], { type: "application/json" });

        // Create a temporary anchor element
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "data.json";

        // Trigger click event to start download
        a.click();

        // Clean up
        URL.revokeObjectURL(a.href);
    });

});

const import_btn = document.getElementById("import_cargo");
const file_input = document.getElementById("file_input");

import_btn.addEventListener("click", function () {
    file_input.click();
});

file_input.addEventListener("change", function () {
    const file = file_input.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {

        const imported_data = JSON.parse(event.target.result);

        chrome.storage.local.get("cargo", function (result) {

            let current_data = result.cargo || {};
            current_data = Object.values(current_data);

            const choice = prompt("Do you want to add or replace the current data? Type 'add' or 'replace'.");

            if (choice === "add") {

                if (!Array.isArray(current_data)) {
                    current_data = [];
                }

                const new_cargo_data = current_data.concat(Object.values(imported_data));
                chrome.storage.local.set({ "cargo": new_cargo_data }, function () {
                    alert("Cargo imported and added successfully!");
                });

            } else if (choice === "replace") {

                chrome.storage.local.set({ "cargo": Object.values(imported_data) }, function () {
                    alert("Cargo imported and replaced successfully!");
                });
            } else {
                alert("Invalid choice. Please type 'add' or 'replace'.");
            }
            
        });
    };
    reader.readAsText(file);
});

