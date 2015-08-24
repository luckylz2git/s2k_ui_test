/**
 * Created by Lin.Zhi on 2015-08-19.
 */
//headless test configure file
exports.config = {
    //use chrome directly
    directConnect: true,
    // Framework to use. Jasmine 2 is recommended.
    framework: 'jasmine2',
    //Waiting for Page to Load & Waiting for Angular
    getPageTimeout: 150000,
    //Waiting for Page Synchronization
    allScriptsTimeout: 151000,
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
        }
    },
    onPrepare: function() {
        browser.driver.manage().window().setSize(1280, 1024);//window size
    },
    // Spec patterns are relative to the current working directly when
    specs: ['s2k_pricemodify_spec.js'],
    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 160000
    }
};