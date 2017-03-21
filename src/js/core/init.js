define([
    "js/core/core",
    "js/core/loadPlugins"
], function ($API) {
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
});