define([], function (obj) {
    
    var $API = this;

    $API.version = obj.version || '0.1.1';
    $API.name = obj.name || false;
    $API.elements = obj.elements || {};
    $API.dialogs = obj.dialogs || {};
    $API.inputs = obj.inputs || {};
    $API.buttons = obj.buttons || {};
    $API.forms = obj.forms || {};
    $API.functions = obj.functions || {};
    $API.events = obj.events || {};
    $API.modules = obj.modules || {};
    $API.xhr = obj.xhr || {};
    $API.permissions = obj.permissions || {};
    $API.permissionGroups = obj.permissionGroups || {};
    $API.config = obj.config || {
        dir:'.',
        url:'https://app.automizy.com',
        initFrom:''
    };
    $API.m = obj.m || {};
    $API.d = obj.d || {};
    $API.initializer = obj.initializer || {};

    if(typeof obj.variables !== 'undefined'){
        for(var i in obj.variables){
            $API[i] = obj.variables[i];
        }
    }
    $API.initializer.plugins = obj.plugins || [];

});