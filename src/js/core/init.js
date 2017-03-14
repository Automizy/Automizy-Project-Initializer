define([
    "js/core/core",
    "js/core/loadPlugins"
], function () {
    $API.init = function () {
        if(typeof $API.automizyInited === 'undefined'){
            $API.automizyInited = false;
        }

        if(!$API.automizyInited){
            $API.automizyInited = true;
            $API.loadPlugins();
        }

        return $API;
    };
});