# **Installation Instructions For Both the WagScraper and SauceScraper**

### Installing Node.js and NPM

1. Navigate to https://nodejs.org/en/download/ and download the installer that corresponds to your OS.
2. Double click your download to install it.
3. Verify your install by opening a command prompt and typing `node -v` hitting enter and `npm -v` and hitting enter. Both of these should return versions.

### Clone the CoinScraper repository

* Open a command prompt, navigate to your Documents folder, using `cd C:\[foo]` where [foo] is the path to your Documents folder and type `git clone https://github.com/dptheodore/CoinScraper.git` and hit enter.

### Installing Node Modules in the CoinScraper repository

1. Open a command prompt and navigate to where you cloned the CoinScraper repository, if you've been following the installation instructions so far that should be `C:\Users\[YOUR_USER_NAME]\Documents\CoinScraper` ****NOTE: For this document, we'll use `[foo]` interchangably with `Users\[YOUR_USER_NAME]\Documents`****
2. Type `npm install` which will automatically download and install all node modules necessary to run the scrapers.

### Installing Chromium

Now we need to install `Chromium,` via `puppeteer`, which is a version of the Chrome browser that allows for automated processes, like this CoinScraper. To do this:

1. In the same command prompt you used in the previous step type `cd node_modules/puppeteer` to navigate to the puppeteer module folder which houses the download info for Chromium
2. Now type `npm run install` and allow the download and install to complete and finish.

# Addt'l Installation for SauceScraper

The following instructions are required for using the **SauceScraper**

## **Create a Private Key File**
1. Use File Explorer to navigate to where you cloned SauceScraper (it should be `C:\[foo]\CoinScraper`)
2. Right click in File Explorer, and click *New* > *Text Document* and name the document `privateKey`, so the file should be `privateKey.txt`
3. ****IMPORTANT:**** Make sure the text document is exactly `privateKey.txt` for you and your wallet's safety.
4. Copy exactly the following into `privateKey.txt` document and save it:
```
{
	"privateKey": "PRIVATE_KEY",
	"accountAddress": "ACCOUNT_ADDR"
}
```

## **Importing your HashPack Wallet Private Key**
1. Open Chrome and click the HashPack extension.
2. Use your wallet's password to login.
3. Locate your wallet's address in the top left corner of the HashPack extension, and click it to copy your wallet's address.
4. Open `privateKey.txt` and replace `ACCOUNT_ADDR` with the address you just copied.
5. Click the ☰ symbol in the top right corner of the extension.
6. Click "Settings".
7. Click the "View" button Below *View current wallet 24-word phrase/private key*.
8. Re-enter your password and click "Unlock".
9. Click "Copy Private Key to Clipboard".
10. Open `privateKey.txt` and replace `PRIVATE_KEY` with the key you just copied.
11. Save `privateKey.txt` and close the file.
12. ****NOTE:**** As long as you named the file exactly `privateKey.txt` this file will stay local and your sensitive wallet data won't be tracked, but do not share this text file with anyone.

## **Running SauceScraper**
1. Open a command prompt and navigate to the folder in which you cloned SauceScraper (it should be `C:\[foo]\CoinScraper`)
2. Type `node sauceScraper.js` and hit enter
3. A small Chrome like browser will pop up and automatically begin checking the saucerswap website and scraping data and auto-harvesting every 2 minutes until the browser is closed or the process is terminated.
4. Make sure not to mess with or close out of the browser or command prompt to keep SauceScraper running.

## **Adding your Excel Sheet to SauceScraper**
Simply copy your excel sheet into the folder you cloned SauceScraper (it should be `C:\[foo]\CoinScraper`) and rename it `[lpPair].xlsx` where `[lpPair]` is the name of both tokens you're tracking.
For example, if the excel sheet is for the HBAR-USDC pair, you would name the file `HBAR-USDC.xlsx`. 

## **Altering How SauceScraper scrapes and harvests**
By default, SauceScraper scrapes the SaucerSwap website every 2 minutes and harvests for all the pairs its tracking when they have rewards of $20 or more. It does so until the process is terminated, or the Chromium browser is closed.

To change this:
1. Open `constants.js` in the CoinScraper folder
2. `MIN_HARVEST_AMT_DOLLARS` is the amount of money in USD at which SauceScraper will start auto-harvesting farm pairs. Default = $20
3. `PAIRS_TO_SCRAPE_HARVEST` is an array of strings for each pair you want to track and auto-harvest. ****NOTE: Make sure to add them exactly as they appear on the SaucerSwap site. (i.e. HBAR-USDC is correct since thats how it's listed on SaucerSwap, not USDC-HBAR)****
4. `DELAY_BETWEEN_READING_VALUES_SECONDS` is how long SauceScraper waits that many seconds between instances of scraping and auto-harvesting.
5. `TIME_OUT_AFTER_SECONDS` is how long SauceScraper will run for. Remember: `Infinity` means it will run indefinitely until terminated.
6. `DELAY_BETWEEN_CLICKS_SECONDS` is how long SauceScraper waits between instigating clicks on the browser. It is currently at the smallest delay to work, but if you find SauceScraper throws errors to the cmd line, or becomes buggy, increasing this value may help.
7. `PATH_TO_EXCEL_SHEET` is the relative path to which SauceScraper saves all of its excel sheets. It defaults to saving in the same folder as it runs. In general, its easier to just copy your excel sheets over into this folder, but this can be changed if needed.




# Addt'l Installation for WagScraper **ONLY**

The following instructions are for using the WagScraper **ONLY**

## **Importing your Metamask Seedphrase**
1. Open your Chrome browser and click the MetaMask extension and enter your password.
2. Click the circle in the top right corner of the extension and then click the box that reads **Settings**
3. Now click **Security and Privacy** and then click the red box that reads **Reveal Secret Recovery Phrase**
4. Fill in your password again and then copy the 12 word phrase that appears.
5. Use File Explorer to navigate to where you cloned WagScraper (it should be `C:\[foo]\CoinScraper`)
6. Right click in File Explorer, and click *New* > *Text Document* and name the document `seedPhrase`, so the file should be `seedPhrase.txt`
7. ****IMPORTANT:**** Make sure the text document is exactly `seedPhrase.txt` for your and your wallet's safety.
8. Copy the 12 word phrase into the `seedPhrase.txt` document and save it.

## **Running WagScraper**
1. Open a command prompt and navigate to the folder in which you cloned WagScraper (it should be `C:\[foo]\CoinScraper`)
2. Type `node wagScraper.js` and hit enter
3. A small Chrome like browser will pop up and automatically begin checking the wagyuswap website and filling in an Excel sheet every 2 minutes until the browser is closed or the process is terminated.
4. Make sure not to mess with or close out of the browser or command prompt to keep the WagScraper running.

## **Adding your Excel Sheet to WagScraper**
Simply copy your excel sheet into the folder you cloned WagScraper and rename it `excelSheet.xlsx`

## **Altering How Often WagScraper scrapes and how long it scrapes**
By default, WagScraper scrapes the wagyuswap website every 2 minutes and does so until the process is terminated, or the Chromium browser is closed.

To change this:
1. Open `wagScraper.js` in the CoinScraper folder
2. `PATH_TO_EXCEL_SHEET` is the path and name of the Excel Sheet WagScraper saves to
3. `DELAY_BETWEEN_READING_VALUES_SECONDS` is the amount of time, in seconds, WagScraper waits to scrape the website and add a new row of values to the excel sheet (Defaults to 2 minutes)
4. `TIME_OUT_AFTER_SECONDS` is how long, in seconds, WagScraper will spend scraping data. (Default is *Infinity* meaning it only terminates when you terminate the process or close the Chromium browser)
