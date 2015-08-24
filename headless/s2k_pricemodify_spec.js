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

click_pricebook_modify = function(dropdown, listindex){
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(1); //pricebook
    menu.getText().then(function(menutext){
        printLog('Click Dropdown Menu [ '+ menutext +' ] Index:1');
    });
    menu.click();
    browser.driver.sleep(1);
    browser.waitForAngular();
    showfooter;

    var bFindTitle = false;
    for (var j = 0; j < 30; j++) {
        (function (index) {
            if (bFindTitle) {
                return true;
            }
            browser.sleep(1000);
            var subTitle1 = element.all(by.css('[ng-show="subTitle"]'));
            subTitle1.count().then(function(list){
                if (list>0) {
                    printLog('Located SubTitle Name [ Listing ]');
                    bFindTitle = true;
                    return true;
                }
                else {
                    printLog('*** *** *** CANNOT Located SubTitle Name [ Listing ] !');
                    return bFindTitle;
                }
            });
        })(j)
    }

    if (!bFindTitle) {
        var subTitle1 = element.all(by.css('[ng-show="subTitle"]'));
        subTitle1.count().then(function (list) {
            if (list > 0) {
                printLog('Located SubTitle Name [ Listing ]');
                bFindTitle = true;
            }
            else {
                printLog('*** *** *** CANNOT Located SubTitle Name [ Listing ] !');
            }
        });
    }
    if (bFindTitle) {
        expect(element.all(by.css('[ng-show="subTitle"]')).first().getText()).toEqual('Listing');
    }

    var list = element.all(by.repeater('item in items')); //Get List
    list.count().then(function(icount){
        if (icount > 0) {
            printLog('Get List Count: ' + icount);
            var perpagecount = '30';
            var perpage = element.all(by.css('[class="col-md-3 sg-footer"]')).first();
            perpage.click().then(function(){
                element.all(by.css('[type="number"]')).first().clear().sendKeys(perpagecount);
                element.all(by.css('[class="editable-buttons"]')).click();
            });
        }
    });

    var found = false, check = 0, ireturn = -1;
    list.count().then(function(icount) {
        printLog('Searching for Retail == SRP from list count: ' + icount);
        for (var i = 0; i < icount; i++) {
            (function (ilcount) {
                var iPrice = list.get(ilcount).all(by.css('.col-sg-2'));
                iPrice.count().then(function (ipcount) {
                    iPrice.get(0).getText().then(function (iretail) {
                        iPrice.get(1).getText().then(function (isrp) {
                            if (iretail == isrp && check <= listindex) {
                                found = true;
                                check++;
                                ireturn = ilcount;
                            }
                        });
                    });
                });
            })(i);
        }
    }).then(function(){
        printLog('Found Retail == SRP : ' + found + ' Records No. : ' + check + ' List-Index :' + ireturn);
        return ireturn;
    }).then(function(iselect) {
        if (iselect >= 0) {
            var sname, sbarcode, iretail, isrp;
            //var iselect = 6 + listindex;
            list.get(iselect).all(by.css('.col-sg-5')).get(0).getText().then(function (text) { //get Name
                sname = text;
            }).then(function () {
                list.get(iselect).all(by.css('.col-sg-2')).get(1).getText().then(function (text) { //get Barcode
                    sbarcode = text;
                });
            }).then(function () {
                list.get(iselect).all(by.css('.col-sg-2')).get(0).getText().then(function (text) { //get Retail
                    iretail = text.replace('$', '');
                });
            }).then(function () {
                list.get(iselect).all(by.css('.col-sg-2')).get(1).getText().then(function (text) { //get SRP
                    isrp = text.replace('$', '');
                });
            }).then(function () {
                printLog('Name: ' + sname + ' Barcode: ' + sbarcode + ' Retail: ' + iretail + ' SRP: ' + isrp);
            }).then(function () {
                list.get(iselect).click().then(showfooter);
            }).then(function () {
                var input = element(by.model('item.retail'));
                input.getAttribute('value').then(function (text) { //check Retail
                    printLog('Line Retail Price: ' + text);
                    expect(Number(text)).toBe(Number(iretail));
                }).then(function () {
                    printLog('Add Price: 0.01');
                    input.clear().sendKeys(String(Number(iretail) + 0.01));
                });
            }).then(function () {
                element(by.css('[ng-click="ok()"]')).click().then(showfooter); //Submit Retail change
            }).then(function () {
                list.get(iselect).click().then(showfooter);
            }).then(function () {
                var input = element(by.model('item.retail'));
                input.getAttribute('value').then(function (newretail) {
                    printLog('New Retail Price: ' + newretail);
                    expect(Number(newretail)).toBe(Number(iretail) + 0.01); //Verify Retail Change
                });
            }).then(function () {
                element(by.css('[ng-click="cancel()"]')).click().then(showfooter); //Go back to list
            }).then(function () {
                browser.actions().keyDown(protractor.Key.CONTROL).click(list.get(iselect)).keyUp(protractor.Key.CONTROL).perform(); //CTRL+Click
            }).then(function () {
                browser.executeScript('window.scrollTo(0,0)');
                element(by.css('[ng-click="suggested()"]')).click().then(showfooter);
            }).then(function () {
                printLog('Choose Change Type: (+)Add and Update');
                element.all(by.model('item.updateType')).filter(function (ele) {
                    return ele.getAttribute('value').then(function (value) { //RETURN the whole get value function
                        return value === "1"; //RETURN true OR false
                    });
                }).click().then(showfooter);
            }).then(function () {
                element(by.css('[ng-click="ok()"]')).click().then(function () { //Retail Reset to SRP
                    browser.sleep(1000); //wait for alert to show
                    browser.switchTo().alert().accept();
                }).then(showfooter);
            }).then(function () {
                list.get(iselect).all(by.css('.col-sg-2')).get(0).getText().then(function (text) { //Verify Retail & SRP
                    printLog('Retail Reset to SRP: ' + text);
                    expect(Number(text.replace('$', ''))).toBe(Number(isrp));
                });
            });
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
        describe('"Pricebook" modification', function () {
            var dropdown;
            beforeEach(function () {
                dropdown = element.all(by.repeater('item in modules')).get(0); //Get "Products"
                dropdown.click().then(showfooter);
            });
            var i;
            var testcount = browser.params.test.count;
            for (i = 0; i < testcount; i++) {
                //http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                (function (testindex) {
                    it('Pricebook', function () {
                        click_pricebook_modify(dropdown, testindex); //0=products catalog; 1=pricebooks
                    });
                })(i);
            }
        });
    }
});
