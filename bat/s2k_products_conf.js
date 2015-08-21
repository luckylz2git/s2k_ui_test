/**
 * Created by Lin.Zhi on 2014-10-23.
 */
// An example configuration file.
exports.config = {

    /*start up protractor only by chrome*/
    // Do not start a Selenium Standalone sever - only run this using chrome.
    //chromeOnly: true, //Warning: chromeOnly is deprecated. Use directConnect
    directConnect: true,

    //https://github.com/angular/protractor/blob/master/example/conf.js
    chromeDriver: '../selenium/chromedriver',

    /*start up protractor only by chrome*/
    //seleniumAddress: 'http://localhost:4444/wd/hub',

    //Timeouts from Protractor
    //https://github.com/angular/protractor/blob/master/docs/timeouts.md

    //Waiting for Page to Load & Waiting for Angular
    getPageTimeout: 50000,

    //Waiting for Page Synchronization
    allScriptsTimeout: 51000,

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome',
        /*
        'chrome.prefs': {
            'settings.language.preferred_languages': 'de-DE,de'
            //'us-EN,en' 无效
            //参考网址：http://stackoverflow.com/questions/11289597/webdriver-how-to-specify-preferred-languages-for-chrome
        },
        */
        'chromeOptions': {
            args: ['--test-type  --unlimited-storage']
            //--test-type
            //避免出现：您使用的是不受支持的命令行标记：--ignore-certificate-errors。稳定性和安全性会有所下降。
            //参考网址：https://github.com/angular/protractor/issues/919
            //--unlimited-storage
            //避免出现：XXXXX想在您的本地计算机上永久保存大量数据
            //avoid: XXXXX wants to permanently store large data on your local computer.
            //参考网址：http://stackoverflow.com/questions/21015771/what-causes-the-chrome-wants-to-permanently-store-large-data-message
        }
    },

    //login user & password
    params: {
        login: {
            //usermail: 'tsotest@s2k.net', //hq登录用户名
            //password: '1234'

            //usermail: 'tsosite@s2k.net',
            //password: '1234'

            usermail: 'test@s2k.net', //local登录用户名
            password: '1234'
        },
        test: {
            count: 1 //每个列表测试次数
        },
        menuindex: { //用于管理菜单列表
            products: {
                index: 0,
                idxProducts:     0,
                idxPricebook:    1,
                idxQuickAdd: 2,
                idxDepartment:   3,
                idxUPCAssembly:  4,
                idxFuelGrades:   5,
                idxFuelTanks:    6,
                idxFuelBlends:   7,
                idxTaxZones:     8,
                idxTaxRates:     9,
                idxDisabled:    -1 //如果菜单不可用，则置为(-1)
            },
            marketing: {
                index: 1,
                idxPromotions:   0
            },
            entities: {
                index: 2,
                idxStores:         0,
                idxTaxAuthorities: 1
            },
            logs: {
                index: 3,
                idxPromotionAcceptance:   0,
                idxPromotionDenial:       1,
                idxPromotionPublish:      2,
                idxPromotionNotification: 3,
                idxProductCatalogPublish: 4,
                idxDepartmentPublish:     5,
                idxFuelGradePublish:      6,
                idxPOSPoll:               7,
                idxStoreAccepted:         8,
                idxStoreRejected:         9,
                idxExportData:           10,
                idxStartTpr:             11,
                idxEndTpr:               12
            },
            settings: {
                index: 4,
                idxUsers:         0,
                idxUserRoles:     1,
                idxPayment:       2,
                idxFuelTankTypes: 3,
                idxPOSTerminals:  4
            },
            reports: {
                index: 5,
                idxStoreSalesByDepart:    0,
                idxGallonSoldByFuelGrade: 1
            }
        }
        //参考网址：http://ramonvictor.github.io/protractor/slides/#/37
    },
    onPrepare: function() {
        //browser.driver.manage().window().maximize(); //最大化窗口
        browser.driver.manage().window().setSize(1024, 768);//预设浏览器窗口尺寸
        //参考网址：http://ramonvictor.github.io/protractor/slides/#/34
    },
    // Spec patterns are relative to the current working directly when
    // protractor is called.
    //specs: ['example_test.js'],
    specs: ['s2k_products_spec.js'],
    /*
     suites: {
     test: 'example_test.js', //conf_test.js --suite test
     s2k: ['s2k_test.js']     //conf_test.js --suite s2k
     },
     */
    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 60000
    }
};
