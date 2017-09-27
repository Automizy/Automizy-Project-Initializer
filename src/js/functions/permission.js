define([
    "js/core/core"
], function ($API) {
    $API.permission = function(){
        if(typeof arguments[0] === 'undefined'){
            return $API.permissions
        }
        if(typeof arguments[0] !== 'object' && typeof arguments[1] === 'undefined'){
            return $API.permissions[arguments[0]];
        }
        if(typeof arguments[0] !== 'object' && typeof arguments[1] !== 'undefined'){
            $API.permissions[arguments[0]] = arguments[1];
            return $API;
        }
        if(typeof arguments[0] === 'object' && typeof arguments[1] === 'undefined'){
            for(var i in arguments[0]){
                $API.permissions[i] = arguments[0][i];
            }
            return $API;
        }

        return $API;
    };
});