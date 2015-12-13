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

    linkContainer.appendChild(createLink('Supervisor',    baseUrl + ':9001'));
    linkContainer.appendChild(createLink('Mailcatcher',   baseUrl + ':1080'));
    linkContainer.appendChild(createLink('Log.io',        baseUrl + ':28778'));
    linkContainer.appendChild(createLink('OPCache',       baseUrl + ':2013'));
    linkContainer.appendChild(createLink('PGAdmin',       baseUrl + ':1980'));

    var hookContainer = document.createElement('div');
    hookContainer.innerHTML = "=";
    hookContainer.setAttribute('id', 'userscript-tools-hook');

    bar.appendChild(linkContainer);
    bar.appendChild(hookContainer);

    document.body.appendChild(bar);

})();
