define([], function () {

    window.AutomizyGlobalPlugins = window.AutomizyGlobalPlugins || {i:0};
    window.AutomizyGlobalZIndex = window.AutomizyGlobalZIndex || 2000;
    window.AutomizyProject = function(obj){
        var t = this;
        if(typeof obj.variables !== 'undefined'){
            for(var i in obj.variables){
                t[i] = obj.variables[i];
            }
        }
        t.initializer.plugins = obj.plugins || [];
    };
    var initAutomizyProject = function(t){
        t.version = '0.1.1';
        t.elements = {};
        t.dialogs = {};
        t.inputs = {};
        t.buttons = {};
        t.forms = {};
        t.functions = {};
        t.xhr = {};
        t.config = {
            dir:'.',
            url:'https://app.automizy.com'
        };
        t.m = {};
        t.d = {};
        t.initializer = {};
    };
    var $API = window.AutomizyProject.prototype;
    initAutomizyProject($API);

    return $API;

});