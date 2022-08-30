import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as hps from "./hashpackSetup.js";
import * as cons from "./constants.js";
import path from "path";

async function main() {
  var data = ""; //Importing Seed Phrase for Wallet from json file in same dir
    
  //Reading in Seed Phrase to import wallet
  fs.readFile('privateKey.txt', (err,fileData) => {
    if (!err) data = JSON.parse(fileData);
  });

  if (data.privateKey == "" || data.accountAddress == "") {
    console.log("Add your private wallet key and Hedera account address to the \"privateKey.json\" file located in the same directory as this js file, if you want to track your SAUCE quantity.");  
    return;
  }

  let bookArr = [];
  let sheetArr = [];
  let xlsxPathArr = [];
  //Create Excel Sheet for each pair in user-def'd array
  for(let i = 0; i < cons.PAIRS_TO_SCRAPE.length; i++){
    let pair = cons.PAIRS_TO_SCRAPE[i];
    let excelFiles = await hps.createExcelSheet(pair);
    bookArr.push(excelFiles[0]);
    sheetArr.push(excelFiles[1]);
    xlsxPathArr.push(excelFiles[2]);
  }


  //Launch Automated Browser Window
  var absPath = path.resolve(cons.PATH_TO_HASHPACK_EXT);
  const browser = await puppeteer.launch({
    headless:false,
    args:[
    '--load-extension='+absPath,
     '--disable-extensions-except='+absPath,
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

  //This sorts to have the top most div to be the one that has the most reward money 
  console.log("Initializing Hashpack Wallet setup w/ your credentials...");
  let extPg = await hps.setupWallet(browser,page, data);
  console.log("Hashpack Wallet setup successful!");

  console.log("Sorting Farm data before scraping and auto-harvesting...");
  let sortSelectorBtn = "#__next > div > div.MuiBox-root.css-zf0iqh > div.MuiContainer-root.css-nkatz7 > div > div > div.MuiBox-root.css-tw4vmx > div > div > div > div.MuiGrid-root.MuiGrid-container.css-1e2x7iq > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-grid-xs-4.MuiGrid-grid-sm-3.css-7jkkkb > div";
  await hps.domManipSleep(()=>page.click(sortSelectorBtn));
  await hps.domManipSleep(()=>page.click(sortSelectorBtn));
  console.log("Farm sort successful!");

  let timeAlive = 0;
  let timeStart = 0;
  //Loop through collecting values and adding to spreadsheet
  while(timeAlive < cons.TIME_OUT_AFTER_SECONDS * 1000){
    for(let i = 0; i < cons.PAIRS_TO_SCRAPE.length; i++){
      let pair = cons.PAIRS_TO_SCRAPE[i];
      let pairArr = pair.split("-");

      //Type in one of the tokens into the search bar as this will only give us pairs with that token
      console.log(pairArr[1]);
      console.log("Finding the proper cell for "+pair+" farm pair...");

      //Click Top Earnings div to get all content needed which will always be the 4th child
      let pairSelectorBtn = await hps.findPairSelector(pair, page);
      await hps.domManipSleep(()=>page.click(pairSelectorBtn));

      await page.bringToFront();
      
      console.log("Scraping "+pair+" data to excel sheet...");
      //Scrape Data to Spreadsheet
      timeStart = new Date();
      await hps.scrapeData(page, bookArr[i], sheetArr[i], xlsxPathArr[i], timeStart);
      console.log(pair+" data scrape successful!");

      //Auto Harvest if over the threshold
      let farmPairEarn = await hps.checkEarnings(page);
      if (farmPairEarn >= cons.MIN_HARVEST_AMT_DOLLARS) {
        console.log("Harvesting "+pair+" Rewards..."); 
        await hps.harvestEarnings(page, extPg); 
        console.log(pair+" harvest successful!");
      }
    }
    console.log("Sleeping for " + cons.DELAY_BETWEEN_READING_VALUES_SECONDS + " seconds before scraping and harvesting again...");
    await new Promise(resolve => setTimeout(resolve, cons.DELAY_BETWEEN_READING_VALUES_SECONDS * 1000));
    timeAlive += new Date() - timeStart;
  }

  //Close Out of Browser
  await browser.close();
}
main(); //Actual call to run above async func