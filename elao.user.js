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
        "#userscript-tools-bar { position:fixed; top:0; right:0; background-color:rgba(0, 0, 0, .4); opacity: .2; border-radius : 0 0 0 4px;  transition: opacity 500ms; z-index:9999;}",
        "#userscript-tools-bar:hover { opacity: 1;}",
        "#userscript-tools-bar a { display:inline-block; padding:5px; color:white; line-height:20px; font-size:14px; }",
        "#userscript-tools-bar a:not(:last-child)::after { content : ' | ';}"
    ] );

    var baseUrl = location.protocol + '//' + document.domain;
    var bar     = document.createElement('div');

    bar.setAttribute('id', 'userscript-tools-bar');
    bar.appendChild(createLink('Supervisor',    baseUrl + ':9001'));
    bar.appendChild(createLink('Mailcatcher',   baseUrl + ':1080'));
    bar.appendChild(createLink('Log.io',        baseUrl + ':28778'));
    bar.appendChild(createLink('OPCache',       baseUrl + ':2013'));
    bar.appendChild(createLink('DB Admin',      baseUrl + ':1980'));

    document.body.appendChild(bar);

})();
