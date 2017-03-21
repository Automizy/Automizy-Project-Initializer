define.amd = false;
require([
    "js/core/core",
    "js/core/init",
    "js/core/baseDir",
    "js/core/pluginLoader",
    "js/core/runTheFunctions",

    "js/events/pluginsLoaded",
    "js/events/ready",
    "js/events/layoutReady",

    "js/functions/id"
], function () {
    console.log('%c A module was created by AutomizyProjectInitializer! ', 'background: #000000; color: #ffac65; font-size:14px');
});
