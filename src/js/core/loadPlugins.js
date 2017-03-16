define([
    "js/core/core",
    "js/core/pluginLoader",
    "js/events/pluginsLoaded"
], function ($API) {
    $API.loadPlugins = function () {
        (function () {
            if (typeof window.jQuery === 'undefined') {
                var script = document.createElement("SCRIPT");
                script.src = $API.config.dir + "/vendor/jquery/jquery.min.js";
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
                if($API.initializer.plugins.length > 0) {
                    $API.pluginLoader.plugins($API.initializer.plugins).complete(function () {
                        $API.pluginsLoaded();
                    }).run();
                }else{
                    $API.pluginsLoaded();
                }
            });

        })();
    };
});