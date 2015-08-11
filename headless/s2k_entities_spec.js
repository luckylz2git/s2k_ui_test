/**
 * Created by Lin.Zhi on 2015-08-11.
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

click_tax_authority = function(dropdown, menuindex, listindex){
    //console.log('\n********** Click List No. '+ (listindex+1) +' **********\n');
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(menuindex); //products catalog固定值0
    menu.getText().then(function(menutext){
        console.log('\nClick Dropdown Menu [ '+ menutext +' ] Index:' + menuindex);
    });
    menu.click().then(showfooter);

    var subTitle1 = element.all(by.css('[ng-show="subTitle"]'));
    subTitle1.count().then(function(list){
        if (list>0) {
            console.log('Located SubTitle Name [ Listing ]');
        }
        else {
            console.log('*** *** *** CANNOT Located SubTitle Name [ Listing ] !');
        }
    });
    //subTitle1.each(function(ele){
        //subTitle.count().then(console.log);
        //ele.getText().then(console.log);
        //expect(ele.getText()).toEqual('Listing');

        //ele.getAttribute('class').then(console.log);
    //});
    expect(subTitle1.first().getText()).toEqual('Listing');

    //added on 2014-11-11 click "new" button
    var clickButton=element(by.css('[ng-click="new()"]')); //Get New Button
    clickButton.getText().then(function(text){
        console.log('\nClick Button Name [ ' + text + ' ]');
    });
    expect(clickButton.getText()).toEqual('New');
    clickButton.getAttribute('disabled').then(function(value){
        if (value) //Check New Button Enabled
        {
            printLog('Button [New] is Disabled !');
        }
        else
        {
            clickButton.click().then(showfooter);

            var newInput;
            switch(menuindex) {
                //fuel grades
                case 1:case 2:case 3:
                newInput = element.all(by.css('.col-md-8 input'));
                newInput.count().then(function(icount){
                    console.log('Located ' +icount + ' Input Box(s)');
                });
                newInput.each(function (ele) {
                    //ele.clear().sendKeys('Valided by protractor.');
                    ele.sendKeys(' (Valided by protractor)');
                });

                clickButton=element(by.css('[ng-click="backToList()"]'));
                clickButton.getText().then(function(text){
                    console.log('Go Back To [ ' + text + ' ] Page\n');
                });
                expect(clickButton.getText()).toEqual('Listing');
                browser.executeScript('window.scrollTo(0,0)');
                clickButton.click().then(showfooter);
                break;
                //fuel tanks
                case 4:
                    newInput = element.all(by.css('.col-md-4 select'));
                    newInput.count().then(function(icount){
                        console.log('*** ***\nLocated ' +icount + ' Select List(s)\n*** ***');
                    });
                    newInput.each(function (ele) {
                        //ele.getAttribute('name').then(console.log);
                        ele.all(by.tagName('option')).last().click();
                    });

                    clickButton=element(by.css('[ng-click="backToList()"]'));
                    clickButton.getText().then(function(text){
                        console.log('Go Back To [ ' + text + ' ] Page\n');
                    });
                    expect(clickButton.getText()).toEqual('Listing');
                    browser.executeScript('window.scrollTo(0,0)');
                    clickButton.click().then(showfooter);
                    break;
                //fuel blends
                case 5:
                    newInput = element.all(by.css('.col-md-4 input'));
                    newInput.count().then(function(icount){
                        console.log('Located ' +icount + ' Input Box(s)');
                    });
                    newInput.each(function (ele) {
                        //ele.clear().sendKeys('Valided by protractor.');
                        ele.sendKeys(' (Valided by protractor)');
                    });

                    clickButton=element(by.css('[ng-click="backToList()"]'));
                    clickButton.getText().then(function(text){
                        console.log('Go Back To [ ' + text + ' ] Page\n');
                    });
                    expect(clickButton.getText()).toEqual('Listing');
                    browser.executeScript('window.scrollTo(0,0)');
                    clickButton.click().then(showfooter);
                    break;
                default:
                    break;
            }
        }
    });

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

    var list=element.all(by.repeater('item in items')); //Get List
    list.count().then(function(icount){
        if (icount > 0) {
            console.log('Click List Record No. ' + ((listindex % icount) + 1) + '/' + icount);
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
            //subTitle.count().then(console.log);
            //subTitle2.each(function (ele) {
            //    subTitle2.count().then(console.log);
            //    ele.getText().then(console.log);
            //expect(ele.getText()).toEqual('Listing');

            //ele.getAttribute('class').then(console.log);
            //});
            expect(subTitle2.first().getText()).toEqual('Editing');

            var input = element.all(by.css('.col-md-8 input'));
            input.count().then(function(icount){
                console.log('Located ' +icount + ' Input Box(s)');
            });
            input.each(function (ele) {
                //ele.clear().sendKeys('Valided by protractor.');
                ele.sendKeys(' (Valided by protractor)');
            });
        }
        else{
            console.log('*** *** *** No Record(s) *** *** *** Found in the [ Listing ], Ignore [ Editing ] Checking.');
        }
    });
    browser.executeScript('window.scrollTo(0,0)');
};

click_store = function(dropdown, menuindex, listindex){
    //console.log('\n********** Click List No. '+ (listindex+1) +' **********\n');
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(menuindex); //products catalog固定值0
    menu.getText().then(function(menutext){
        console.log('\nClick Dropdown Menu [ '+ menutext +' ] Index:' + menuindex);
    });
    menu.click().then(showfooter);

    var subTitle1 = element.all(by.css('[ng-show="subTitle"]'));
    subTitle1.count().then(function(list){
        if (list>0) {
            console.log('Located SubTitle Name [ Listing ]');
        }
        else {
            console.log('*** *** *** CANNOT Located SubTitle Name [ Listing ] !');
        }
    });
    //subTitle1.each(function(ele){
        //subTitle.count().then(console.log);
        //ele.getText().then(console.log);
        //expect(ele.getText()).toEqual('Listing');

        //ele.getAttribute('class').then(console.log);
    //});
    expect(subTitle1.first().getText()).toEqual('Listing');

    //added on 2014-11-11 click "new" button

    if (menuindex != 6 && menuindex != 13) {
        var clickButton=element(by.css('[ng-click="new()"]')); //Get New Button
        clickButton.getText().then(function(text){
            console.log('\nClick Button Name [ ' + text + ' ]');
        });
        expect(clickButton.getText()).toEqual('New');
        clickButton.getAttribute("disabled").then(function(value){
            if (value) //Check New Button Enabled
            {
                printLog('Button [New] is Disabled !');
            }
            else
            {
                clickButton.click().then(showfooter);
                var newInput;
                if (menuindex == 12) {
                    newInput = element.all(by.css('.col-md-8 input'));
                } else {
                    newInput = element.all(by.css('.col-md-4 input'));
                }

                newInput.count().then(function (icount) {
                    console.log('Located ' + icount + ' Input Box(s)');
                });
                newInput.each(function (ele) {
                    //ele.clear().sendKeys('Valided by protractor.');
                    ele.sendKeys(' (Valided by protractor)');
                });
                clickButton = element(by.css('[ng-click="backToList()"]'));
                clickButton.getText().then(function (text) {
                    console.log('Go Back To [ ' + text + ' ] Page\n');
                });
                expect(clickButton.getText()).toEqual('Listing');
                //browser.executeScript("arguments[0].scrollIntoView(true);", clickButton);
                browser.executeScript('window.scrollTo(0,0)');
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
    }

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

    var list=element.all(by.repeater('item in items')); //Get List
    list.count().then(function(icount){
        if (icount > 0) {
            console.log('Click List Record No. ' + ((listindex % icount) + 1) + '/' + icount);
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

            var input = element.all(by.css('.col-md-4 input'));
            input.count().then(function(icount){
                console.log('Located ' +icount + ' Input Box(s)');
            });
            input.each(function (ele) {
                //ele.clear().sendKeys('Valided by protractor.');
                ele.sendKeys(' (Valided by protractor)');
            });
        }
        else{
            console.log('*** *** *** No Record(s) *** *** *** Found in the [ Listing ], Ignore [ Editing ] Checking.');
        }
    });
    browser.executeScript('window.scrollTo(0,0)');
};

//******************************************************************************************
//******************************************************************************************
//Test Start
//******************************************************************************************
//******************************************************************************************
describe("s2k login page", function() {
    it("login to system", logins2k);
    if (true) {
        describe('"Entities" menu navigation', function () {
            var dropdown;
            beforeEach(function () {
                dropdown = element.all(by.repeater('item in modules')).get(2); //Get "Entities"
                dropdown.click().then(showfooter);
            });
            var i;
            var testcount = browser.params.test.count;

            //for (i = 0; i < 0; i++) {
            for (i = 0; i < testcount; i++) {
                //Ref：http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                (function (testindex) {
                    it('Store', function () {
                        click_store(dropdown, 0, testindex); //0=Store
                    });
                })(i);
            }

            for (i = 0; i < testcount; i++) {
                //Ref：http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                (function (testindex) {
                    it('Tax Authority', function () {
                        click_tax_authority(dropdown, 1, testindex); //3=Tax Authority
                    });
                })(i);
            }
        });
    }
});
