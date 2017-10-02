define([
    "js/core/core"
], function ($API) {
    $API.functions.permissionChangeFunctions = [];
    $API.functions.permissionChangeFunctionsByKey = {};
    $API.permissionChange = function(f, key){
        var t = this;
        if(typeof f === 'function' && typeof key === 'undefined') {
            t.functions.permissionChangeFunctions.push(f);
            return t;
        }
        if(typeof f === 'function' && typeof key !== 'undefined') {
            if(typeof t.functions.permissionChangeFunctionsByKey[key] === 'undefined'){
                t.functions.permissionChangeFunctionsByKey[key] = [];
            }
            t.functions.permissionChangeFunctionsByKey[key].push(f);
            return t;
        }
        $API.runTheFunctions($API.functions.permissionChangeFunctions);
        for(var i in $API.permissions){
            $API.runTheFunctions($API.functions.permissionChangeFunctionsByKey[i] || [], $API, [$API.permissions[i], $API.permissions[i]]); //value, from
        }
        return t;
    };
    $API.permission = function(){
        if(typeof arguments[0] === 'undefined'){
            return $API.permissions
        }
        if(typeof arguments[0] !== 'object' && typeof arguments[1] === 'undefined'){
            return $API.permissions[arguments[0]] || false;
        }
        if(typeof arguments[0] !== 'object' && typeof arguments[1] !== 'undefined'){
            $API.runTheFunctions($API.functions.permissionChangeFunctions, $API, [arguments[0], arguments[1], $API.permissions[arguments[0]]]); //key, value, from
            $API.runTheFunctions($API.functions.permissionChangeFunctionsByKey[arguments[0]] || [], $API, [arguments[1], $API.permissions[arguments[0]]]); //value, from
            $API.permissions[arguments[0]] = arguments[1];
            return $API;
        }
        if(typeof arguments[0] === 'object' && typeof arguments[1] === 'undefined'){
            for(var i in arguments[0]){
                $API.runTheFunctions($API.functions.permissionChangeFunctions, $API, [i, arguments[0][i], $API.permissions[i]]); //key, value, from
                $API.runTheFunctions($API.functions.permissionChangeFunctionsByKey[i] || [], $API, [arguments[0][i], $API.permissions[i]]); //value, from
                $API.permissions[i] = arguments[0][i];
            }
            return $API;
        }

        return $API;
    };
});