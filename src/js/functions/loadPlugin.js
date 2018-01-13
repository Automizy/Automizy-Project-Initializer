define([
    "js/core/core"
], function ($API) {
    $API.loadPlugin = function (pluginName, func, ajaxLoader) {
        func = func || function(){};
        ajaxLoader = ajaxLoader || false;
        var pluginConfig = false;
        for(var i = 0; i < $API.initializer.plugins.length; i++){
            if($API.initializer.plugins[i].name === pluginName){
                pluginConfig = $API.initializer.plugins[i];
                break;
            }
        }
        if(pluginConfig === false){
            return false;
        }
        if (ajaxLoader) {
            $A.ajaxDocumentCover(1);
        }
        return $API.pluginLoader.addPlugin({
            name: pluginName,
            skipCondition: pluginConfig.skipCondition || false,
            js: pluginConfig.js || [],
            css: pluginConfig.css || [],
            autoload: true,
            complete:function(){
                if(typeof pluginConfig.windowVariable !== 'undefined' && pluginConfig.windowVariable !== false){
                    window[pluginConfig.windowVariable].init().ready(function(){
                        if (ajaxLoader) {
                            $A.ajaxDocumentCover(0);
                        }
                        if(typeof pluginConfig.complete === 'function') {
                            pluginConfig.complete.apply(this, []);
                        }
                        func.apply(this, []);
                    })
                }else{
                    if (ajaxLoader) {
                        $A.ajaxDocumentCover(0);
                    }
                }
            }
        }).run();
    };
});