/**
 * Created by Lin.Zhi on 2015-08-18.
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
    browser.get('https://store.s2k.net/admin/#/login');//

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

click_logs = function(dropdown, menuindex, listindex){
    //console.log('\n********** Click List No. '+ (listindex+1) +' **********\n');
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(menuindex); //log menu
    menu.getText().then(function(menutext){
        console.log('\nClick Dropdown Menu [ '+ menutext +' ] Index:' + menuindex);
    });
    menu.click().then(showfooter);

    var subTitle1 = element.all(by.css('[ng-show="subTitle"]'));
    subTitle1.count().then(function(list){
        if (list>0) {
            console.log('Located SubTitle Name [ History ]');
        }
        else {
            console.log('*** *** *** CANNOT Located SubTitle Name [ History ] !');
        }
    });

    expect(subTitle1.first().getText()).toEqual('History');

    var list=element.all(by.repeater('item in items')); //Get List
    list.count().then(function(icount){
        if (icount > 0) {
            console.log('Click History Record No. ' + ((listindex % icount) + 1) + '/' + icount);
            list.get(listindex % icount).click().then(showfooter);

            var mdialog = element.all(by.css('[class="modal fade  in"]'));
            mdialog.count().then(function (icount){
                console.log('Modal Dialog : ', icount);
                if (icount > 1) {
                    for (var i = icount - 1; i > 0; i--) {
                        (function (index) {
                            mdialog.get(index).element(by.css('[ng-click="cancel()"]')).click();
                        })(i);
                    }
                }
            });
            mdialog.first().then(function (ele) {
                var subtext=ele.getText();//.then(console.log);
                var subAtt=ele.getAttribute('class');//.then(console.log);
            });
            expect(element(by.css('.modal-header h3')).getText()).toEqual('Job Steps');

            element(by.css('[ng-click="cancel()"]')).click(); //cancel click
        }
        else{
            console.log('*** *** *** No Record(s) *** *** *** Found in the [ History ], Ignore [ Job Steps ] Checking.');
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
        describe('"Logs" menu navigation', function () {
            var dropdown;
            beforeEach(function () {
                dropdown = element.all(by.repeater('item in modules')).get(3); //Get "Logs"
                dropdown.click().then(showfooter);
            });
            var i, j;
            var testcount = browser.params.test.count;

            for (j = 0; j < 26; j++) {
                for (i = 0; i < testcount; i++) {
                    //Ref：http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                    (function (menuindex, testindex) {
                        it('[ Logs ] Dropdown List No. ' + (j + 1), function () {
                            click_logs(dropdown, menuindex, testindex);
                            browser.sleep(500);
                        });
                    })(j, i);
                }
            }
        });
    }
});
