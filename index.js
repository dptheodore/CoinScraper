import puppeteer from 'puppeteer';
import dappeteer from '@chainsafe/dappeteer';
import Excel from 'exceljs';
import * as fs from 'fs';

var SEED_PHRASE = ""; //Importing Seed Phrase for Wallet from text file in same dir
var PATH_TO_EXCEL_SHEET = "./excelSheet.xlsx";
var DELAY_BETWEEN_READING_VALUES_SECONDS = 0.5*60; // 1 minute delay between reading values into the excel spreadsheet
var TIME_OUT_AFTER_SECONDS = Infinity; //Infinity means this program will run for Infinity seconds, namely you'll have to manually terminate the process to stop it

//Reading in Seed Phrase to import wallet
fs.readFile('seedPhrase.txt', (err,data) => {
  if (!err) SEED_PHRASE = data.toString();
});

async function main() {
  const browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.8.1' });

  if (SEED_PHRASE == "") console.log("Add your secret 12 word seed phrase to a \"seedPhrase.txt\" file located in the same directory as this js file, if you want to track your WAG quantity.");

  const config = SEED_PHRASE == "" ? 
    {
      showTestNets: true,
      hideSeed: true
    } 
    : 
    {
      seed: SEED_PHRASE,
      showTestNets: true,
      hideSeed: true
    };

  //setup Metamask wallet
  const metamask = await dappeteer.setupMetamask(browser, config);

  //Add Velas Network to track Velas Tokens
  await metamask.addNetwork({
    networkName: 'Velas Network',
    rpc: 'https://evmexplorer.velas.com/rpc',
    chainId: 106,
    symbol: 'VLX',
    explorer: 'https://evmexplorer.velas.com/rpc'
  });

  //Swap to Velas Network
  await metamask.switchNetwork('Velas Network');

  //Navigate to WAG SITE
  const page = await browser.newPage();
  await page.goto('https://exchange.wagyuswap.app/farms');

  //Connecting Metamask Wallet
  await page.click('#root > div.sc-fmdNqN.hyACbC > nav > div:nth-child(2) > button');
  await page.click('#wallet-connect-metamask > svg');
  await metamask.approve();

  //Pull focus back to WagyuSwap page
  await page.bringToFront();

  //Create Excel Sheet
  let workbook = new Excel.Workbook();
  let worksheet;

  if(fs.existsSync(PATH_TO_EXCEL_SHEET)){
    await workbook.xlsx.readFile(PATH_TO_EXCEL_SHEET);
    worksheet = workbook.worksheets[0];
  }
  
  else{
    worksheet = workbook.addWorksheet("WAG Spreadsheet");
    worksheet.addRow(["Date", "Time", "WAG Price", "LPTokenQuant", "LP Val", "% of Pool", "Liquidity"]);
  }
  let timeAlive = 0;
  while(timeAlive < TIME_OUT_AFTER_SECONDS * 1000){    //Grab values needed for spreadsheet
    let timeStart = new Date();
    await page.click('#root > div.sc-fmdNqN.hyACbC > nav > div:nth-child(1) > div.sc-jSFjdj.sc-gKAaRy.kJmatq.jcNvwq > button > svg');
    await page.waitForSelector('#root > div.sc-fmdNqN.hyACbC > div > div.sc-eEVmNe.kYTqSi > div.sc-fXgAZx.iTGMnc > div > a > div');
    let priceElem = await page.$('#root > div.sc-fmdNqN.hyACbC > div > div.sc-eEVmNe.kYTqSi > div.sc-fXgAZx.iTGMnc > div > a > div')
    let wagPrice = await page.evaluate(el => el.textContent, priceElem);
    await page.click('#root > div.sc-fmdNqN.hyACbC > nav > div:nth-child(1) > div.sc-jSFjdj.sc-gKAaRy.kJmatq.jcNvwq > button > svg > path');
  
    await page.waitForSelector('#farms-table > div > div.sc-hDrgck.hIzKoN > table > tbody > tr:nth-child(11) > td > div > div.sc-cdlubJ.iyHQFa > div:nth-child(2) > div.sc-gLwjMs.bLlYPs > div:nth-child(1) > h2');
    let quantElem = await page.$('#farms-table > div > div.sc-hDrgck.hIzKoN > table > tbody > tr:nth-child(11) > td > div > div.sc-cdlubJ.iyHQFa > div:nth-child(2) > div.sc-gLwjMs.bLlYPs > div:nth-child(1) > h2')
    let lpTokenQuant = await page.evaluate(el => el.textContent, quantElem);
  
    await page.waitForSelector('#farms-table > div > div.sc-hDrgck.hIzKoN > table > tbody > tr:nth-child(11) > td > div > div.sc-cdlubJ.iyHQFa > div:nth-child(2) > div.sc-gLwjMs.bLlYPs > div:nth-child(1) > div.sc-gtsrHT.dCunSw > span');
    let usdElem = await page.$('#farms-table > div > div.sc-hDrgck.hIzKoN > table > tbody > tr:nth-child(11) > td > div > div.sc-cdlubJ.iyHQFa > div:nth-child(2) > div.sc-gLwjMs.bLlYPs > div:nth-child(1) > div.sc-gtsrHT.dCunSw > span')
    let usdVal = await page.evaluate(el => el.textContent, usdElem);
  
    await page.waitForSelector('#farms-table > div > div.sc-hDrgck.hIzKoN > table > tbody > tr:nth-child(11) > td > div > div.sc-cdlubJ.iyHQFa > div:nth-child(2) > div.sc-gLwjMs.bLlYPs > div:nth-child(1) > div.sc-gtsrHT.iZXrcj');
    let pctElem = await page.$('#farms-table > div > div.sc-hDrgck.hIzKoN > table > tbody > tr:nth-child(11) > td > div > div.sc-cdlubJ.iyHQFa > div:nth-child(2) > div.sc-gLwjMs.bLlYPs > div:nth-child(1) > div.sc-gtsrHT.iZXrcj')
    let pctPool = await page.evaluate(el => el.textContent, pctElem);
  
    await page.waitForSelector('#farms-table > div > div.sc-hDrgck.hIzKoN > table > tbody > tr:nth-child(11) > td > div > div.sc-eSRwjH.jiXGgW > div:nth-child(3) > div.sc-epOimh.bvFYXK > div.sc-eEnULY.hkxddR > div');
    let liqElem = await page.$('#farms-table > div > div.sc-hDrgck.hIzKoN > table > tbody > tr:nth-child(11) > td > div > div.sc-eSRwjH.jiXGgW > div:nth-child(3) > div.sc-epOimh.bvFYXK > div.sc-eEnULY.hkxddR > div')
    let liq = await page.evaluate(el => el.textContent, liqElem);
  
    var currentDate = new Date();
    var date = currentDate.getMonth()+1 + "/" + currentDate.getDate() + "/" + currentDate.getFullYear();
  
    var time = currentDate.getHours() + ":" + currentDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits:2}); 

    worksheet.addRow([date, time, wagPrice,lpTokenQuant,usdVal,pctPool,liq]).commit();
    await workbook.xlsx.writeFile(PATH_TO_EXCEL_SHEET);

    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_READING_VALUES_SECONDS * 1000));
    timeAlive += new Date() - timeStart;
  }

  //Close Out of Browser
  await browser.close();
}
main(SEED_PHRASE);