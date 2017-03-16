define([
    "js/core/core"
], function ($API) {

    $API.functions.layoutReadyFunctions = [];
    $API.layoutReady = function(f){
        if(typeof f === 'function') {
            $API.functions.layoutReadyFunctions.push(f);
            if($API.automizyLayoutReady){
                f.apply($API, []);
            }
            return $API;
        }
        $API.runTheFunctions($API.functions.layoutReadyFunctions);
        $API.automizyLayoutReady = true;
        return $API;
    };

});