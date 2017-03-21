define([
    "js/core/core"
], function ($API) {
    $API.baseDir = function(value){
        var t = this;
        if (typeof value !== 'undefined') {
            t.config.dir = value;
            return t;
        }
        return t.config.dir;
    };
});