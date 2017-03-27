define([
    "js/core/core"
], function ($API) {
    $API.pluginLoader = new function () {
        var t = this;
        t.d = {
            plugins: [],
            loadedPluginsCount: 0,
            allPluginsCount:0,
            globalPluginsCount:0,
            loadedGlobalPluginsCount:0,
            completeFunctionReady:true,
            completeFunctions: [],
            pluginQueue:[]
        };

        t.addPlugin = function (plugin) {
            return this.addPlugins([plugin]);
        };

        t.plugins = t.addPlugins = function (plugins) {
            var t = this;
            if (typeof plugins !== 'undefined') {

                for (var i = 0; i < plugins.length; i++) {
                    var plugin = plugins[i];
                    plugin.skipCondition = plugin.skipCondition || false;
                    plugin.complete = plugin.complete || function () {};
                    plugin.css = plugin.css || [];
                    plugin.js = plugin.js || [];
                    plugin.name = plugin.name || ('automizy-plugin-' + ++AutomizyGlobalPluginsIndex);
                    plugin.requiredPlugins = plugin.requiredPlugins || [];
                    if (typeof plugin.js === 'string') {
                        plugin.js = [plugin.js];
                    }
                    if (typeof plugin.requiredPlugins === 'string') {
                        plugin.requiredPlugins = [plugin.requiredPlugins];
                    }
                    t.d.plugins.push(plugin);
                }

                return t;
            }
            return t.d.plugins;
        };

        t.pluginThen = function(plugin) {
            var t = this;

            t.d.loadedPluginsCount++;
            for(var i = 0; i < plugin.completeFunctions.length; i++){
                plugin.completeFunctions[i].apply(plugin, [true]);
                plugin.completed = true;
            }
            console.log('%c '+plugin.name + ' loaded (' + t.d.loadedPluginsCount + '/' + t.d.allPluginsCount + ') ', 'background: #000000; color: #ffffff; font-size:12px; border-radius:0 12px 12px 0');
            if (t.d.loadedPluginsCount === t.d.allPluginsCount && t.d.globalPluginsCount === t.d.loadedGlobalPluginsCount && t.d.completeFunctionReady) {
                t.d.completeFunctionReady = false;
                t.complete();
            }

            t.iteratePluginQueue();

            return t;
        };


        t.insertCss = function(cssFile){
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = cssFile;
            head.appendChild(link);
            return this;
        };
        t.parseCss = function(css){
            if (typeof css === 'string') {
                t.insertCss(css);
                return this;
            }
            for (var j = 0; j < css.length; j++) {
                t.parseCss(css[j]);
            }
            return this;
        };

        t.needToAddToPluginQueue = function(plugin){
            for(var i = 0; i < plugin.requiredPlugins.length; i++){
                if(!AutomizyGlobalPlugins[plugin.requiredPlugins[i]].completed){
                    return true;
                }
            }
            return false;
        };
        t.addToPluginQueue = function(plugin){
            var t = this;
            t.d.pluginQueue.push(plugin);
        };
        t.iteratePluginQueue = function(){
            var t = this;
            var canLoaded = false;

            for(var i = 0; i < t.d.pluginQueue.length; i++){
                canLoaded = true;
                for(var j = 0; j < t.d.pluginQueue[i].requiredPlugins.length; j++){
                    if(!AutomizyGlobalPlugins[t.d.pluginQueue[i].requiredPlugins[j]].completed){
                        canLoaded = false;
                        break;
                    }
                }
                if(canLoaded){
                    t.startToLoadJSs(t.d.pluginQueue[i]);
                    t.d.pluginQueue.splice(i, 1);
                }
            }
            return t;
        };
        t.startToLoadJSs = function(plugin){

            var t = this;
            var deferreds = [];

            console.log('%c '+plugin.name + ' started to load ', 'background: #000000; color: #ffffff; font-size:12px; border-radius:0 12px 12px 0');

            for (var j = 0; j < plugin.js.length; j++) {
                deferreds.push($.getScript(plugin.js[j]));
            }
            plugin.xhr = $.when.apply(null, deferreds).always(function(){
                t.pluginThen(plugin);
            });

        };


        t.parsePluginJSs = function (plugin) {
            var t = this;

            if(t.needToAddToPluginQueue(plugin)){
                t.addToPluginQueue(plugin);
                return this;
            }

            t.startToLoadJSs(plugin);

            return this;
        };


        t.run = function () {
            var t = this;

            var hasActivePlugin = false;
            var noJsPlugins = [];

            t.d.allPluginsCount = 0;
            t.d.loadedPluginsCount = 0;

            var toBeProcessedPlugins = [];

            for (var i = 0; i < t.d.plugins.length; i++) {
                var pluginLocal = t.d.plugins[i];
                if (pluginLocal.inited) {
                    continue;
                }
                pluginLocal.inited = true;

                if (typeof AutomizyGlobalPlugins[pluginLocal.name] === 'undefined') {
                    AutomizyGlobalPlugins[pluginLocal.name] = {
                        name: pluginLocal.name,
                        skipCondition: pluginLocal.skipCondition,
                        css: pluginLocal.css,
                        js: pluginLocal.js,
                        xhr: false,
                        requiredPlugins: pluginLocal.requiredPlugins || [],
                        completed: false,
                        completeFunctions: [pluginLocal.complete]
                    };
                    toBeProcessedPlugins.push(AutomizyGlobalPlugins[pluginLocal.name]);
                } else {
                    AutomizyGlobalPlugins[pluginLocal.name].completeFunctions.push(pluginLocal.complete);
                    if (AutomizyGlobalPlugins[pluginLocal.name].completed) {
                        pluginLocal.complete.apply(pluginLocal, [false]);
                    } else {
                        hasActivePlugin = true;
                        t.d.globalPluginsCount++;
                        AutomizyGlobalPlugins[pluginLocal.name].xhr.always(function () {
                            t.d.loadedGlobalPluginsCount++;
                            if (t.d.loadedPluginsCount === t.d.allPluginsCount && t.d.globalPluginsCount === t.d.loadedGlobalPluginsCount && t.d.completeFunctionReady) {
                                t.d.completeFunctionReady = false;
                                t.complete();
                            }
                        })
                    }
                }
            }

            for(var i = 0; i < toBeProcessedPlugins.length; i++){
                var plugin = AutomizyGlobalPlugins[toBeProcessedPlugins[i].name];

                if(typeof plugin.skipCondition === 'function'){
                    plugin.skipCondition = plugin.skipCondition.apply(this, []);
                }
                if (plugin.skipCondition) {
                    plugin.completed = true;
                    plugin.completeFunctions[0].apply(plugin, [false]);
                    continue;
                }

                t.parseCss(plugin.css);

                hasActivePlugin = true;
                (function (plugin) {
                    t.d.allPluginsCount++;
                    if (plugin.js.length <= 0) {
                        noJsPlugins.push(plugin);
                    } else {

                        t.parsePluginJSs(plugin);

                    }
                })(plugin);

            }

            for(var i = 0; i < noJsPlugins.length; i++){
                t.pluginThen(noJsPlugins[i]);
            }

            if (!hasActivePlugin) {
                t.complete();
            }

            return t;
        };

        t.complete = function (complete) {
            var t = this;

            if (typeof complete === 'function') {
                t.d.completeFunctionReady = true;
                t.d.completeFunctions.push({
                    inited: false,
                    func: complete
                });
                return t;
            }

            var arrLength = t.d.completeFunctions.length;
            for (var i = 0; i < arrLength; i++) {
                if (t.d.completeFunctions[i].inited) {
                    continue;
                }
                t.d.completeFunctions[i].inited = true;
                t.d.completeFunctions[i].func.apply(t, []);
            }

            return t;
        };

    };


});