define([
    "js/core/core",
    "js/core/pluginLoader",
    "js/events/pluginsLoaded"
], function ($API) {
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
});