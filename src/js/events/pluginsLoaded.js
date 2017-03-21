define([
    "js/core/core",
    "js/core/runTheFunctions"
], function ($API) {

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

});