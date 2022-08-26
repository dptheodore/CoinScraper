import puppeteer from 'puppeteer';
import * as cons from "./constants.js";

export async function setupWallet(browser, page, data){
  //Click Read to End
  await domManipSleep(()=> page.click("body > div.MuiModal-root.MuiDialog-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollBody.css-idnud > div > div > div.MuiDialogContent-root.css-103f7fp > div.MuiBox-root.css-1h0i4bu > p > a"));

  //Click read button       
  await domManipSleep(()=> page.click("body > div.MuiModal-root.MuiDialog-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollBody.css-idnud > div > div > div.MuiDialogContent-root.css-103f7fp > div.MuiBox-root.css-1h0i4bu > label > span.MuiSwitch-root.MuiSwitch-sizeMedium.css-1ew5r76 > span.MuiSwitch-switchBase.MuiSwitch-colorPrimary.MuiButtonBase-root.MuiSwitch-switchBase.MuiSwitch-colorPrimary.PrivateSwitchBase-root.css-1w1d1ls > input"));

  //Click Ok button
  await domManipSleep(()=> page.click("body > div.MuiModal-root.MuiDialog-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollBody.css-idnud > div > div > div.MuiDialogContent-root.css-103f7fp > div.MuiBox-root.css-1h0i4bu > button"));

  //Click Connect Wallet Button
  await domManipSleep(() => page.click("#__next > div > div.MuiBox-root.css-zf0iqh > header > div > div > div:nth-child(2) > div > div > div.MuiButtonBase-root.MuiTab-root.MuiTab-textColorPrimary.css-spc5eb > button"));

  //Click Hashpack Button button 
  const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));    // declare promise
  await domManipSleep(()=>page.click("body > div.MuiModal-root.MuiDialog-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollBody.css-idnud > div > div > div.MuiDialogContent-root.css-103f7fp > button"));
  const newPage = await newPagePromise;

  //Enter Password
  await domManipSleep(()=>newPage.type("#inputPassword", "P@ssW0rd1212!")); //These are dummy passwords for hashpack, no actual sensitive info

  //Enter Conf PW
  await domManipSleep(()=>newPage.type("#confirmPassword", "P@ssW0rd1212!")); //These are dummy passwords for hashpack, no actual sensitive info

  //Click Checkbox
  await domManipSleep(()=>newPage.click("body > app-root > main > app-login > div > section.pages.ng-tns-c153-1.ng-trigger.ng-trigger-routeAnimations > create-app-login > section > div > div.consent > toggle > span > label > div"));

  //Click Next button 
  await domManipSleep(()=>newPage.click("body > app-root > main > app-login > div > section.pages.ng-tns-c153-1.ng-trigger.ng-trigger-routeAnimations > create-app-login > section > div > button"));

  //Click Reject
  await domManipSleep(()=>newPage.click("body > dialog-popup-wrapper > div > div > div.button-holder.ng-tns-c55-4 > div > button.ed-btn.ed-btn-lg.ng-tns-c55-4.ed-btn-danger.ng-star-inserted"));

  //Click import Wallet
  await domManipSleep(()=>newPage.click("body > app-root > main > app-create-wallet > div > import-or-create-wallet > section > button.primary.import_key"));

  //Click Import using Private Key
  await domManipSleep(()=>newPage.click("body > app-root > main > app-create-wallet > div > import-type > section > button.primary.import_key"));

  //ENTER ACCOUNT ADDRESS
  await domManipSleep(()=>newPage.type("body > app-root > main > app-create-wallet > div > app-enter-account-id > section > form > div.account_id > div > address-verify > input", data.accountAddress), 3);

  //ENTER PRIVATE RECOVERY KEY
  await domManipSleep(()=>newPage.type("#inputPrivateKey", data.privateKey), 3);

  //CLICK NEXT
  await domManipSleep(()=>newPage.click("body > app-root > main > app-create-wallet > div > app-enter-account-id > bottom-buttons > div > button.primary.ng-star-inserted"));

  //CLICK CREATE WALLET
  await domManipSleep(()=>newPage.click("body > app-root > main > app-create-wallet > div > app-enter-nickname > bottom-buttons > div > button.primary.ng-star-inserted"));

  //CLICK HashPack
  await domManipSleep(()=>page.click("body > div.MuiModal-root.MuiDialog-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollBody.css-idnud > div > div > div.MuiDialogContent-root.css-103f7fp > button"));

  //Click Addr Checkbox
  await domManipSleep(()=>newPage.click("body > dialog-popup-wrapper > div > div > div.content-holder.ng-tns-c55-11 > div > pairing-select > div > div.ng-star-inserted > div > div > toggle > span > label > div"));

  //Click Approve
  await domManipSleep(()=>newPage.click("body > dialog-popup-wrapper > div > div > div.button-holder.ng-tns-c55-11 > div > button.ed-btn.ed-btn-lg.ng-tns-c55-11.ed-btn-success.ng-star-inserted"));

  //Click Farm
  await page.bringToFront();
  await domManipSleep(()=>page.click("#__next > div > div.MuiBox-root.css-zf0iqh > header > div > div > div:nth-child(1) > div > div > a.MuiTypography-root.MuiTypography-inherit.MuiLink-root.MuiLink-underlineAlways.MuiButtonBase-root.MuiTab-root.MuiTab-labelIcon.MuiTab-textColorPrimary.Mui-selected.active.css-1wktvyx"));

  return newPage;
}

export async function scrapeData(page, workbook, worksheet){
    let timeStart = new Date();

    //HBAR Price
    let hbarPriceElem = await page.$("#__next > div > div.MuiBox-root.css-zf0iqh > header > div > div > div:nth-child(2) > div > div > a > div");
    let hbarPriceTxt  = await page.evaluate(el => el.textContent, hbarPriceElem);

    //Get APR 
    let aprElem = await page.$(cons.HBARUSDCHeaderSelector + " > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-grid-xs-4.MuiGrid-grid-sm-2.css-zsyyq7 > p > p");
    let aprTxt = await page.evaluate(el => el.textContent, aprElem);

    //Get Liq
    let liqElem = await page.$(cons.HBARUSDCHeaderSelector + " > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-grid-xs-0.MuiGrid-grid-sm-3.css-i4loga > p");
    let liqTxt = await page.evaluate(el => el.textContent, liqElem);

    //Get Total $ Val

    let dolValElem = await page.$(cons.HBARUSDCContentSelector + " div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.css-1fahd83 > div:nth-child(2) > p");
    let valTxt = await page.evaluate(el => el.textContent, dolValElem);

    //Get LP Token Quant $ Val
    let lpQuantElem = await page.$(cons.HBARUSDCContentSelector + " > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.css-1fahd83 > div:nth-child(3) > p");
    let lpQuantTxt = await page.evaluate(el => el.textContent, lpQuantElem);

    //Get HBAR Token Quant
    let hbarQuantElem = await page.$(cons.HBARUSDCContentSelector + " > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.css-1fahd83 > div:nth-child(5) > p");
    let hbarQuantTxt = await page.evaluate(el => el.textContent, hbarQuantElem);

    //USDC Token Quant
    let usdcQuantElem = await page.$(cons.HBARUSDCContentSelector + " > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.css-1fahd83 > div:nth-child(6) > p:nth-child(2)");
    let usdcQuantTxt = await page.evaluate(el => el.textContent, usdcQuantElem);

    let usdcPrice = (parseFloat(hbarPriceTxt) * parseFloat(hbarQuantTxt) / parseFloat(usdcQuantTxt)).toFixed(3);

    //Get Date
    var currentDate = new Date();
    var date = currentDate.getMonth()+1 + "/" + currentDate.getDate() + "/" + currentDate.getFullYear();

    //Get Time
    var time = currentDate.getHours() + ":" + currentDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits:2}); 

    //Add Values to Spreadsheet
    worksheet.addRow([date, time, hbarPriceTxt, usdcPrice, aprTxt, hbarQuantTxt, usdcQuantTxt, lpQuantTxt, valTxt, liqTxt]).commit();
    await workbook.xlsx.writeFile(cons.PATH_TO_EXCEL_SHEET);
}

export async function checkEarnings(page){
    let sauceEarnElem = await page.$(cons.HBARUSDCHeaderSelector + "> div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-4.MuiGrid-grid-sm-3.css-1wxaqej > div > div.MuiGrid-root.MuiGrid-container.css-v3z1wi > span");
    let sauceEarnTxt  = await page.evaluate(el => el.textContent, sauceEarnElem);

    let hbarEarnElem = await page.$(cons.HBARUSDCHeaderSelector + " > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-4.MuiGrid-grid-sm-3.css-1wxaqej > div > div.MuiGrid-root.MuiGrid-container.css-vijzuy > span");
    let hbarEarnTxt  = await page.evaluate(el => el.textContent, hbarEarnElem);

    return parseFloat(sauceEarnTxt.substr(1)) + parseFloat(hbarEarnTxt.substr(1));
}

export async function domManipSleep(fn, delayMult=1){
    await fn();
    await new Promise(resolve => setTimeout(resolve, cons.DELAY_BETWEEN_CLICKS_SECONDS * 1000 * delayMult));
}

export async function harvestEarnings(page, extPg){
    await domManipSleep(()=>page( cons.HBARUSDCContentSelector + " > div > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-4.css-tf5444 > div > button.MuiButton-root.MuiButton-outlined.MuiButton-outlinedPrimary.MuiButton-sizeMedium.MuiButton-outlinedSizeMedium.MuiButton-fullWidth.MuiButtonBase-root.css-701jtl"));
    await extPg.bringToFront();
    await domManipSleep(()=>extPg("body > dialog-popup-wrapper > div > div > div.button-holder.ng-tns-c55-12 > div > button.ed-btn.ed-btn-lg.ng-tns-c55-12.ed-btn-success.ng-star-inserted"));
    await extPg.waitForSelector("body > dialog-popup-wrapper > div > div > div.content-holder.ng-tns-c55-12 > div > hashconnect-transaction > sending-spinner > div > div > div > button");
    await domManipSleep(()=>extPg("body > dialog-popup-wrapper > div > div > div.content-holder.ng-tns-c55-12 > div > hashconnect-transaction > sending-spinner > div > div > div > button"));
    await page.bringToFront();
    await domManipSleep(()=>page("#scroll-dialog-title > button"));
}