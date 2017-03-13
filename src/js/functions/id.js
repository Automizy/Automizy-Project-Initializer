define([
    "js/core/core"
], function () {
    p.id = function(id){
        if (typeof id !== 'undefined') {
            this.d.id = id;
            return this;
        }
        return this.d.id;
    };
});