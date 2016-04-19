var tools = [
    {label: 'MailHog', port: 8025},
    {label: 'Supervisor', port: 9001},
    {label: 'Mailcatcher', port: 1080},
    {label: 'Log.io', port: 28778},
    {label: 'OPCache', port: 2013},
    {label: 'PGAdmin', port: 1980},
    {label: 'MyAdmin', port: 1979},
    {label: 'ngrok', port: 4040},
];

chrome.runtime.sendMessage({
    from:    'content',
    subject: 'showPageAction'
});

var enabledTools = JSON.parse(localStorage.getItem('elao/tools'));
var baseUrl = location.protocol + '//' + document.domain;
if (!enabledTools) {
    enabledTools = [];
    for (var i in tools) {
        check(tools[i])
            .then(function (tool) {
                enabledTools.push(tool);
                localStorage.setItem('elao/tools', JSON.stringify(enabledTools));
            });
    }
}

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if ((msg.from === 'popup') && (msg.subject === 'enabledTools')) {
        response(enabledTools);
    } else if ((msg.from === 'popup') && (msg.subject === 'removeValidation')) {
        removeValidation();
    }
});

function removeValidation () {
    var forms = document.querySelectorAll('form');
    for (var i in forms) {
        forms.item(i).setAttribute('novalidate','novalidate');
    }
    alert('Validation disabled');
}

function check(tool) {
    return new Promise(function(resolve, reject) {
        tool.url = baseUrl + ':' + tool.port;
        var req = new XMLHttpRequest();
        req.open('GET', tool.url);

        req.onload = function() {
            if (req.status == 200) {
                resolve(tool);
            } else {
                reject(Error(req.statusText));
            }
        };

        req.onerror = function() {
            reject(Error("Network error"));
        };

        req.send();
    });
}
