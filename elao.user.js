// ==UserScript==
//
// Add some shortcuts to basic Elao tools (DB, Supervisor, ...)
//
// @name        Tools links
// @namespace   Elao
// @include     *.dev/*
// @version     1
// ==/UserScript==

//(function(){

    /*var enabledTools = localStorage.getItem('elao/tools')

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
    }*/

    function Tool(label, port)
    {
        console.log('Tool', label, port);
        this.label = label;
        this.port  = port;
        this.url   = this.host + ':' + this.port;
    }

    /**
     * Host
     *
     * @type {String}
     */
    Tool.prototype.host = window.location.protocol + '//' + document.domain;

    /**
     * Get url
     *
     * @return {String}
     */
    Tool.prototype.getUrl = function()
    {
        return this.host + ':' + this.port;
    };

    /**
     * Get link element
     *
     * @return {Element}
     */
    Tool.prototype.getElement = function()
    {
        var link = document.createElement('a');

        link.target    = '_blank';
        link.href      = this.getUrl();
        link.innerHTML = this.label;

        return link;
    };

    Tool.prototype.check = function ()
    {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttprequestuest();
            request.open('GET', this.url);

            request.onload = function() {
                if (request.status == 200) {
                    resolve(this);
                } else {
                    reject(Error(request.statusText));
                }
            };

            request.onerror = function() {
                reject(Error("Erreur réseau"));
            };

            request.send();
        });
    }

    /**
     * Elao Standard Extension
     *
     * @param {Element} parent
     */
    function ElaoStandardExtention(parent)
    {
        console.log('ElaoStandardExtention', this);

        this.parent    = parent;
        this.container = this.createContainer();
        this.element   = this.createBlock();
        this.tools     = [];

        this.container.appendChild(this.element);
        this.parent.appendChild(this.container);

        for (var label in this.toolList) {
            if (this.toolList.hasOwnProperty(label)) {
                this.addTool(new Tool(label, this.toolList[label]));
            }
        }
    }

    /**
     * Tools
     *
     * @type {Array}
     */
    ElaoStandardExtention.prototype.toolList = {
        'MailHog': 8025,
        'Supervisor': 9001,
        'Mailcatcher': 1080,
        'Log.io': 28778,
        'OPCache': 2013,
        'PGAdmin': 1980,
        'MyAdmin': 1979
    };

    ElaoStandardExtention.prototype.createContainer = function()
    {
        var container = document.createElement('div');

        container.id = 'userscript-tools-bar';

        return container;
    };

    ElaoStandardExtention.prototype.createBlock = function()
    {
        return document.createElement('div');
    };

    ElaoStandardExtention.prototype.addTool = function(tool)
    {
        this.tools.push(tool);
        this.element.appendChild(tool.getElement());
    };

    /**
     * ElaoStandardExtention for Symfony
     *
     * @param {Element} parent
     */
    function ElaoSymfonyStandardExtention(parent)
    {
        ElaoStandardExtention.call(this, parent);
    }

    ElaoSymfonyStandardExtention.prototype = Object.create(ElaoStandardExtention.prototype);
    ElaoSymfonyStandardExtention.prototype.constructor = ElaoSymfonyStandardExtention;

    /**
     * Create container
     *
     * @return {Element}
     */
    ElaoSymfonyStandardExtention.prototype.createContainer = function()
    {
        var container = ElaoStandardExtention.prototype.createContainer.call(this),
            icon      = document.createElement('div');

        container.className = 'sf-toolbar-block sf-toolbar-status-normal sf-toolbar-block-right';
        icon.className      = 'sf-toolbar-icon';

        icon.innerHTML = 'Tools';

        return container;
    };

    ElaoSymfonyStandardExtention.prototype.createBlock = function()
    {
        var block = ElaoStandardExtention.prototype.createBlock.call(this);

        block.className = 'sf-toolbar-info';

        return block;
    };

    ElaoSymfonyStandardExtention.prototype.addTool = function(tool)
    {
        this.tools.push(tool);
        this.element.appendChild(tool.getElement());
    };

    function onLoad()
    {
        var elements = document.getElementsByClassName('sf-toolbar');

        if (elements.length) {
            new ElaoSymfonyStandardExtention(elements[0]);
        } else {
            new ElaoStandardExtention(document.body);
        }
    }

    window.addEventListener('load', onLoad);
    //onLoad();
//})();
