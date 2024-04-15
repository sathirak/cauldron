document.addEventListener('DOMContentLoaded', function () {

    // Initialise document elements
    let title_in = document.getElementById('title');
    let link_in = document.getElementById('link');
    let more_in = document.getElementById('more');
    let save_btn = document.getElementById('save_button');
    let status_dump = document.getElementById('status');
    let current_date = new Date();

    // Get the date and time
    let timezone_day = String(current_date.getDate()).padStart(2, '0');
    let timezone_month = String(current_date.getMonth() + 1).padStart(2, '0');
    let timezone_year = current_date.getFullYear();
    let timezone_date = timezone_day + '/' + timezone_month + '/' + timezone_year;
    let timezone_time = current_date.toLocaleTimeString();

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

    // Save button is clicked
    save_btn.addEventListener('click', function () {

        let title = title_in.value;
        let link = link_in.value;
        let more = more_in.value !== '' ? more_in.value : null;
        let tags = ["bookmark"];

        // New object is made and pushed into the localing storage
        let new_cargo = new Cargo(title, link, more, timezone_date, timezone_time, link, tags);

        chrome.storage.local.get('cargo', function (result) {
            let cargo = result.cargo || [];
            cargo.push(new_cargo);

            chrome.storage.local.set({ 'cargo': cargo }, function () {
                status_dump.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>  Saved';
                setTimeout(function () {
                    status_dump.innerHTML = '';
                }, 500);
            });
        });
    });

    // manage button to go to the manage page
    let manage_button = document.getElementById('view_cargo');

    manage_button.addEventListener('click', function () {
        chrome.tabs.create({ url: chrome.runtime.getURL('manage.html') });
    });

});


function set_input() {

    // Queries the tabs to find the active tab and sets the title and link 
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let title_in = document.getElementById('title');
        let link_in = document.getElementById('link');

        let current_tab = tabs[0];
        let current_url = current_tab.url;
        let current_title = current_tab.title;

        title_in.value = current_title;
        link_in.value = current_url;
    });
    
}

document.addEventListener('DOMContentLoaded', set_input);
