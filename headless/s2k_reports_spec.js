/**
 * Created by Lin.Zhi on 2015-08-14.
 */
//headless test specification file
//Print console.log with Date-Time Stamp
printLog = function(logText){
    var moment = require('moment');
    console.log('[' + moment().format('YYYY-MM-DDTHH:mm:ss.SSS[GMT]ZZ') + '] ' + logText);
};

logins2k = function(){
    var username = browser.params.login.usermail;
    var password = browser.params.login.password;
    browser.get('https://store.s2k.net/admin/#/login');//station id 8

    element(by.model('user.email')).sendKeys(username); //params.login.usermail
    element(by.model('user.email')).getAttribute('value').then(printLog);

    element(by.model('user.password')).sendKeys(password); //params.login.password
    element(by.model('user.password')).getAttribute('value').then(printLog);

    var btnLogin = element(by.buttonText('LOGIN'));
    btnLogin.click(); //login
};

showfooter = function() {
    element(by.css('footer')).isDisplayed().then(function(isVisible){
        if (isVisible !== true) {
            element(by.model('breadcrumbs.listingSearch')).isDisplayed().then(function(isVisible){
                if (isVisible !== true) {
                    console.log('*** *** *** Search Box ISNOT Visible ! *** *** ***');
                }
            });
        }
    });
};

click_report = function(dropdown, menuindex, listindex){
    //console.log('\n********** Click List No. '+ (listindex+1) +' **********\n');
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(menuindex); //reports menuindex = 5
    menu.getText().then(function(menutext){
        console.log('\nClick Dropdown Menu [ '+ menutext +' ] Index:' + menuindex);
    });
    menu.click().then(showfooter);
    //element(by.css('[placeholder="Search"]')).sendKeys('Search Box Visible');

    var subTitle1 = element.all(by.css('[ng-show="subTitle"]'));
    subTitle1.count().then(function(list){
        if (list > 0) {
            console.log('Located ' + list + ' SubTitle Name [ Listing ]');
        }
        else {
            console.log('*** *** *** CANNOT Located SubTitle Name [ Listing ] !');
        }
    });
    expect(subTitle1.first().getText()).toEqual('Listing');

    var list=element.all(by.repeater('item in items')); //Get Report List
    list.count().then(function(icount){
        if (icount > 0) {
            console.log('Click List Record No. ' + ((listindex % icount)+1) + '/' + icount);

            if (menuindex == 0) {
                list.get(listindex % icount).click().then(showfooter).then(function(){
                    element(by.css('.page-header')).getAttribute('title').then(printLog);
                    browser.sleep(5000);
                    browser.executeScript('window.scrollTo(0,0)');
                }).then(function(){
                    element(by.css('[ng-click="backToList()"]')).click();
                });
            } else {
                list.get(listindex % icount).click().then(showfooter).then(function(){
                    element(by.css('[ng-click="cancel()"]')).click();
                });
            }

        } else {
            console.log('*** *** *** No Report(s) *** *** *** Found in the [ Listing ], Ignore [ Report ] Checking.');
        }
    });
};

//******************************************************************************************
//******************************************************************************************
//Test Start
//******************************************************************************************
//******************************************************************************************
describe("s2k login page", function() {
    it("login to system", logins2k);
    if (true) {
        describe('"Reports" menu navigation', function () {
            var dropdown;
            beforeEach(function () {
                dropdown = element.all(by.repeater('item in modules')).get(5); //Get "Reports"
                dropdown.click().then(showfooter);
            });
            var i, j;
            var testcount = browser.params.test.count;
            var listname = '';
            for (j = 0; j < 2; j++) {
                switch (j) {
                    case 0:
                        listname = 'S2K Reports';
                        testcount = 4;
                        break;
                    case 1:
                        listname = 'HQ Reports';
                        testcount = 1;
                        break;
                    default:
                        listname = '';
                        break;
                }
                for (i = 0; i < testcount; i++) {
                    //Ref：http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                    (function (menuindex, testindex) {
                        it(listname, function () {
                            click_report(dropdown, menuindex, testindex); //0=Accounts
                        });
                    })(j, i);
                }
            }
        });
    }
});
