document.addEventListener('DOMContentLoaded', function () {

    let title_in = document.getElementById('title');
    let link_in = document.getElementById('link');
    let more_in = document.getElementById('more');
    let save_btn = document.getElementById('save_button');
    let status_dump = document.getElementById('status');
    var currentDate = new Date();

    var day = String(currentDate.getDate()).padStart(2, '0');
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var year = currentDate.getFullYear();

    var date = day + '/' + month + '/' + year;
    
    var time = currentDate.toLocaleTimeString();

    save_btn.addEventListener('click', function () {
        let new_cargo = {
            'ref': self.crypto.randomUUID(),
            'title': title_in.value,
            'link': link_in.value,
            'more': more_in.value !== '' ? more_in.value : null,
            'date': date,
            'time': time
        };

        chrome.storage.sync.get('cargo', function (result) {
            let cargo = result.cargo || [];
            cargo.push(new_cargo);

            chrome.storage.sync.set({ 'cargo': cargo }, function () {
                status_dump.textContent = 'saved.';
                setTimeout(function () {
                    status_dump.textContent = '';
                }, 500);
            });
        });
    });

    chrome.storage.sync.get('cargo', function (result) {
        let cargo = result.cargo || [];
        if (cargo.length > 0) {
            let last_saved = cargo[cargo.length - 1];
            title_in.value = last_saved.title || '';
            link_in.value = last_saved.link || '';
        }
    });

    let viewSavedBtn = document.getElementById('view_cargo');

    viewSavedBtn.addEventListener('click', function () {
        chrome.tabs.create({ url: chrome.runtime.getURL('cargo-saved.html') });
    });
});


function set_input() {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let title_in = document.getElementById('title');
        let link_in = document.getElementById('link');

        let current_tab = tabs[0];
        let current_url = current_tab.url;
        let current_title = current_tab.title;

        title_in.value = current_title;
        link_in.value = current_url;
        console.log(current_url, current_title);
    });
    
}

document.addEventListener('DOMContentLoaded', set_input);
