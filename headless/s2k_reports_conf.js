/**
 * Created by Lin.Zhi on 2015-08-14.
 */
//headless test configure file
exports.config = {
    //use chrome directly
    directConnect: true,
    // Framework to use. Jasmine 2 is recommended.
    framework: 'jasmine2',
    //Waiting for Page to Load & Waiting for Angular
    getPageTimeout: 50000,
    //Waiting for Page Synchronization
    allScriptsTimeout: 51000,
    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            args: ['--test-type  --unlimited-storage']
        }
    },
    //login user & password
    params: {
        login: {
            usermail: 'test@s2k.net', //local user
            password: '1234'
        },
        test: {
            count: 2 //test count
        },
        menuindex: { //menu index
            reports: {
                index: 5,
                idxS2KReports: 0,
                idxHQReports:  1
            }
        }
    },
    onPrepare: function() {
        browser.driver.manage().window().setSize(1024, 768);//window size
    },
    // Spec patterns are relative to the current working directly when
    specs: ['s2k_reports_spec.js'],
    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 60000
    }
};
