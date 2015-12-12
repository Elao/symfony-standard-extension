// ==UserScript==
//
// Enter automatically when logged in arianespace dev site
//
// @name        Arianespace Kerberos
// @namespace   Elao
// @include     *.arianespace.dev/*/start
// @version     1
// ==/UserScript==

(function(){
    //The idea is : script is limited to pages ending with '/start',
    //so if I cut the last 5 chars, I've got base url of application
    //Purely empiric, maybe some projects won't follow this pattern...
    window.location.replace(location.href.slice(0, -5));
})();
