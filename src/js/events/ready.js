define([
    "js/core/core",
    "js/core/runTheFunctions"
], function () {

    $API.functions.readyFunctions = [];
    $API.ready = function(f){
        if(typeof f === 'function') {
            $API.functions.readyFunctions.push(f);
            if($API.automizyReady){
                f.apply($API, []);
            }
            return $API;
        }
        $API.runTheFunctions($API.functions.readyFunctions);
        $API.automizyReady = true;
        return $API;
    };

});