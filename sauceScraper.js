import puppeteer from 'puppeteer';
import Excel from 'exceljs';
import * as fs from 'fs';

var data = ""; //Importing Seed Phrase for Wallet from json file in same dir
var PATH_TO_EXCEL_SHEET = "./hbarUSDC.xlsx";
var DELAY_BETWEEN_READING_VALUES_SECONDS = 2*60; // 2 minute delay between reading values into the excel spreadsheet
var DELAY_BETWEEN_CLICKS_SECONDS = 0.4;
var TIME_OUT_AFTER_SECONDS = 1*60; //Infinity means this program will run for Infinity seconds, namely you'll have to manually terminate the process to stop it

//Reading in Seed Phrase to import wallet
fs.readFile('privateKey.json', (err,fileData) => {
  if (!err) data = JSON.parse(fileData);
});

async function setupWallet(browser, page){
    //Click Read to End
  await page.click("body > div.MuiModal-root.MuiDialog-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollBody.css-idnud > div > div > div.MuiDialogContent-root.css-103f7fp > div.MuiBox-root.css-1h0i4bu > p > a");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //Click read button       
  await page.click("body > div.MuiModal-root.MuiDialog-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollBody.css-idnud > div > div > div.MuiDialogContent-root.css-103f7fp > div.MuiBox-root.css-1h0i4bu > label > span.MuiSwitch-root.MuiSwitch-sizeMedium.css-1ew5r76 > span.MuiSwitch-switchBase.MuiSwitch-colorPrimary.MuiButtonBase-root.MuiSwitch-switchBase.MuiSwitch-colorPrimary.PrivateSwitchBase-root.css-1w1d1ls > input");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //Click Ok button
  await page.click("body > div.MuiModal-root.MuiDialog-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollBody.css-idnud > div > div > div.MuiDialogContent-root.css-103f7fp > div.MuiBox-root.css-1h0i4bu > button");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //Click Connect Wallet Button
  await page.click("#__next > div > div.MuiBox-root.css-zf0iqh > header > div > div > div:nth-child(2) > div > div > div.MuiButtonBase-root.MuiTab-root.MuiTab-textColorPrimary.css-spc5eb > button");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //Click Hashpack Button button 
  const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));    // declare promise
  await page.click("body > div.MuiModal-root.MuiDialog-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollBody.css-idnud > div > div > div.MuiDialogContent-root.css-103f7fp > button");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));
  const newPage = await newPagePromise;

  //Enter Password
  await newPage.type("#inputPassword", "P@ssW0rd1212!"); //These are dummy passwords for hashpack, no actual sensitive info
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //Enter Conf PW
  await newPage.type("#confirmPassword", "P@ssW0rd1212!"); //These are dummy passwords for hashpack, no actual sensitive info
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //Click Checkbox
  await newPage.click("body > app-root > main > app-login > div > section.pages.ng-tns-c153-1.ng-trigger.ng-trigger-routeAnimations > create-app-login > section > div > div.consent > toggle > span > label > div");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //Click Next button 
  await newPage.click("body > app-root > main > app-login > div > section.pages.ng-tns-c153-1.ng-trigger.ng-trigger-routeAnimations > create-app-login > section > div > button");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //Click Reject
  await newPage.click("body > dialog-popup-wrapper > div > div > div.button-holder.ng-tns-c55-4 > div > button.ed-btn.ed-btn-lg.ng-tns-c55-4.ed-btn-danger.ng-star-inserted");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //Click import Wallet
  await newPage.click("body > app-root > main > app-create-wallet > div > import-or-create-wallet > section > button.primary.import_key");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //Click Import using Private Key
  await newPage.click("body > app-root > main > app-create-wallet > div > import-type > section > button.primary.import_key");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //ENTER ACCOUNT ADDRESS
  await newPage.type("body > app-root > main > app-create-wallet > div > app-enter-account-id > section > form > div.account_id > div > address-verify > input", data.accountAddress);
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //ENTER PRIVATE RECOVERY KEY
  await newPage.type("#inputPrivateKey", data.privateKey);
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 2000));

  //CLICK NEXT
  await newPage.click("body > app-root > main > app-create-wallet > div > app-enter-account-id > bottom-buttons > div > button.primary.ng-star-inserted");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //CLICK CREATE WALLET
  await newPage.click("body > app-root > main > app-create-wallet > div > app-enter-nickname > bottom-buttons > div > button.primary.ng-star-inserted");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //CLICK HashPack
  await page.click("body > div.MuiModal-root.MuiDialog-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollBody.css-idnud > div > div > div.MuiDialogContent-root.css-103f7fp > button");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //Click Addr Checkbox
  await newPage.click("body > dialog-popup-wrapper > div > div > div.content-holder.ng-tns-c55-11 > div > pairing-select > div > div.ng-star-inserted > div > div > toggle > span > label > div");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //Click Approve
  await newPage.click("body > dialog-popup-wrapper > div > div > div.button-holder.ng-tns-c55-11 > div > button.ed-btn.ed-btn-lg.ng-tns-c55-11.ed-btn-success.ng-star-inserted");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //Click Farm
  await page.bringToFront();
  await page.click("#__next > div > div.MuiBox-root.css-zf0iqh > header > div > div > div:nth-child(1) > div > div > a.MuiTypography-root.MuiTypography-inherit.MuiLink-root.MuiLink-underlineAlways.MuiButtonBase-root.MuiTab-root.MuiTab-labelIcon.MuiTab-textColorPrimary.Mui-selected.active.css-1wktvyx");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));
}

async function main() {
  if (data.privateKey == "" || data.accountAddress == "") {
    console.log("Add your private wallet key and Hedera account address to the \"privateKey.json\" file located in the same directory as this js file, if you want to track your SAUCE quantity.");  
    return;
  }

  //Create Excel Sheet
  let workbook = new Excel.Workbook();
  let worksheet;
  if(fs.existsSync(PATH_TO_EXCEL_SHEET)){
    await workbook.xlsx.readFile(PATH_TO_EXCEL_SHEET);
    worksheet = workbook.worksheets[0];
  }
  else{
    worksheet = workbook.addWorksheet("SAUCE Spreadsheet");
    worksheet.addRow(["Date", "Time", "$ HBAR", "$ USDC", "Yield", "HBAR Qnty", "USDC Qnty", "HBAR_USDC LP", "USD Value of LP", "Liquidity"]);
  }

  //Launch Automated Browser Window
  const browser = await puppeteer.launch({
    headless:false, 
    args:[
    '--load-extension='+data.walletPath,
     '--disable-extensions-except='+data.walletPath,
     '--window-size=1920,1080'
     ],
     defaultViewport: {
       width:1920,
       height:1080
     }
  });
  const url = "https://saucerswap.finance/farm";
  const extensionName = 'Hashpack';

  //Navigate to Saucer Swap Website
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'load' });

  await setupWallet(browser,page);

  //Click HBAR USDC tab to get all content needed
  await page.click("#__next > div > div.MuiBox-root.css-zf0iqh > div.MuiContainer-root.css-nkatz7 > div > div > div.MuiBox-root.css-tw4vmx > div > div > div > div:nth-child(10)");
  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //Loop through collecting values and adding to spreadsheet
  let timeAlive = 0;
  while(timeAlive < TIME_OUT_AFTER_SECONDS * 1000){
    await page.bringToFront();
    let timeStart = new Date();

    // "HBARUSDC LP PRICE", "# of LP Tokens", "Total $", "% of Pool",
    let HBARUSDCPrefixSelector = "#__next > div > div.MuiBox-root.css-zf0iqh > div.MuiContainer-root.css-nkatz7 > div > div > div.MuiBox-root.css-tw4vmx > div > div > div > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.MuiAccordion-root.MuiAccordion-rounded.Mui-expanded.css-1uhiqn8";
    let HBARUSDCHeaderSelector = HBARUSDCPrefixSelector + " > div.MuiButtonBase-root.MuiAccordionSummary-root.Mui-expanded.css-1g8uv80 > div.MuiAccordionSummary-content.Mui-expanded.css-1n11r91";
    let HBARUSDCContentSelector = "#__next > div > div.MuiBox-root.css-zf0iqh > div.MuiContainer-root.css-nkatz7 > div > div > div.MuiBox-root.css-tw4vmx > div > div > div > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.MuiAccordion-root.MuiAccordion-rounded.Mui-expanded.css-1uhiqn8 > div.MuiCollapse-root.MuiCollapse-vertical.MuiCollapse-entered.css-c4sutr > div > div > div";
    
    //HBAR Price
    let hbarPriceElem = await page.$("#__next > div > div.MuiBox-root.css-zf0iqh > header > div > div > div:nth-child(2) > div > div > a > div");
    let hbarPriceTxt  = await page.evaluate(el => el.textContent, hbarPriceElem);

    //Get APR 
    let aprElem = await page.$(HBARUSDCHeaderSelector + " > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-grid-xs-4.MuiGrid-grid-sm-2.css-zsyyq7 > p > p");
    let aprTxt = await page.evaluate(el => el.textContent, aprElem);

    //Get Liq
    let liqElem = await page.$(HBARUSDCHeaderSelector + " > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-grid-xs-0.MuiGrid-grid-sm-3.css-i4loga > p");
    let liqTxt = await page.evaluate(el => el.textContent, liqElem);

    //Get Total $ Val

    let dolValElem = await page.$(HBARUSDCContentSelector + " div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.css-1fahd83 > div:nth-child(2) > p");
    let valTxt = await page.evaluate(el => el.textContent, dolValElem);

    //Get LP Token Quant $ Val
    let lpQuantElem = await page.$(HBARUSDCContentSelector + " > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.css-1fahd83 > div:nth-child(3) > p");
    let lpQuantTxt = await page.evaluate(el => el.textContent, lpQuantElem);

    //Get HBAR Token Quant
    let hbarQuantElem = await page.$(HBARUSDCContentSelector + " > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.css-1fahd83 > div:nth-child(5) > p");
    let hbarQuantTxt = await page.evaluate(el => el.textContent, hbarQuantElem);

    //USDC Token Quant
    let usdcQuantElem = await page.$(HBARUSDCContentSelector + " > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.css-1fahd83 > div:nth-child(6) > p:nth-child(2)");
    let usdcQuantTxt = await page.evaluate(el => el.textContent, usdcQuantElem);

    
    let usdcPrice = (parseFloat(hbarPriceTxt) * parseFloat(hbarQuantTxt) / parseFloat(usdcQuantTxt)).toFixed(3);

    //Get Date
    var currentDate = new Date();
    var date = currentDate.getMonth()+1 + "/" + currentDate.getDate() + "/" + currentDate.getFullYear();
    
    //Get Time
    var time = currentDate.getHours() + ":" + currentDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits:2}); 

    //Add Values to Spreadsheet
    worksheet.addRow([date, time, hbarPriceTxt, usdcPrice, aprTxt, hbarQuantTxt, usdcQuantTxt, lpQuantTxt, valTxt, liqTxt]).commit();
    await workbook.xlsx.writeFile(PATH_TO_EXCEL_SHEET);

    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_READING_VALUES_SECONDS * 1000));

    timeAlive += new Date() - timeStart;
  }

  //Close Out of Browser
  await browser.close();
}
main(); //Actual call to run above async func