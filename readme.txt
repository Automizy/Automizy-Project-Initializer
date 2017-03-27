window.AutomizyImportWizard = window.$AIW = new AutomizyProject({
    variables:{
        //key:value
    },
    plugins:[
        {
            name:'fontawesome',
            skipCondition:hasFont('fa', 'FontAwesome'),
            css:"vendor/fontawesome/css/font-awesome.min.css"
        },
        {
            name:'automizy-process-wizard',
            skipCondition:typeof AutomizyProcessWizard !== 'undefined',
            css:"vendor/automizy-process-wizard/automizy-process-wizard.css",
            js:"vendor/automizy-process-wizard/automizy-process-wizard.js",
            requiredPlugins:[
                'automizy-js',
                'automizy-js-api'
            ],
            complete:function(){
                $APW.init();
            }
        },
        {
            name:'automizy-js-api',
            skipCondition:typeof AutomizyJsApi !== 'undefined',
            js:"vendor/automizy-js-api/automizy.api.js",
            requiredPlugins:[
                'automizy-js'
            ]
        },
        {
            name:'jquery-ui',
            skipCondition:function(){return typeof $.ui !== 'undefined'},
            js:"vendor/jquery-ui/jquery-ui.min.js"
        },
        {
            name:'jquery-file-upload',
            skipCondition:function(){return typeof $().fileupload !== 'undefined'},
            js:[
                "vendor/jquery-file-upload/jquery.fileupload.js",
                "vendor/jquery-file-upload/jquery.iframe-transport.js"
            ],
            requiredPlugins:[
                'jquery-ui'
            ]
        },
        {
            name:'automizy-js',
            skipCondition:typeof AutomizyJs !== 'undefined',
            css:"vendor/automizy-js/automizy.css",
            js:[
                "vendor/automizy-js/languages/en_US.js",
                "vendor/automizy-js/automizy.js"
            ]
        }
    ]
});