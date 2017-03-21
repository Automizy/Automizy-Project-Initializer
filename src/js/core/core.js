define([], function (obj) {
    
    var $API = this;

    $API.version = '0.1.1';
    $API.elements = {};
    $API.dialogs = {};
    $API.inputs = {};
    $API.buttons = {};
    $API.forms = {};
    $API.functions = {};
    $API.modules = {};
    $API.xhr = {};
    $API.config = {
        dir:'.',
        url:'https://app.automizy.com'
    };
    $API.m = {};
    $API.d = {};
    $API.initializer = {};

    if(typeof obj.variables !== 'undefined'){
        for(var i in obj.variables){
            $API[i] = obj.variables[i];
        }
    }
    $API.initializer.plugins = obj.plugins || [];

});