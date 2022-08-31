import puppeteer from "puppeteer";
import Excel from "exceljs";
import * as fs from "fs";
import * as cons from "./constants.js";
import * as sels from "./selectorConstants.js";

export async function createExcelSheet(pairStr){
    let pairArr = pairStr.split("-");
    let workbook = new Excel.Workbook();
    let worksheet;
    let xlsxPath = cons.PATH_TO_EXCEL_SHEET+pairStr+".xlsx";
    if(fs.existsSync(xlsxPath)) {
      await workbook.xlsx.readFile(xlsxPath);
      worksheet = workbook.worksheets[0];
    }
    else{
      worksheet = workbook.addWorksheet(pairStr+" Spreadsheet");
      worksheet.addRow(["Date", "Time", "$ "+pairArr[0], "$ "+pairArr[1], "Yield", pairArr[0]+" Qnty", pairArr[1]+" Qnty", pairArr[0]+"_"+pairArr[1]+" LP", "USD Value of LP", "Liquidity"]);
    }
    return [workbook, worksheet, xlsxPath];
}

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
  const newPagePromise = new Promise(x => browser.once("targetcreated", target => x(target.page())));    // declare promise
  await domManipSleep(()=>page.click("body > div.MuiModal-root.MuiDialog-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollBody.css-idnud > div > div > div.MuiDialogContent-root.css-103f7fp > button"));
  const newPage = await newPagePromise;

  await domManipSleep(()=>console.log("Hashpack Extension Loading..."), 1.5);

  //Enter Password
  await domManipSleep(()=>newPage.type("#inputPassword", "P@ssW0rd1212!")); //These are dummy passwords for hashpack, no actual sensitive info

  //Enter Conf PW
  await domManipSleep(()=>newPage.type("#confirmPassword", "P@ssW0rd1212!")); //These are dummy passwords for hashpack, no actual sensitive info

  //Click Checkbox
  await domManipSleep(()=>newPage.click("body > app-root > main > app-login > div.content.ng-tns-c155-1 > section.pages.ng-tns-c155-1.ng-trigger.ng-trigger-routeAnimations > create-app-login > section > div > div.consent > toggle > span"), 2);

  //Click Next button 
  await domManipSleep(()=>newPage.click("body > app-root > main > app-login > div.content.ng-tns-c155-1 > section.pages.ng-tns-c155-1.ng-trigger.ng-trigger-routeAnimations > create-app-login > section > div > button.primary"), 2.5);

  //Click Reject
  await domManipSleep(()=>newPage.click("body > dialog-popup-wrapper > div > div > div.button-holder.ng-tns-c50-4 > div > button.ed-btn.ed-btn-lg.ng-tns-c50-4.ed-btn-danger.ng-star-inserted"));

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
  await domManipSleep(()=>newPage.click("body > dialog-popup-wrapper > div > div > div.content-holder.ng-tns-c50-12 > div > pairing-select > div > div.ng-star-inserted > div > div > toggle > span"));

  //Click Approve
  await domManipSleep(()=>newPage.click("body > dialog-popup-wrapper > div > div > div.button-holder.ng-tns-c50-12 > div > button.ed-btn.ed-btn-lg.ng-tns-c50-12.ed-btn-success.ng-star-inserted"));

  //Click Farm
  await page.bringToFront();
  await domManipSleep(()=>page.click("#__next > div > div.MuiBox-root.css-zf0iqh > header > div > div > div:nth-child(1) > div > div > a.MuiTypography-root.MuiTypography-inherit.MuiLink-root.MuiLink-underlineAlways.MuiButtonBase-root.MuiTab-root.MuiTab-labelIcon.MuiTab-textColorPrimary.Mui-selected.active.css-1wktvyx"));

  return newPage;
}

export async function scrapeData(page, workbook, worksheet, xlsxPath, timeStart){

    //Get APR 
    let aprElem = await page.$(sels.farmPairHeaderSelector + " > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-grid-xs-4.MuiGrid-grid-sm-2.css-zsyyq7 > p > p");
    let aprTxt = await page.evaluate(el => el.textContent, aprElem);

    //Get Liq
    let liqElem = await page.$(sels.farmPairHeaderSelector + " > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-grid-xs-0.MuiGrid-grid-sm-3.css-i4loga > p");
    let liqTxt = await page.evaluate(el => el.textContent, liqElem);

    //Get Total $ Val

    let dolValElem = await page.$(sels.farmPairContentSelector + " div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.css-1fahd83 > div:nth-child(2) > p");
    let valTxt = await page.evaluate(el => el.textContent, dolValElem);

    //Get LP Token Quant $ Val
    let lpQuantElem = await page.$(sels.farmPairContentSelector + " > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.css-1fahd83 > div:nth-child(3) > p");
    let lpQuantTxt = await page.evaluate(el => el.textContent, lpQuantElem);

    //Get Token 1 Quant
    let t1QuantElem = await page.$(sels.farmPairContentSelector + " > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.css-1fahd83 > div:nth-child(5) > p");
    let t1QuantTxt = await page.evaluate(el => el.textContent, t1QuantElem);

    //Get Token 2 Quant
    let t2QuantElem = await page.$(sels.farmPairContentSelector + " > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.css-1fahd83 > div:nth-child(6) > p:nth-child(2)");
    let t2QuantTxt = await page.evaluate(el => el.textContent, t2QuantElem);

    //Replacing commas with decimals because parseFloat expects no commas
    let valNum = valTxt.substring(1).replace(/,/g,"");
    let t1QuantNum = t1QuantTxt.replace(/,/g,"");
    let t2QuantNum = t2QuantTxt.replace(/,/g,"");

    //Token 1 Price
    let t1PriceTxt = parseFloat( (parseFloat(valNum)/2) / parseFloat(t1QuantNum)).toFixed(6);

    //Token 2 Price
    let t2PriceTxt = parseFloat( (parseFloat(valNum)/2) / parseFloat(t2QuantNum)).toFixed(6);

    //Get Date
    var currentDate = new Date();
    var date = currentDate.getMonth()+1 + "/" + currentDate.getDate() + "/" + currentDate.getFullYear();

    //Get Time
    var time = currentDate.getHours() + ":" + currentDate.getMinutes().toLocaleString("en-US", {minimumIntegerDigits:2}); 

    //Add Values to Spreadsheet
    worksheet.addRow([date, time, t1PriceTxt, t2PriceTxt, aprTxt, t1QuantTxt, t2QuantTxt, lpQuantTxt, valTxt, liqTxt]).commit();
    await workbook.xlsx.writeFile(xlsxPath);
}

export async function checkEarnings(page){
    let sauceEarnElem = await page.$(sels.farmPairHeaderSelector + "> div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-4.MuiGrid-grid-sm-3.css-1wxaqej > div > div.MuiGrid-root.MuiGrid-container.css-v3z1wi > span");
    let sauceEarnTxt  = await page.evaluate(el => el.textContent, sauceEarnElem);

    let hbarEarnElem = await page.$(sels.farmPairHeaderSelector + " > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-4.MuiGrid-grid-sm-3.css-1wxaqej > div > div.MuiGrid-root.MuiGrid-container.css-vijzuy > span");
    let hbarEarnTxt  = await page.evaluate(el => el.textContent, hbarEarnElem);

    return parseFloat(sauceEarnTxt.substr(1)) + parseFloat(hbarEarnTxt.substr(1));
}

export async function domManipSleep(fn, delayMult=1){
        await fn();
        await new Promise(resolve => setTimeout(resolve, cons.DELAY_BETWEEN_CLICKS_SECONDS * 1000 * delayMult));
}

export async function harvestEarnings(page, extPg){
    await domManipSleep(()=>page.click( sels.farmPairContentSelector + " > div > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-4.css-tf5444 > div > button.MuiButton-root.MuiButton-outlined.MuiButton-outlinedPrimary.MuiButton-sizeMedium.MuiButton-outlinedSizeMedium.MuiButton-fullWidth.MuiButtonBase-root.css-701jtl"));
    await extPg.bringToFront();
    //Click Approve on HashPack
    await domManipSleep(()=>extPg.click("body > dialog-popup-wrapper > div > div > div.button-holder.ng-tns-c50-13 > div > button.ed-btn.ed-btn-lg.ng-tns-c50-13.ed-btn-success.ng-star-inserted"));
    await extPg.waitForSelector("body > dialog-popup-wrapper > div > div > div.content-holder.ng-tns-c50-13 > div > hashconnect-transaction > sending-spinner > div > div > div > button");
    //Click Done in HashPack
    await domManipSleep(()=>extPg.click("body > dialog-popup-wrapper > div > div > div.content-holder.ng-tns-c50-13 > div > hashconnect-transaction > sending-spinner > div > div > div > button"));
    await page.bringToFront();
    //Click Done on SS
    await domManipSleep(()=>page.click("#scroll-dialog-title > button"));
}

export async function findPairSelector(pair, page){
    let pairArr = pair.split("-");

    for(let divChild = 4; divChild < 19; divChild++){ //Start at 4 as that is the first div child that contains Pair Info
        let topEarningsBtn = "#__next > div > div.MuiBox-root.css-zf0iqh > div.MuiContainer-root.css-nkatz7 > div > div > div.MuiBox-root.css-tw4vmx > div > div > div > div:nth-child("+divChild+")";
        await domManipSleep(()=>page.click(topEarningsBtn));

        let pairElem = await page.$(sels.farmPairHeaderSelector + " > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-grid-xs-4.css-wsygox > div");
        let pairTxt = await page.evaluate(el => el.textContent, pairElem);

        pairTxt = pairTxt.replace(/ /g, "");

        if (pair == pairTxt) {return topEarningsBtn;}
        else{await domManipSleep(()=>page.click(topEarningsBtn));}
    }
}