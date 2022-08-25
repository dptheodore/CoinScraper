import puppeteer from 'puppeteer';
import Excel from 'exceljs';
import * as fs from 'fs';
import * as hps from "./hashpackSetup.js";
import * as cons from "./constants.js";

async function main() {
  var data = ""; //Importing Seed Phrase for Wallet from json file in same dir
    
  //Reading in Seed Phrase to import wallet
  fs.readFile('privateKey.json', (err,fileData) => {
    if (!err) data = JSON.parse(fileData);
  });

  if (data.privateKey == "" || data.accountAddress == "") {
    console.log("Add your private wallet key and Hedera account address to the \"privateKey.json\" file located in the same directory as this js file, if you want to track your SAUCE quantity.");  
    return;
  }

  //Create Excel Sheet
  let workbook = new Excel.Workbook();
  let worksheet;
  if(fs.existsSync(cons.PATH_TO_EXCEL_SHEET)){
    await workbook.xlsx.readFile(cons.PATH_TO_EXCEL_SHEET);
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

  let extPg = await hps.setupWallet(browser,page, data);

  
  let sortSelectorBtn = "#__next > div > div.MuiBox-root.css-zf0iqh > div.MuiContainer-root.css-nkatz7 > div > div > div.MuiBox-root.css-tw4vmx > div > div > div > div.MuiGrid-root.MuiGrid-container.css-1e2x7iq > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-grid-xs-4.MuiGrid-grid-sm-3.css-7jkkkb > div"
  //This sorts to have the top most div to be the one that has the reward money 
  await hps.clickSelector(page,sortSelectorBtn);
  await hps.clickSelector(page,sortSelectorBtn);

  await page.type("#__next > div > div.MuiBox-root.css-zf0iqh > div.MuiContainer-root.css-nkatz7 > div > div > div.MuiBox-root.css-tw4vmx > div > div > div > div.MuiBox-root.css-0 > div.MuiBox-root.css-gg4vpm > div.MuiFormControl-root.MuiTextField-root.css-i44wyl > div > input", "USDC");
  await new Promise(resolve => setTimeout(resolve, cons.DELAY_BETWEEN_CLICKS_SECONDS * 1000));

  //Click Top Earnings div to get all content needed


  let topEarningsBtn = "#__next > div > div.MuiBox-root.css-zf0iqh > div.MuiContainer-root.css-nkatz7 > div > div > div.MuiBox-root.css-tw4vmx > div > div > div > div:nth-child(4)";
  await hps.clickSelector(page,topEarningsBtn)



  //Loop through collecting values and adding to spreadsheet
  let timeAlive = 0;
  while(timeAlive < cons.TIME_OUT_AFTER_SECONDS * 1000){
    await page.bringToFront();
    
    //Scrape Data to Spreadsheet
    await hps.scrapeData(page, workbook, worksheet);

    //Auto Harvest if over the threshold
    let hbarUSDCEarn = await hps.checkEarnings(page);
    if (hbarUSDCEarn >= cons.MIN_HARVEST_AMT_DOLLARS) await hps.harvestEarnings(page, extPg);

    await new Promise(resolve => setTimeout(resolve, cons.DELAY_BETWEEN_READING_VALUES_SECONDS * 1000));
    timeAlive += new Date() - timeStart;
  }

  //Close Out of Browser
  await browser.close();
}
main(); //Actual call to run above async func