// ==UserScript==
//
// Add some shortcuts to basic Elao tools (DB, Supervisor, ...)
//
// @name        Tools links
// @namespace   Elao
// @include     *.dev/*
// @version     1
// ==/UserScript==

(function(){
    function createLink(name, href) {
        var link = document.createElement('a');
        link.setAttribute('target','blank');
        link.setAttribute('href', href);
        link.innerHTML = name;

        return link;
    }

    function check(tool) {
        tool.url = baseUrl + ':' + tool.port;

        return new Promise(function(resolve, reject) {
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
                reject(Error("Erreur réseau"));
            };

            req.send();
        });
    }

    function createContainer()
    {
        var container = document.createElement('div');
        container.setAttribute('class', 'sf-toolbar-block sf-toolbar-status-normal sf-toolbar-block-right');

        var iconContainer = document.createElement('span');
        var icon = document.createElement('div');
        icon.setAttribute('class', 'sf-toolbar-icon');
        var iconSpan = document.createElement('span');
        iconSpan.setAttribute('class', 'sf-toolbar-value')
        iconSpan.innerHTML = 'Tools';

        icon.appendChild(iconSpan);
        iconContainer.appendChild(icon);
        container.appendChild(iconContainer);

        var infoContainer = document.createElement('div');
        infoContainer.setAttribute('class', 'sf-toolbar-info');

        container.appendChild(infoContainer);

        return container;
    }

    function createItem(tool)
    {
        var container = document.createElement('div');
        container.setAttribute('class', 'sf-toolbar-info-piece');

        var span = document.createElement('span');

        span.appendChild(createLink(tool.label, tool.url));

        container.appendChild(span);

        return container;
    }

    var container = createContainer();
    var itemContainer = container.querySelector('.sf-toolbar-info');

    var baseUrl = location.protocol + '//' + document.domain;

    var tools = [
        {label: 'MailHog', port: 8025},
        {label: 'Supervisor', port: 9001},
        {label: 'Mailcatcher', port: 1080},
        {label: 'Log.io', port: 28778},
        {label: 'OPCache', port: 2013},
        {label: 'PGAdmin', port: 1980},
        {label: 'MyAdmin', port: 1979},
    ];

    var enabledTools = localStorage.getItem('elao/tools')

    if (enabledTools) {
        enabledTools = JSON.parse(enabledTools);
    } else {
        enabledTools = [];
    }

    if (enabledTools.length) {
        for (var i in enabledTools) {
            itemContainer.appendChild(createItem(enabledTools[i]));
        }
    } else {
        for (var i in tools) {
            check(tools[i])
                .then(function (tool) {
                   enabledTools.push(tool);
                   localStorage.setItem('elao/tools', JSON.stringify(enabledTools));
                   itemContainer.appendChild(createItem(tool));
                })
                .catch (function (error) {
                    console.log(error);
                });
        }
    }

    setTimeout(function() {
        document.querySelector('.sf-toolbarreset').appendChild(container);
    }, 1000);
})();
