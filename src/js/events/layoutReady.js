define([
    "js/core/core",
    "js/core/runTheFunctions"
], function ($API) {

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

});