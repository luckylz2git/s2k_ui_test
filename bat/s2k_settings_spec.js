/**
 * Created by Lin.Zhi on 2014-10-23.
 */

//Print console.log with Date-Time Stamp
printLog = function(logText){
    var moment = require('moment');
    console.log('[' + moment().format('YYYY-MM-DDTHH:mm:ss.SSS[GMT]ZZ') + '] ' + logText);
};

logins2k = function(){
    var username = browser.params.login.usermail;
    var password = browser.params.login.password;
    browser.get('https://store.s2k.net/admin/#/login');//

    //comments element(by.model('selected')).clear().sendKeys('Test ["Settings"] Module');

    //element(by.model('user.email')).sendKeys('tsotest@s2k.net'); //直接输入用户名
    element(by.model('user.email')).sendKeys(username); //使用conf_test.js中的params.login.usermail
    element(by.model('user.email')).getAttribute('value').then(printLog);

    //element(by.model('user.password')).sendKeys('1234'); //直接输入用户名
    element(by.model('user.password')).sendKeys(password); //使用conf_test.js中的参数params.login.password
    element(by.model('user.password')).getAttribute('value').then(printLog);


    var btnLogin = element(by.buttonText('LOGIN'));
    btnLogin.click();//login
    //comments element(by.model('selected')).clear();
};

showfooter = function() {
    /*
     var tmp;
     element.all(by.tagName('footer')).each(function(ele){
     tmp=ele.getText();
     });
     */

    //element(by.model('selected')).getAttribute('value').then(console.log);
    //element(by.model('selected')).getAttribute('class').then(console.log);

    //expect(element(by.model('selected')).isDisplayed()).toBeTruthy();
    /* //comments element(by.model('selected')).isDisplayed().then(function(isVisible){
     if (isVisible !== true) {
     element(by.model('breadcrumbs.listingSearch')).isDisplayed().then(function(isVisible){
     if (isVisible !== true) {
     console.log('*** *** *** Search Box ISNOT Visible ! *** *** ***');
     }
     });
     }
     }); */
    element(by.css('footer')).isDisplayed().then(function(isVisible){
        if (isVisible !== true) {
            element(by.model('breadcrumbs.listingSearch')).isDisplayed().then(function(isVisible){
                if (isVisible !== true) {
                    console.log('*** *** *** Search Box ISNOT Visible ! *** *** ***');
                }
            });
        }
    });
    //    element(by.model('selected')).clear().sendKeys(tmp);
    //});
};

click_products_catalog = function(dropdown, menuindex, listindex){

    //console.log('\n********** Click List No. '+ (listindex+1) +' **********\n');
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(menuindex); //products catalog固定值0
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

    //added on 2014-11-11 click "new" button
    var clickButton=element(by.css('[ng-click="new()"]')); //Get New Button
    clickButton.getText().then(function(text){
        console.log('\nClick Button Name [ ' + text + ' ]');
    });
    expect(clickButton.getText()).toEqual('New');
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
            //subTitle.count().then(console.log);
            //subTitle2.each(function (ele) {
            //    subTitle2.count().then(console.log);
            //    ele.getText().then(console.log);
                //expect(ele.getText()).toEqual('Listing');

                //ele.getAttribute('class').then(console.log);
            //});
            expect(subTitle2.first().getText()).toEqual('Editing');

            var input = element.all(by.css('.col-md-6 input'));
            input.count().then(function(icount){
                console.log('Located ' +icount + ' Input Box(s)');
            });
            input.each(function (ele) {
                //ele.clear().sendKeys('Valided by protractor.');
                ele.sendKeys(' (Valided by protractor)');
            });
        }
        else {
            console.log('*** *** *** No Record(s) *** *** *** Found in the [ Listing ], Ignore [ Editing ] Checking.');
        }
    });
    //list.each(function(ele){
        //ele.getText().then(console.log);
    //});
};

click_advanced_search = function(dropdown, menuindex, listindex){

    //console.log('\n********** Click List No. '+ (listindex+1) +' **********\n');
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(menuindex); //products catalog固定值0
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

    //added on 2014-11-12 click "Advanced Search" button for "Products Catalog"
    dropdown.getText().then(function(text){
        console.log(text + ' ' + menuindex + ' ready to advanced search');
        if (text == "Products" && menuindex == 0) {
            var advSearch = element.all(by.css('[ng-click="modalSearch()"]')).first();
            advSearch.click();

            var mSelect = element(by.model('item.categoryid'));
            mSelect.element(by.css('input')).sendKeys('test to input filter').clear();

            element.all(by.css('.input-group-btn button')).first().click();

            var dList = element.all(by.css('[class="input-group-btn open"]')).all(by.css('li'));

            dList.count().then(function(icount){
                dList.get(listindex % icount).click();
            });

            element(by.css('[ng-click="ok()"]')).click().then(showfooter);

            //expect(element.all(by.repeater('item in items')).count()).toBeGreaterThan(0);
            expect(element.all(by.repeater('item in items')).count()).not.toBe(0);

            element(by.css('[ng-click="modalSearchReset()"]')).click();
        }
    });
};

click_pricebook = function(dropdown, listindex){
    //console.log('\n********** Click List No. '+ (listindex+1) +' **********\n');
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(1); //pricebook固定值
    menu.getText().then(function(menutext){
        console.log('\nClick Dropdown Menu [ '+ menutext +' ] Index:1');
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
    expect(subTitle1.first().getText()).toEqual('Listing');

    var list=element.all(by.repeater('item in items')); //Get List
    list.count().then(function(icount){
        if (icount > 0) {
            console.log('Click List Record No. ' + ((listindex % icount)+1) + '/' + icount);
            list.get(listindex % icount).click().then(showfooter); //点击单项

            /*
            var modaldialog = element.all(by.model('form'));
            modaldialog.each(function(ele) {
                console.log('form count: ');
                modaldialog.count().then(console.log);
                ele.getText().then(console.log);
                ele.getAttribute('class').then(console.log);
            });
            */

            //expect(modaldialog.first().getText()).toEqual('Editing');

            var input = element.all(by.css('.col-md-4 input'));
            input.count().then(console.log);
            input.each(function (ele) {
                //ele.clear().sendKeys('Valided by protractor.');
                ele.sendKeys(' (Valided by protractor)');
            });

            element(by.css('[ng-click="cancel()"]')).click(); //cancel click
        }
        else{
            console.log('*** *** *** No Record(s) *** *** *** Found in the [ Listing ], Ignore [ Editing ] Checking.');
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

    //added on 2014-11-11 click "new" button
    var clickButton=element(by.css('[ng-click="new()"]')); //Get New Button
    clickButton.getText().then(function(text){
        console.log('\nClick Button Name [ ' + text + ' ]');
    });
    expect(clickButton.getText()).toEqual('New');
    clickButton.click().then(showfooter);

    var newInput = element.all(by.css('.col-md-6 input'));
    newInput.count().then(function(icount){
        console.log('Located ' +icount + ' Input Box(s)');
    });
    newInput.each(function (ele) {
        //ele.clear().sendKeys('Valided by protractor.');
        ele.sendKeys(' (Valided by protractor)');
    });
};

click_pricebook_modify = function(dropdown, listindex){
    //console.log('\n********** Click List No. '+ (listindex+1) +' **********\n');
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(1); //pricebook固定值
    menu.getText().then(function(menutext){
        console.log('\nClick Dropdown Menu [ '+ menutext +' ] Index:1');
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
    expect(subTitle1.first().getText()).toEqual('Listing');

    var list=element.all(by.repeater('item in items')); //Get List
    list.count().then(function(icount){
        if (icount > 0) {
            console.log('Click List Record No. ' + ((listindex % icount)+1) + '/' + icount);

            //browser.actions().mouseMove(list.get(listindex % icount)).perform();
            //browser.actions().click(protractor.Button.LEFT).perform();
            //browser.actions().mouseMove(list.get(listindex % icount)).perform();
            //browser.actions().keyDown(protractor.Key.CONTROL).click().perform();
            //browser.actions().click().perform();

            //参考目录：selenium-webdriver / lib / webdriver/ key.js -> webdriver.Key，也可以在CONTROL字符上面，CTRL+CLICK可以找到。
            browser.actions().keyDown(protractor.Key.CONTROL).click(list.get(listindex % icount)).keyUp(protractor.Key.CONTROL).perform();

            //list.get(listindex % icount).click();
            list.get(listindex % icount).click().then(showfooter); //点击单项
TODO:
            //expect(modaldialog.first().getText()).toEqual('Editing');

            var input = element.all(by.css('.col-md-4 input'));
            input.count().then(console.log);
            input.each(function (ele) {
                //ele.clear().sendKeys('Valided by protractor.');
                ele.sendKeys(' (Valided by protractor)');
            });

            element(by.css('[ng-click="cancel()"]')).click(); //cancel click
        }
        else{
            console.log('*** *** *** No Record(s) *** *** *** Found in the [ Listing ], Ignore [ Editing ] Checking.');
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

    //added on 2014-11-11 click "new" button
    var clickButton=element(by.css('[ng-click="new()"]')); //Get New Button
    clickButton.getText().then(function(text){
        console.log('\nClick Button Name [ ' + text + ' ]');
    });
    expect(clickButton.getText()).toEqual('New');
    clickButton.click().then(showfooter);

    var newInput = element.all(by.css('.col-md-6 input'));
    newInput.count().then(function(icount){
        console.log('Located ' +icount + ' Input Box(s)');
    });
    newInput.each(function (ele) {
        //ele.clear().sendKeys('Valided by protractor.');
        ele.sendKeys(' (Valided by protractor)');
    });
};

click_fuel_grade = function(dropdown, menuindex, listindex){
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
            clickButton.click().then(showfooter);
            break;
        default:
            break;
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
        clickButton.getAttribute('disabled').then(function(value){
            if (value)
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

                newInput.each(function (ele) {
                    //ele.clear().sendKeys('Valided by protractor.');
                    ele.sendKeys(' (Valided by protractor)');
                });
                newInput.count().then(function (icount) {
                    console.log('Located ' + icount + ' Input Box(s)');
                    if (icount > 0) {
                        newInput.first().sendKeys(' ');
                    }
                });

                clickButton = element(by.css('[ng-click="backToList()"]'));
                clickButton.getText().then(function (text) {
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
};

click_logs = function(dropdown, menuindex, listindex){
    //console.log('\n********** Click List No. '+ (listindex+1) +' **********\n');
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(menuindex); //pricebook固定值
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
    //subTitle1.each(function(ele){
        //subTitle.count().then(console.log);
        //ele.getText().then(console.log);
        //expect(ele.getText()).toEqual('Listing');

        //ele.getAttribute('class').then(console.log);
    //});
    expect(subTitle1.first().getText()).toEqual('History');

    var list=element.all(by.repeater('item in items')); //Get List
    list.count().then(function(icount){
        if (icount > 0) {
            console.log('Click History Record No. ' + ((listindex % icount) + 1) + '/' + icount);
            list.get(listindex % icount).click().then(showfooter); //点击单项

            var modaldialog = element.all(by.model('form'));
            modaldialog.each(function (ele) {
                //console.log('form count: ');
                var subcount=modaldialog.count();//.then(console.log);
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

click_report = function(dropdown, menuindex, listindex){
    //console.log('\n********** Click List No. '+ (listindex+1) +' **********\n');
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(menuindex); //products catalog固定值0
    menu.getText().then(function(menutext){
        console.log('\nClick Dropdown Menu [ '+ menutext +' ] Index:' + menuindex);
    });
    menu.click().then(showfooter);
    //element(by.css('[placeholder="Search"]')).sendKeys('Search Box Visible');

    var subTitle1 = element.all(by.css('[ng-show="subTitle"]'));
    subTitle1.count().then(function(list){
        if (list>0) {
            console.log('Located SubTitle Name [ Dashboard ]');
        }
        else {
            console.log('*** *** *** CANNOT Located SubTitle Name [ Dashboard ] !');
        }
    });
    //subTitle1.each(function(ele){
        //subTitle.count().then(console.log);
        //ele.getText().then(console.log);
        //expect(ele.getText()).toEqual('Listing');

        //ele.getAttribute('class').then(console.log);
    //});
    expect(subTitle1.first().getText()).toEqual('Dashboard');

    var list=element.all(by.tagName('svg')); //Get List
    //list.count().then(console.log);
    list.count().then(function(icount){
        console.log('Click List Record No. ' + ((listindex % icount)+1) + '/' + icount);
        list.get(listindex % icount).click().then(showfooter);
    });
    //list.each(function(ele){
        //ele.getAttribute('id').then(console.log);
    //    var tmp=ele.getAttribute('width');//.then(console.log);
    //});
    //list.get(0).getAttribute('id').then(console.log);
    //list.get(listindex % 2).click().then(showfooter);
    //console.log('Click Monthly Performance');
    //element(by.css('[placeholder="Search"]')).sendKeys('Search Box Visible');
};

//******************************************************************************************
//******************************************************************************************
//测试开始
//******************************************************************************************
//******************************************************************************************
describe("s2k login page", function() {
    it("login to system", logins2k);
    if (true) {
        describe('"Settings" menu navigation', function () {
            var dropdown;
            beforeEach(function () {
                dropdown = element.all(by.repeater('item in modules')).get(4); //Get "Settings"
                dropdown.click().then(showfooter);
            });
            var i, j;
            var testcount = browser.params.test.count;
            var listname = '';
            //for (j = 0; j < 14; j++) {
            for (j = 0; j < 7; j++) {
                switch (j) {
                    case 0:
                        listname = 'Users'; //'Accounts';
                        break;
                    case 1:
                        listname = 'User Roles'; //'Users';
                        break;
                    case 2:
                        listname = 'Payment method'; //'User Roles';
                        break;
                    case 3:
                        listname = 'Fuel Tank Types'; //'loyalty Programs';
                        break;
                    case 4:
                        listname = 'POS Terminals'; //'Payment method';
                        break;
                    case 5:
                        listname = 'S2K Devices';
                        break;
                    case 6:
                        listname = 'Cutover Store Definition';
                        break;
                    case 7:
                        listname = 'SFTP Maintenance';
                        break;
                    case 8:
                        listname = 'Online Documentation';
                        break;
                    /*
                    case 5:
                        listname = 'Credit Card Gateways';
                        break;
                    case 6:
                        listname = 'Shipping Methods';
                        break;
                    case 7:
                        listname = 'Fuel Tank Types';
                        break;
                    case 8:
                        listname = 'POS Cashiers';
                        break;
                    case 9:
                        listname = 'POS Terminals';
                        break;
                    case 10:
                        listname = 'Countries';
                        break;
                    case 11:
                        listname = 'States';
                        break;
                    case 12:
                        listname = 'Site Pages';
                        break;
                    case 13:
                        listname = 'Site Navigations';
                        break;
                    */
                    default:
                        listname = '';
                        break;
                }
                //for (i = 0; i < 0; i++) {
                for (i = 0; i < testcount; i++) {
                    //闭包函数参考：http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                    (function (menuindex, testindex) {
                        it(listname, function () {
                            click_store(dropdown, menuindex, testindex); //0=Accounts
                        });
                    })(j, i);
                }
            }
        });
    }
});
