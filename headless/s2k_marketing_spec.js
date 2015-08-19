/**
 * Created by Lin.Zhi on 2015-08-19.
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
    btnLogin.click();//login
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

click_promotion = function(dropdown, menuindex, listindex){
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(menuindex);
    menu.getText().then(function(menutext){
        console.log('\nClick Dropdown Menu [ '+ menutext +' ] Index:' + menuindex);
    });
    menu.click().then(showfooter);

    var subTitle1 = element.all(by.css('[ng-show="subTitle"]'));
    subTitle1.count().then(function(list){
        if (list>0) {
            console.log('Located ' + list + ' SubTitle Name [ Listing ]');
        }
        else {
            console.log('*** *** *** CANNOT Located SubTitle Name [ Listing ] !');
        }
    });
    expect(subTitle1.first().getText()).toEqual('Listing');

    var clickButton=element(by.css('[ng-click="new()"]')); //Get New Button
    clickButton.getText().then(function(text){
        console.log('\nClick Button Name [ ' + text + ' ]');
    });
    expect(clickButton.getText()).toEqual('New');
    clickButton.getAttribute('disabled').then(function(value){
        if (value)
        {
            printLog('Button [New] is Disabled !');
        }
        else
        {
            clickButton.click().then(showfooter);

            var newInput;
            dropdown.getText().then(function(text){
                if (text == 'Marketing' && menuindex == 1) { //Marketing -> Advertizement Items
                    newInput = element.all(by.css('.col-md-4 input'));
                } else if(text == 'Products' && menuindex == 7) { //Products -> Tax Rates
                    newInput = element.all(by.css('.col-md-2 input'));
                } else {
                    newInput = element.all(by.css('.col-md-6 input'));
                }
                newInput.count().then(function(icount){
                    console.log('Located ' +icount + ' Input Box(s)');
                });
                newInput.each(function (ele) {
                    //ele.clear().sendKeys('Valided by protractor.');
                    ele.sendKeys(' (Valided by protractor)');
                });
            });
            clickButton=element(by.css('[ng-click="backToList()"]'));
            clickButton.getText().then(function(text){
                console.log('Go Back To [ ' + text + ' ] Page\n');
            });
            expect(clickButton.getText()).toEqual('Listing');
            clickButton.click().then(showfooter);

            subTitle1 = element.all(by.css('[ng-show="subTitle"]'));
            subTitle1.count().then(function(list){
                if (list>0) {
                    console.log('Located SubTitle Name [ Listing ]');
                }
                else {
                    console.log('*** *** *** CANNOT Located SubTitle Name [ Listing ] !');
                }
            });
            expect(subTitle1.first().getText()).toEqual('Listing');
        }
    });

    var list=element.all(by.repeater('item in items')); //Get List
    list.count().then(function(icount){
        if (icount > 0) {
            console.log('Click List Record No. ' + ((listindex % icount)+1) + '/' + icount);
            list.get(listindex % icount).click().then(showfooter);

            var subTitle2 = element.all(by.css('[ng-show="subTitle"]'));
            subTitle2.count().then(function(list){
                if (list>0) {
                    console.log('Located SubTitle Name [ Editing ]');
                }
                else {
                    console.log('*** *** *** CANNOT Located SubTitle Name [ Editing ] !');
                }
            });
            expect(subTitle2.first().getText()).toEqual('Editing');

            var input = element.all(by.css('.col-md-6 input'));
            input.count().then(function(icount){
                console.log('Located ' +icount + ' Input Box(s)');
            });
            input.each(function (ele) {
                ele.isEnabled().then(function (isEnabled) {
                    if (isEnabled) {
                        ele.sendKeys(' (Valided by protractor)');
                    }
                });
            });
        }
        else {
            console.log('*** *** *** No Record(s) *** *** *** Found in the [ Listing ], Ignore [ Editing ] Checking.');
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
        describe('"Marketing" menu navigation', function () {
            var dropdown;
            beforeEach(function () {
                dropdown = element.all(by.repeater('item in modules')).get(1); //Get "Marketing"
                dropdown.click().then(showfooter);
            });
            var i;
            var testcount = browser.params.test.count;

            //for (i = 0; i < 0; i++) {
            for (i = 0; i < testcount; i++) {
                //http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                (function (testindex) {
                    it('Promotion', function () {
                        click_promotion(dropdown, 0, testindex); //0=Products Catalog
                    });
                })(i);
            }
        });
    }
});
