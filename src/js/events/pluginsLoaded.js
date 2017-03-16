define([
    "js/core/core",
    "js/core/runTheFunctions"
], function ($API) {

    $API.functions.pluginsLoadedFunctions = [];
    $API.pluginsLoaded = function(f){
        if(typeof f === 'function'){
            $API.functions.pluginsLoadedFunctions.push(f);
            if($API.automizyPluginsLoaded){
                f.apply($API, []);
            }
            return $API;
        }
        $API.runTheFunctions($API.functions.pluginsLoadedFunctions, $API, []);
        $API.automizyPluginsLoaded = true;
        return $API;
    };

});