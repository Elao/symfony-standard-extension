function displayTools(enabledTools) {
    var container = document.querySelector('#enabledTools');
    container.innerHTML = '';
    for (var i in enabledTools) {
        var tool = document.createElement('li')
        tool.innerHTML = '<a href="'+ enabledTools[i].url + '">' + enabledTools[i].label + '</a>'
        container.appendChild(tool);
    }

    var removeValidation = document.getElementById('removeValidation');
    removeValidation.addEventListener('click', function (event) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {from: 'popup', subject: 'removeValidation'}, null);
        });
    });

    links = document.querySelectorAll('#enabledTools a');
    for (var i in links) {
        links[i].addEventListener('click', function (event) {
            chrome.tabs.create({url: this.href});

            return false;
        });
    }
}

window.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,{from: 'popup', subject: 'enabledTools'},displayTools);
    });
});
