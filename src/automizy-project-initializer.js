define.amd = false;
require([
    "js/core/core",
    "js/core/init",
    "js/core/baseDir",
    "js/core/pluginLoader",
    "js/core/runTheFunctions",

    "js/events/pluginsLoaded",
    "js/events/ready",

    "js/functions/id"
], function () {
    console.log('%c AutomizyProjectInitializer loaded! ', 'background: #000000; color: #bada55; font-size:14px');
});
