window.AutomizyGlobalPlugins = window.AutomizyGlobalPlugins || {};
window.AutomizyGlobalPluginsIndex = window.AutomizyGlobalPluginsIndex || 0;
window.AutomizyGlobalZIndex = window.AutomizyGlobalZIndex || 2000;
window.AutomizyProject = function(obj){
	
    
    var $API = this;

    $API.version = obj.version || '0.1.1';
    $API.name = obj.name || false;
    $API.elements = obj.elements || {};
    $API.dialogs = obj.dialogs || {};
    $API.inputs = obj.inputs || {};
    $API.buttons = obj.buttons || {};
    $API.forms = obj.forms || {};
    $API.functions = obj.functions || {};
    $API.events = obj.events || {};
    $API.modules = obj.modules || {};
    $API.xhr = obj.xhr || {};
    $API.permissions = obj.permissions || {};
    $API.permissionGroups = obj.permissionGroups || {};
    $API.config = obj.config || {
        dir:'.',
        url:'https://app.automizy.com'
    };
    $API.m = obj.m || {};
    $API.d = obj.d || {};
    $API.initializer = obj.initializer || {};

    if(typeof obj.variables !== 'undefined'){
        for(var i in obj.variables){
            $API[i] = obj.variables[i];
        }
    }
    $API.initializer.plugins = obj.plugins || [];


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
                    plugin.dir = plugin.dir || '';
                    plugin.name = plugin.name || ('automizy-plugin-' + ++AutomizyGlobalPluginsIndex);
                    plugin.requiredPlugins = plugin.requiredPlugins || [];
                    if (typeof plugin.js === 'string') {
                        plugin.js = [plugin.js];
                    }
                    if (typeof plugin.css === 'string') {
                        plugin.css = [plugin.css];
                    }
                    if (typeof plugin.requiredPlugins === 'string') {
                        plugin.requiredPlugins = [plugin.requiredPlugins];
                    }

                    if(plugin.dir === '' && plugin.js.length > 0){
                        var uri = plugin.js[0];
                        var lastSlashIndex = uri.lastIndexOf('/');
                        if(lastSlashIndex <= 0){
                            plugin.dir = '';
                        }else {
                            plugin.dir = uri.substring(0, lastSlashIndex);
                        }
                    }

                    for(var j = 0; j < plugin.js.length; j++){
                        plugin.js[j] = plugin.js[j];
                    }
                    for(var j = 0; j < plugin.css.length; j++){
                        plugin.css[j] = plugin.css[j];
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

            console.log('%c '+plugin.name + ' started to load ('+(plugin.js.join(', '))+')', 'background: #000000; color: #ffffff; font-size:12px; border-radius:0 12px 12px 0');

            for (var j = 0; j < plugin.js.length; j++) {
                deferreds.push($.getScript(plugin.js[j]).fail(function(){
                    console.error('FAIL to load plugin with Automizy Project Initalizer');
                    for(var i = 0; i < arguments.length; i++){
                        console.error(arguments[i]);
                    }
                }));
            }
            plugin.xhr = $.when.apply(null, deferreds);
            for(var i = 0; i < plugin.xhrAlwaysFunctions.length; i++){
                plugin.xhr.always(plugin.xhrAlwaysFunctions[i]);
            }
            plugin.xhr.always(function(){
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
                        xhr: {
                            always:function(fnc){
                                this.xhrAlwaysFunctions.push(fnc);
                            }
                        },
                        xhrAlwaysFunctions:[],
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
                        AutomizyGlobalPlugins[pluginLocal.name].xhr.always.apply(AutomizyGlobalPlugins[pluginLocal.name], [function () {
                            t.d.loadedGlobalPluginsCount++;
                            if (t.d.loadedPluginsCount === t.d.allPluginsCount && t.d.globalPluginsCount === t.d.loadedGlobalPluginsCount && t.d.completeFunctionReady) {
                                t.d.completeFunctionReady = false;
                                t.complete();
                            }
                        }]);
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

                for(var j = 0; j < plugin.css.length; j++) {
                    t.insertCss(plugin.css[j]);
                }

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




    $API.runTheFunctions = function(functions, thisParameter, parameters){
        var functions = functions || [];
        var thisParameter = thisParameter || this;
        var parameters = parameters || [];
        for(var i = 0; i < functions.length; i++) {
            functions[i].apply(thisParameter, parameters);
        }
    };



    $API.functions.pluginsLoadedFunctions = [];
    $API.pluginsLoaded = function(f){
        var t = this;
        if(typeof f === 'function'){
            t.functions.pluginsLoadedFunctions.push(f);
            if(t.automizyPluginsLoaded){
                f.apply(t, []);
            }
            return t;
        }
        t.runTheFunctions(t.functions.pluginsLoadedFunctions, t, []);
        t.automizyPluginsLoaded = true;
        return t;
    };


    $API.loadPlugins = function () {
        var t = this;

        if (typeof window.jQuery === 'undefined') {
            var script = document.createElement("SCRIPT");
            script.src = t.config.dir + "/vendor/jquery/jquery.min.js";
            script.type = 'text/javascript';
            document.getElementsByTagName("head")[0].appendChild(script);
        }
        var checkReady = function (callback) {
            if (typeof window.jQuery === 'function') {
                callback(jQuery);
            } else {
                window.setTimeout(function () {
                    checkReady(callback);
                }, 100);
            }
        };

        checkReady(function ($) {
            if (t.initializer.plugins.length > 0) {
                t.pluginLoader.plugins(t.initializer.plugins).complete(function () {
                    t.pluginsLoaded();
                }).run();
            } else {
                t.pluginsLoaded();
            }
        });

    };

    $API.init = function () {
        var t = this;

        if(typeof t.automizyInited === 'undefined'){
            t.automizyInited = false;
        }

        if(!t.automizyInited){
            t.automizyInited = true;
            t.loadPlugins();
        }

        return t;
    };

    $API.baseDir = function(value){
        var t = this;
        if (typeof value !== 'undefined') {
            t.config.dir = value;
            return t;
        }
        return t.config.dir;
    };

    $API.m.Event = function (obj) {
        var t = this;
        t.d = {};
        t.d.functions = [];
        t.d.fireType = 1;
        t.d.fireCount = 0;
        t.d.arguments = [];

        if (typeof obj !== 'undefined') {
            if (typeof obj.fireType !== 'undefined') {
                t.fireType(obj.fireType);
            }
            if (typeof obj.fireCount !== 'undefined') {
                t.fireCount(obj.fireCount);
            }
            if (typeof obj.functions !== 'undefined') {
                t.functions(obj.functions);
            }
            if (typeof obj.arguments !== 'undefined') {
                t.arguments(obj.arguments);
            }
        }

    };

    var p = $API.m.Event.prototype;

    p.functions = function (functions) {
        var t = this;
        if (typeof functions !== 'undefined') {
            t.d.functions = functions;
            return t;
        }
        return t.d.functions;
    };
    p.addFunction = function (func, name, maxFireCount) {
        var t = this;
        var funcItem = {
            fireCount:0,
            maxFireCount:maxFireCount || false,
            name:name || false,
            function:func,
            enabled:true
        };
        t.d.functions.push(funcItem);
        if(t.fireType() === 2 && t.fireCount() >= 1){
            t.fireFunction(funcItem)
        }
        return t;
    };
    p.disableFunctions = function (funcName) {
        return this.toggleFunctions(false, funcName || false);
    };
    p.enableFunctions = function (funcName) {
        return this.toggleFunctions(true, funcName || false);
    };
    p.toggleFunctions = function(value, funcName){
        var t = this;
        if(typeof funcName === 'undefined' || funcName === false){
            t.d.functions.forEach(function(funcItem){
                funcItem.enabled = value;
            });
            return t;
        }
        t.d.functions.forEach(function(funcItem){
            if(funcItem.name === funcName){
                funcItem.enabled = value;
            }
        });
        return t;
    };
    p.arguments = function (arguments) {
        var t = this;
        if (typeof arguments !== 'undefined') {
            t.d.arguments = arguments;
            return t;
        }
        return t.d.arguments;
    };
    p.addArgument = function (argument) {
        var t = this;
        t.d.arguments.push(argument);
        return t;
    };
    p.fireType = function (fireType) {
        var t = this;
        if (typeof fireType !== 'undefined') {
            t.d.fireType = fireType;
            return t;
        }
        return t.d.fireType;
    };
    p.fireCount = function (fireCount) {
        var t = this;
        if (typeof fireCount !== 'undefined') {
            t.d.fireCount = fireCount;
            return t;
        }
        return t.d.fireCount;
    };
    p.fire = function(){
        var t = this;
        t.d.functions.forEach(function(funcItem){
            t.fireFunction(funcItem);
        });
        t.d.fireCount++;
        return t;
    };
    p.fireFunction = function(funcItem){
        var t = this;
        if(!funcItem.enabled){
            return t;
        }
        if(funcItem.maxFireCount !== false){
            if(funcItem.fireCount < funcItem.maxFireCount){
                funcItem.fireCount++;
                funcItem.function.apply(t, t.arguments());
            }
        }else{
            funcItem.fireCount++;
            funcItem.function.apply(t, t.arguments());
        }
        return t;
    }


    $API.functions.readyFunctions = [];
    $API.ready = function(f){
        var t = this;
        if(typeof f === 'function') {
            t.functions.readyFunctions.push(f);
            if(t.automizyReady){
                f.apply(t, []);
            }
            return t;
        }
        t.runTheFunctions(t.functions.readyFunctions);
        t.automizyReady = true;
        return t;
    };


    /*$API.layoutReady = new $API.m.Event({
        fireType:2
    });*/
    $API.functions.layoutReadyFunctions = [];
    $API.layoutReady = function(f){
        var t = this;
        if(typeof f === 'function') {
            t.functions.layoutReadyFunctions.push(f);
            if(t.automizyLayoutReady){
                f.apply(t, []);
            }
            return t;
        }
        t.runTheFunctions(t.functions.layoutReadyFunctions);
        t.automizyLayoutReady = true;
        return t;
    };


    $API.id = function(id){
        if (typeof id !== 'undefined') {
            this.d.id = id;
            return this;
        }
        return this.d.id;
    };

    $API.functions.permissionChangeFunctions = [];
    $API.functions.permissionChangeFunctionsByKey = {};
    $API.permissionChange = function(f, key){
        var t = this;
        if(typeof f === 'function' && typeof key === 'undefined') {
            t.functions.permissionChangeFunctions.push(f);
            return t;
        }
        if(typeof f === 'function' && typeof key !== 'undefined') {
            if(typeof t.functions.permissionChangeFunctionsByKey[key] === 'undefined'){
                t.functions.permissionChangeFunctionsByKey[key] = [];
            }
            t.functions.permissionChangeFunctionsByKey[key].push(f);
            return t;
        }
        $API.runTheFunctions($API.functions.permissionChangeFunctions);
        for(var i in $API.permissions){
            $API.runTheFunctions($API.functions.permissionChangeFunctionsByKey[i] || [], $API, [$API.permissions[i], $API.permissions[i]]); //value, from
        }
        return t;
    };
    $API.permission = function(){
        if(typeof arguments[0] === 'undefined'){
            return $API.permissions
        }
        if(typeof arguments[0] !== 'object' && typeof arguments[1] === 'undefined'){
            return $API.permissions[arguments[0]] || false;
        }
        if(typeof arguments[0] !== 'object' && typeof arguments[1] !== 'undefined'){
            $API.runTheFunctions($API.functions.permissionChangeFunctions, $API, [arguments[0], arguments[1], $API.permissions[key]]); //key, value, from
            $API.runTheFunctions($API.functions.permissionChangeFunctionsByKey[arguments[0]] || [], $API, [arguments[1], $API.permissions[key]]); //value, from
            $API.permissions[arguments[0]] = arguments[1];
            return $API;
        }
        if(typeof arguments[0] === 'object' && typeof arguments[1] === 'undefined'){
            for(var i in arguments[0]){
                $API.runTheFunctions($API.functions.permissionChangeFunctions, $API, [i, arguments[0][i], $API.permissions[i]]); //key, value, from
                $API.runTheFunctions($API.functions.permissionChangeFunctionsByKey[i] || [], $API, [arguments[0][i], $API.permissions[i]]); //value, from
                $API.permissions[i] = arguments[0][i];
            }
            return $API;
        }

        return $API;
    };

    $API.createEvent = function(settings){
        settings = settings || {};
        if(typeof settings === 'string'){
            settings = {
                eventName:settings
            };
        }
        $API.events[settings.eventName] = new $API.m.Event({
            fireType:settings.fireType || 1,
            arguments:settings.arguments || []
        });
        $API[settings.eventName] = function(funcOrArgumantsOrValue, funcName, maxFireCount){
            if(typeof funcOrArgumantsOrValue === 'function'){
                $API.events[settings.eventName].addFunction(funcOrArgumantsOrValue, funcName || false, maxFireCount || false);
                return $API;
            }else if(typeof funcOrArgumantsOrValue === 'string'){
                if(funcOrArgumantsOrValue === 'off'){
                    $API.events[settings.eventName].disableFunctions(funcName || false);
                    return $API;
                }else if(funcOrArgumantsOrValue === 'on' && typeof funcName === 'string'){
                    $API.events[settings.eventName].enableFunctions(funcName);
                    return $API;
                }
            }

            if(typeof funcOrArgumantsOrValue === 'object' || typeof funcOrArgumantsOrValue === 'array'){
                $API.events[settings.eventName].arguments(funcOrArgumantsOrValue);
            }
            $API.events[settings.eventName].fire();
            return $API;
        };
        return $API;
    };

    console.log('%c ' + ($API.name || 'A module') + ' was created by AutomizyProjectInitializer! ', 'background: #000000; color: #f7ffde; font-size:14px; border-radius:0 12px 12px 0');

};