define([
    "js/core/core"
], function ($API) {
    $API.initFrom = function(value){
        var t = this;
        if (typeof value !== 'undefined') {
            t.config.initFrom = value;
            return t;
        }
        return t.config.initFrom;
    };
});