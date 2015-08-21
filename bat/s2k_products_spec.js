/**
 * Created by Lin.Zhi on 2014-10-23.
 */

/**
 * Get barcode info. from [Products Catalog] to [Quick Add/Change Product]
 * Should be run function [click_products_catalog] first, then run [click_product_quick_add]
 * Structure:
 * aBarcode[i] = {name: '', barcode = '', shortname = ''};
 */
var bGetBarcode = false; //run click_products_catalog to get barcode, only run once
var aBarcode = [];
//Print console.log with Date-Time Stamp
printLog = function(logText){
    var moment = require('moment');
    console.log('[' + moment().format('YYYY-MM-DDTHH:mm:ss.SSS[GMT]ZZ') + '] ' + logText);
};

logins2k = function(){
    var username = browser.params.login.usermail;
    var password = browser.params.login.password;
    browser.get('https://store.s2k.net/admin/#/login');//browser.get('http://tsotest.s2k.net/admin/#/login');//

    //comments element(by.model('selected')).clear().sendKeys('Test ["Products"] Module');

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
    var dropdowntext = '';
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(menuindex); //products catalog固定值0
    menu.getText().then(function(menutext){
        console.log('\nClick Dropdown Menu [ '+ menutext +' ] Index:' + menuindex);
    });
    menu.click().then(showfooter);

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

    //added on 2014-11-11 click "new" button
    var clickButton=element(by.css('[ng-click="new()"]')); //Get New Button
    clickButton.getText().then(function(text){
        console.log('\nClick Button Name [ ' + text + ' ]');
    });
    expect(clickButton.getText()).toEqual('New');
    browser.executeScript('window.scrollTo(0,0)');
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
                dropdowntext = text;
                if (text == 'Marketing' && menuindex == 1) { //Marketing -> Advertizement Items
                    newInput = element.all(by.css('.col-md-4 input'));
                } else if(text == 'Products' && menuindex == browser.params.menuindex.products.idxTaxRates) { //Products -> Tax Rates
                    newInput = element.all(by.css('.col-md-2 input'));
                } else {
                    newInput = element.all(by.css('.col-md-6 input'));
                }
                newInput.count().then(function(icount){
                    console.log('Located ' +icount + ' Input Box(s)');
                });
                newInput.each(function(ele) {
                    ele.isDisplayed().then(function(isVisible){
                        if (isVisible) {
                            ele.sendKeys(' (Valided by protractor)');
                        }
                    });
                });
                /*
                 element.all(by.css('[ng-click="backToList()"]')).count().then(function(icount){
                 console.log('found back to list buttons: ' + icount);
                 });
                 element(by.css('[ng-click="backToList()"]')).getText().then(function(text){
                 console.log('Go Back To [ ' + text + ' ] Page\n');
                 expect(text).toEqual('Listing');
                 });
                 */
                //.click().then(showfooter);
            }).then(function(){
                element(by.css('[ng-click="backToList()"]')).click().then(showfooter).then(function(){
                    console.log('Go Back To [ Listing ] Page\n');
                    expect(subTitle1.first().getText()).toEqual('Listing');
                });
            });

            //subTitle1 = element.all(by.css('[ng-show="subTitle"]'));
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

            list.get((icount - listindex - 1) % icount).click().then(showfooter);

            //var subTitle2 = element.all(by.css('[ng-show="subTitle"]'));
            subTitle1.count().then(function(list){
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
            expect(subTitle1.first().getText()).toEqual('Editing');

            if (dropdowntext == 'Products' && menuindex == browser.params.menuindex.products.idxProducts) { //Products -> Products Catalog
                //get product name/barcode/shortname
                var sname = '', sbarcode = '';
                element(by.model('item.name')).getAttribute('value').then(function (value) {
                    sname = value;
                }).then(function () {
                    element(by.model('item.itemvar.upc')).getAttribute('value').then(function (value) {
                        sbarcode = value;
                    });
                }).then(function () {
                    element(by.model('item.itemvar.shortname')).getAttribute('value').then(function (shortnamevalue) {
                        aBarcode[listindex] = {name: sname, barcode: sbarcode, shortname: shortnamevalue};
                    });
                });
            }

            var input = element.all(by.css('.col-md-6 input'));
            input.count().then(function(icount){
                console.log('Located ' +icount + ' Input Box(s)');
            });
            input.each(function (ele) {
                ele.isDisplayed().then(function(isVisible){
                    if (isVisible) {
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

click_product_quick_add = function(dropdown, menuindex, listindex){
    //console.log('\n********** Click List No. '+ (listindex+1) +' **********\n');
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(menuindex); //products catalog固定值0
    menu.getText().then(function(menutext){
        console.log('\nClick Dropdown Menu [ '+ menutext +' ] Index:' + menuindex);
    });
    menu.click().then(showfooter);

    var subTitle1 = element.all(by.css('[ng-show="subTitle"]'));
    subTitle1.count().then(function(list){
        if (list>0) {
            console.log('Located ' + list + ' SubTitle Name [ Item ]');
        }
        else {
            console.log('*** *** *** CANNOT Located SubTitle Name [ Item ] !');
        }
    });
    expect(subTitle1.first().getText()).toEqual('Item');

    var newInput = element(by.model('item.upc'));
    var searchButton = element(by.css('[ng-click="search()"]'));
    newInput.clear().sendKeys('00000000000000').then(function() {
        searchButton.click().then(function() {
            element.all(by.css('.col-md-6 input')).each(function(ele) {
                ele.isDisplayed().then(function(isVisible){
                    if (isVisible) {
                        ele.sendKeys('(Valided by protractor)');
                    }
                });
            });
        });
    }).then(function() {
        element(by.css('[ng-click="reset()"]')).click();
    }).then(function() {
        if (aBarcode.length > 0) {
            if (listindex > aBarcode.length) {
                listindex = aBarcode.length - 1;
            }
            newInput.sendKeys(aBarcode[listindex].barcode).then(function() {
                printLog('Search Product for Barcode : ' + aBarcode[listindex].barcode);
                searchButton.click().then(function() {
                    element(by.model('item.product.name')).getAttribute('value').then(function(value) {
                        printLog('Get Product Name : ' + value);
                    });
                    element(by.model('item.productvar.shortname')).getAttribute('value').then(function(value) {
                        printLog('Get Product Shortname : ' + value);
                    });
                    expect(element(by.model('item.product.name')).getAttribute('value')).toEqual(aBarcode[listindex].name);
                    expect(element(by.model('item.productvar.shortname')).getAttribute('value')).toEqual(aBarcode[listindex].shortname);
                });
            }).then(function() {
                element(by.css('[ng-click="reset()"]')).click();
            });
        }
    });
};

click_advanced_search = function(dropdown, menuindex, listindex){

    //console.log('\n********** Click List No. '+ (listindex+1) +' **********\n');
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(menuindex); //products catalog固定值0
    menu.getText().then(function(menutext){
        console.log('\nClick Dropdown Menu [ '+ menutext +' ] Index:' + menuindex);
    });
    menu.click().then(showfooter);
    browser.driver.sleep(1);
    browser.waitForAngular();

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
        if (text == "Products" && menuindex == browser.params.menuindex.products.idxProducts) {
            var advSearch = element.all(by.css('[ng-click="modalSearch()"]')).first();
            advSearch.click();

            var mSelect = element(by.model('item.categoryid'));
            //browser.executeScript('window.scrollTo(0,0)');

            //Activate dropdown list
            mSelect.element(by.css('input')).sendKeys(' ').clear();

            mSelect.element(by.css('input')).click().then(function () {
                //var dList = element.all(by.className('ui-select-choices-row ng-scope'));
                var dList = mSelect.element(by.className('ui-select-choices-group')).all(by.css('[class="ui-select-choices-row-inner"]'));
                dList.count().then(function (icount) {
                    console.log('Department List : ' + icount + ' record(s).');
                    dList.get(listindex % icount).then(function (ele) {
                        //ele.element(by.css('div')).getText().then(console.log);
                        //ele.element(by.css('div')).click();
                        console.log('try to read href');
                        ele.getAttribute('href').then(console.log);
                        //ele.element(by.css('[class="ng-binding ng-scope"]')).getText().then(console.log);
                        //ele.element(by.css('[class="ng-binding ng-scope"]')).click();
                    });
                });
            });

            element(by.css('[ng-click="ok()"]')).click().then(showfooter);

            expect(element.all(by.repeater('item in items')).count()).not.toBe(0);

            element(by.css('[ng-click="modalSearchReset()"]')).click();
        }
    });
};

click_pricebook = function(dropdown, menuindex, listindex){
    //console.log('\n********** Click List No. '+ (listindex+1) +' **********\n');
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(menuindex); //pricebook固定值
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
                ele.isDisplayed().then(function(isVisible){
                    if (isVisible) {
                        ele.sendKeys(' (Valided by protractor)');
                    }
                });
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
    browser.executeScript('window.scrollTo(0,0)');
    clickButton.getAttribute('disabled').then(function(value){
        if (value)
        {
            printLog('Button [New] is Disabled !');
        }
        else
        {
            clickButton.click().then(showfooter);

            var newInput = element.all(by.css('.col-md-6 input'));
            newInput.count().then(function(icount){
                console.log('Located ' +icount + ' Input Box(s)');
            });
            newInput.each(function (ele) {
                ele.isDisplayed().then(function(isVisible){
                    if (isVisible) {
                        ele.sendKeys(' (Valided by protractor)');
                    }
                });
            });
        }
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
    browser.executeScript('window.scrollTo(0,0)');
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

click_upc_assembly = function(dropdown, menuindex,listindex){
    browser.executeScript('window.scrollTo(0,0)');
    //console.log('\n********** Click List No. '+ (listindex+1) +' **********\n');
    var menu=dropdown.all(by.css('[ng-click="go(link.link)"]')).get(menuindex); //upc_assembly固定值
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

            //This is a bug in s2k.net, pops up 2 windows
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

            var input = element.all(by.css('.col-md-8 input'));
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
    var clickButton=element(by.css('[ng-click="editAssembly()"]')); //Get New Button
    clickButton.getText().then(function(text){
        console.log('\nClick Button Name [ ' + text + ' ]');
    });
    expect(clickButton.getText()).toEqual('New');
    browser.executeScript('window.scrollTo(0,0)');
    clickButton.getAttribute('disabled').then(function(value){
        if (value)
        {
            printLog('Button [New] is Disabled !');
        }
        else
        {
            clickButton.click().then(showfooter);

            var newInput = element.all(by.css('.col-md-8 input'));
            newInput.count().then(function(icount){
                console.log('Located ' +icount + ' Input Box(s)');
            });
            newInput.each(function (ele) {
                //ele.clear().sendKeys('Valided by protractor.');
                ele.sendKeys(' (Valided by protractor)');
            });
            //element.all(by.css('.col-md-2 input')).first().clear().sendKeys('1');
            element(by.css('[ng-click="cancel()"]')).click(); //cancel click
        }
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
    browser.executeScript('window.scrollTo(0,0)');
    clickButton.getAttribute('disabled').then(function(value){
        if (value)
        {
            printLog('Button [New] is Disabled !');
        }
        else
        {
            clickButton.click().then(showfooter);

            var newInput;
            switch(menuindex) {
                case 1:case 2:case 3:
                newInput = element.all(by.css('.col-md-8 input'));
                newInput.count().then(function(icount){
                    console.log('Located ' +icount + ' Input Box(s)');
                });
                newInput.each(function (ele) {
                    ele.isDisplayed().then(function(isVisible){
                        if (isVisible) {
                            ele.sendKeys(' (Valided by protractor)');
                        }
                    });
                });

                clickButton=element(by.css('[ng-click="backToList()"]'));
                clickButton.getText().then(function(text){
                    console.log('Go Back To [ ' + text + ' ] Page\n');
                });
                expect(clickButton.getText()).toEqual('Listing');
                browser.executeScript('window.scrollTo(0,0)');
                clickButton.click().then(showfooter);
                break;
                //fuel grades
                case browser.params.menuindex.products.idxFuelGrades:
                    newInput = element.all(by.css('.col-md-8 input'));
                    newInput.count().then(function(icount){
                        console.log('Located ' +icount + ' Input Box(s)');
                    });
                    newInput.each(function (ele) {
                        ele.isDisplayed().then(function(isVisible){
                            if (isVisible) {
                                ele.sendKeys(' (Valided by protractor)');
                            }
                        });
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
                case browser.params.menuindex.products.idxFuelTanks: //4
                    newInput = element.all(by.css('.col-md-4 select'));
                    newInput.count().then(function(icount){
                        console.log('*** ***\nLocated ' +icount + ' Select List(s)\n*** ***');
                    });
                    newInput.each(function (ele) {
                        ele.isDisplayed().then(function(isVisible){
                            if (isVisible) {
                                ele.sendKeys(' (Valided by protractor)');
                            }
                        });
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
                case browser.params.menuindex.products.idxFuelBlends: //5
                    newInput = element.all(by.css('.col-md-4 input'));
                    newInput.count().then(function(icount){
                        console.log('Located ' +icount + ' Input Box(s)');
                    });
                    newInput.each(function (ele) {
                        ele.isDisplayed().then(function(isVisible){
                            if (isVisible) {
                                ele.sendKeys(' (Valided by protractor)');
                            }
                        });
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
                ele.isDisplayed().then(function(isVisible){
                    if (isVisible) {
                        ele.sendKeys(' (Valided by protractor)');
                    }
                });
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
        browser.executeScript('window.scrollTo(0,0)');
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
    var topMenu = browser.params.menuindex.products.index;
    it("login to system", logins2k);

    if (false) {
        describe('"Products" menu navigation', function () {
            var dropdown;
            beforeEach(function () {
                dropdown = element.all(by.repeater('item in modules')).get(topMenu); //Get "Products"
                dropdown.click().then(showfooter);
            });
            var i;
            var testcount = browser.params.test.count;

            //for (i = 0; i < 0; i++) {
            for (i = 0; i < testcount; i++) {
                //闭包函数参考：http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                (function (testindex) {
                    it('Products Catalog', function () {
                        click_products_catalog(dropdown, browser.params.menuindex.products.idxProducts, testindex); //0=Products Catalog
                    });
                })(i);
            }

            for (i = 0; i < testcount; i++) {
                (function (testindex) {
                    it('Products Advance Search', function () {
                        click_advanced_search(dropdown, browser.params.menuindex.products.idxProducts, testindex); //0=Products Catalog
                    });
                })(i);
            }

            //for (i = 0; i < 0 ; i++) {
            for (i = 0; i < testcount; i++) {
                //闭包函数参考：http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                (function (testindex) {
                    it('Pricebook', function () {
                        //click_products_catalog(dropdown, testindex); //0=products catalog; 1=Pricebook
                        click_pricebook(dropdown, browser.params.menuindex.products.idxPricebook, testindex); //0=products catalog; 1=pricebooks
                    });
                })(i);
            }

            for (i = 0; i < testcount; i++) {
                (function (testindex) {
                    it('Quick Add\/Change Product', function () {
                        click_product_quick_add(dropdown, browser.params.menuindex.products.idxQuickAdd, testindex); //0=Products Catalog
                    });
                })(i);
            }

            //for (i = 0; i < 0; i++) {
            for (i = 0; i < testcount; i++) {
                //闭包函数参考：http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                (function (testindex) {
                    it('Department', function () {
                        click_products_catalog(dropdown, browser.params.menuindex.products.idxDepartment, testindex); //2=Department
                    });
                })(i);
            }

            /* Build aBarcode for Unit Debug Text
            aBarcode[0] = {name: 'COOKIE- OATMEAL RAISIN (CASE)', barcode: '0063221001131', shortname: 'COOKIE- OATMEAL RAISIN (CASE)'};
            aBarcode[1] = {name: 'COOKIE-CHOC CHUNK (CASE)', barcode: '0063221001130', shortname: 'COOKIE-CHOC CHUNK (CASE)'};
            */
            for (i = 0; i < testcount; i++) {
                //闭包函数参考：http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                (function (testindex) {
                    it('UPC Assembly', function () {
                        console.log('Check Barcode Value : ', aBarcode);
                        click_upc_assembly(dropdown, browser.params.menuindex.products.idxUPCAssembly, testindex); //3=UPC Assembly
                        browser.sleep(500);
                    });
                })(i);
            }

            //for (i = 0; i < 0; i++) {
            for (i = 0; i < testcount; i++) {
                //闭包函数参考：http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                (function (testindex) {
                    it('Fuel Grade', function () {
                        click_fuel_grade(dropdown, browser.params.menuindex.products.idxFuelGrades, testindex); //4=Fuel Grade
                    });
                })(i);
            }

            //for (i = 0; i < 0; i++) {
            for (i = 0; i < testcount; i++) {
                //闭包函数参考：http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                (function (testindex) {
                    it('Fuel Tank', function () {
                        click_fuel_grade(dropdown, browser.params.menuindex.products.idxFuelTanks, testindex); //4=Fuel Tank
                    });
                })(i);
            }

            //for (i = 0; i < 0; i++) {
            for (i = 0; i < testcount; i++) {
                //闭包函数参考：http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                (function (testindex) {
                    it('Fuel Blend', function () {
                        click_fuel_grade(dropdown, browser.params.menuindex.products.idxFuelBlends, testindex); //5=Fuel Blend
                    });
                })(i);
            }

            //for (i = 0; i < 0; i++) {
            for (i = 0; i < testcount; i++) {
                //闭包函数参考：http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                (function (testindex) {
                    it('Tax Zone', function () {
                        click_products_catalog(dropdown, browser.params.menuindex.products.idxTaxZones, testindex); //6=Tax Zone
                    });
                })(i);
            }

            //for (i = 0; i < 0; i++) {
            for (i = 0; i < testcount; i++) {
                //闭包函数参考：http://stackoverflow.com/questions/21634558/looping-on-a-protractor-test-with-parameters
                (function (testindex) {
                    it('Tax Rate', function () {
                        click_products_catalog(dropdown, browser.params.menuindex.products.idxTaxRates, testindex); //7=Tax Rate
                    });
                })(i);
            }
        });
    }

    if (false) {
        describe('Products Unit Debug Test', function () {
            var dropdown;
            beforeEach(function () {
                dropdown = element.all(by.repeater('item in modules')).get(topMenu); //Get "Products"
                dropdown.click().then(showfooter);
            });
            var i;
            var testcount = browser.params.test.count;

            /* Build aBarcode for Unit Debug Text */
            aBarcode[0] = {name: 'COOKIE- OATMEAL RAISIN (CASE)', barcode: '0063221001131', shortname: 'COOKIE- OATMEAL RAISIN (CASE)'};
            aBarcode[1] = {name: 'COOKIE-CHOC CHUNK (CASE)', barcode: '0063221001130', shortname: 'COOKIE-CHOC CHUNK (CASE)'};

            for (i = 0; i < testcount; i++) {
                (function (testindex) {
                    it('UPC Assembly', function () {
                        console.log('Check Barcode', testindex, 'Value :', aBarcode);
                        click_upc_assembly(dropdown, browser.params.menuindex.products.idxUPCAssembly, testindex); //3=UPC Assembly
                        browser.sleep(500);
                    });
                })(i);
            }
        });
    }

    if (true) {
        describe('Products Unit Debug Test', function () {
            var dropdown;
            beforeEach(function () {
                dropdown = element.all(by.repeater('item in modules')).get(topMenu); //Get "Products"
                dropdown.click().then(showfooter);
            });
            var i;
            var testcount = browser.params.test.count;

            for (i = 0; i < testcount; i++) {
                (function (testindex) {
                    it('Products Advance Search', function () {
                        click_advanced_search(dropdown, browser.params.menuindex.products.idxProducts, testindex); //0=Products Catalog
                    });
                })(i);
            }
        });
    }
});
