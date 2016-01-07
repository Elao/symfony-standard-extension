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
    function addStyle( rules, media ) {
        el = document.createElement( 'style' );
        el.setAttribute( 'type', 'text/css' );
        for ( i=0; i<rules.length; i++ ) {
            el.innerHTML += rules[ i ] + "\n";
        }
        if ( typeof media != "undefined" ) {
            el.innerHTML = "@media " + media + " { \n" + el.innerHTML + "} \n";
        }
        document.head.appendChild( el );
    }

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

    addStyle( [
        "#userscript-tools-bar { position:fixed; top:-30px; right:0; background-color:rgba(0, 0, 0, .4); opacity: .2; border-radius : 0 0 0 4px;  transition: all 500ms; z-index:9999;}",
        "#userscript-tools-bar:hover { opacity: 1; top:0; }",
        "#userscript-tools-bar > div#userscript-tools-hook { text-align:center; line-height:20px; }",
        "#userscript-tools-bar > div > a { display:inline-block; padding:5px; color:white; line-height:20px; font-size:14px; }",
        "#userscript-tools-bar > div > a:not(:last-child)::after { content : ' | ';}"
    ] );

    var baseUrl = location.protocol + '//' + document.domain;
    var bar     = document.createElement('div');

    bar.setAttribute('id', 'userscript-tools-bar');

    var linkContainer = document.createElement('div');

    var tools = [
        {label: 'MailHog', port: 8025},
        {label: 'Supervisor', port: 9001},
        {label: 'Mailcatcher', port: 1080},
        {label: 'Log.io', port: 28778},
        {label: 'OPCache', port: 2013},
        {label: 'PGAdmin', port: 1980},
        {label: 'MyAdmin', port: 1979},
    ];

    for (var i in tools) {
        check(tools[i])
            .then(function (tool) {
               linkContainer.appendChild(createLink(tool.label, tool.url));
            })
            .catch (function (error) {
                console.log(error);
            });
    }

    var hookContainer = document.createElement('div');
    hookContainer.innerHTML = "=";
    hookContainer.setAttribute('id', 'userscript-tools-hook');

    bar.appendChild(linkContainer);
    bar.appendChild(hookContainer);

    document.body.appendChild(bar);

})();
