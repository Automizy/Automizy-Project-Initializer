define([
    "js/core/core",
    "js/core/runTheFunctions"
], function ($API) {

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
});