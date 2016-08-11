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
    var disableJavascript = document.getElementById('disableJavascript');
    function updateButton(details)
    {
      disableJavascript.textContent = details.setting == 'allow' ? 'Disable Javascript' : 'Enable Javascript';
    }
    chrome.contentSettings.javascript.get({
        'primaryUrl': 'http://*.dev/*'
    }, updateButton );

    disableJavascript.addEventListener('click', function (event) {
        chrome.contentSettings.javascript.get({
            'primaryUrl': 'http://*.dev/*'
        }, function (details) {
          updateButton(details);
          var newSetting = details.setting == 'allow' ? 'block' : 'allow';
          chrome.contentSettings.javascript.set({
            'primaryPattern': 'http://*.dev/*',
            'setting': newSetting,
            'scope': 'regular'
          });
          chrome.notifications.create('javascript', {
              'type': "basic",
              'title': 'Javascript ' + newSetting + 'ed',
              'iconUrl': "logo_action.png",
              'message': "The javascript has been " + newSetting + "ed on the .dev pages"
          });
          // Reload the current tab for the change of javascript settings to apply
          chrome.tabs.reload();
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
