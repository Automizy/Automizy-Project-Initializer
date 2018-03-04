define.amd = false;
require([
    "js/core/core",
    "js/core/init",
    "js/core/initFrom",
    "js/core/baseDir",
    "js/core/pluginLoader",
    "js/core/runTheFunctions",

    "js/events/event",
    "js/events/pluginsLoaded",
    "js/events/ready",
    "js/events/layoutReady",

    "js/functions/id",
    "js/functions/permission",
    "js/functions/createEvent",
    "js/functions/loadPlugin"
], function () {
    console.log('%c ' + ($API.name || 'A module') + ' was created by AutomizyProjectInitializer! ', 'background: #000000; color: #f7ffde; font-size:14px; border-radius:0 12px 12px 0');
});
