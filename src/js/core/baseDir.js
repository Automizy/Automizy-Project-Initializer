define([
    "js/core/core"
], function ($API) {
    $API.baseDir = function(value){
        if (typeof value !== 'undefined') {
            $API.config.dir = value;
            return $API;
        }
        return $API.config.dir;
    };
});