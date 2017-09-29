define([
    "js/core/core",
], function () {
    $API.m.Event = function (obj) {
        var t = this;
        t.d = {};
        t.d.functions = [];
        t.d.fireType = 1;
        t.d.fireCount = 0;
        t.d.arguments = [];

        if (typeof obj !== 'undefined') {
            if (typeof obj.fireType !== 'undefined') {
                t.fireType(obj.fireType);
            }
            if (typeof obj.fireCount !== 'undefined') {
                t.fireCount(obj.fireCount);
            }
            if (typeof obj.functions !== 'undefined') {
                t.functions(obj.functions);
            }
            if (typeof obj.arguments !== 'undefined') {
                t.arguments(obj.arguments);
            }
        }

    };

    var p = $API.m.Event.prototype;

    p.functions = function (functions) {
        var t = this;
        if (typeof functions !== 'undefined') {
            t.d.functions = functions;
            return t;
        }
        return t.d.functions;
    };
    p.addFunction = function (func, name, maxFireCount) {
        var t = this;
        var funcItem = {
            fireCount:0,
            maxFireCount:maxFireCount || false,
            name:name || false,
            function:func,
            enabled:true
        };
        t.d.functions.push(funcItem);
        if(t.fireType() === 2 && t.fireCount() >= 1){
            t.fireFunction(funcItem)
        }
        return t;
    };
    p.disableFunctions = function (funcName) {
        return this.toggleFunctions(false, funcName || false);
    };
    p.enableFunctions = function (funcName) {
        return this.toggleFunctions(true, funcName || false);
    };
    p.toggleFunctions = function(value, funcName){
        var t = this;
        if(typeof funcName === 'undefined' || funcName === false){
            t.d.functions.forEach(function(funcItem){
                funcItem.enabled = value;
            });
            return t;
        }
        t.d.functions.forEach(function(funcItem){
            if(funcItem.name === funcName){
                funcItem.enabled = value;
            }
        });
        return t;
    };
    p.arguments = function (arguments) {
        var t = this;
        if (typeof arguments !== 'undefined') {
            t.d.arguments = arguments;
            return t;
        }
        return t.d.arguments;
    };
    p.addArgument = function (argument) {
        var t = this;
        t.d.arguments.push(argument);
        return t;
    };
    p.fireType = function (fireType) {
        var t = this;
        if (typeof fireType !== 'undefined') {
            t.d.fireType = fireType;
            return t;
        }
        return t.d.fireType;
    };
    p.fireCount = function (fireCount) {
        var t = this;
        if (typeof fireCount !== 'undefined') {
            t.d.fireCount = fireCount;
            return t;
        }
        return t.d.fireCount;
    };
    p.fire = function(){
        var t = this;
        t.d.functions.forEach(function(funcItem){
            t.fireFunction(funcItem);
        });
        t.d.fireCount++;
        return t;
    };
    p.fireFunction = function(funcItem){
        var t = this;
        if(!funcItem.enabled){
            return t;
        }
        if(funcItem.maxFireCount !== false){
            if(funcItem.fireCount < funcItem.maxFireCount){
                funcItem.fireCount++;
                funcItem.function.apply(t, t.arguments());
            }
        }else{
            funcItem.fireCount++;
            funcItem.function.apply(t, t.arguments());
        }
        return t;
    }
});
