define([
    "js/core/core"
], function ($API) {
    $API.createEvent = function(settings){
        settings = settings || {};
        if(typeof settings === 'string'){
            settings = {
                eventName:settings
            };
        }
        $API.events[settings.eventName] = new $API.m.Event({
            fireType:settings.fireType || 1,
            arguments:settings.arguments || []
        });
        $API[settings.eventName] = function(funcOrArgumantsOrValue, funcName, maxFireCount){
            if(typeof funcOrArgumantsOrValue === 'function'){
                $API.events[settings.eventName].addFunction(funcOrArgumantsOrValue, funcName || false, maxFireCount || false);
                return $API;
            }else if(typeof funcOrArgumantsOrValue === 'string'){
                if(funcOrArgumantsOrValue === 'off'){
                    $API.events[settings.eventName].disableFunctions(funcName || false);
                    return $API;
                }else if(funcOrArgumantsOrValue === 'on' && typeof funcName === 'string'){
                    $API.events[settings.eventName].enableFunctions(funcName);
                    return $API;
                }
            }

            if(typeof funcOrArgumantsOrValue === 'object' || typeof funcOrArgumantsOrValue === 'array'){
                $API.events[settings.eventName].arguments(funcOrArgumantsOrValue);
            }
            $API.events[settings.eventName].fire();
            return $API;
        };
        return $API;
    };
});