# **Installation Instructions**

### Installing Node.js and NPM

1. Navigate to https://nodejs.org/en/download/ and download the installer that corresponds to your OS.
2. Double click your download to install it.
3. Verify your install by opening a command prompt and typing `node -v` hitting enter and `npm -v` and hitting enter. Both of these should return versions.

### Clone the WagScraper repository

* Open a command prompt, navigate to your Documents folder, using `cd C:\[foo]` where [foo] is the path to your Documents folder and type `git clone https://github.com/dptheodore/WagScraper.git` and hit enter.

### Installing Node Modules in the WagScraper repository

1. Open a command prompt and navigate to where you cloned the WagScraper repository, if you've been following the installation instructions so far that should be `C:\[foo]\WagScraper`
2. Type `npm install` which will automatically download and install all node modules necessary to run the WagScraper.

### Installing Chromium

Now we need to install `Chromium,` via `puppeteer`, which is a version of the Chrome browser that allows for automated processes, like this WagScraper. To do this:

1. In the same command prompt you used in the previous step type `cd node_modules/puppeteer` to navigate to the puppeteer module folder which houses the download info for Chromium
2. Now type `npm run install` and allow the download and install to complete and finish.

# **Importing your Metamask Seedphrase**
1. Open your Chrome browser and click the MetaMask extension and login.
2. Click the circle in the top right corner of the extension and then click the box that reads **Settings**
3. Now click **Security and Privacy** and then click the red box that reads **Reveal Secret Recovery Phrase**
4. Fill in your password again and then copy the 12 word phrase that appears.
5. Use File Explorer to navigate to where you cloned WagScraper (it should be `C:\[foo]\WagScraper`)
6. Right click in File Explorer, and click *New* > *Text Document* and name the document `seedPhrase`, so the file should be `seedPhrase.txt`
7. ****IMPORTANT:**** Make sure the text document is exactly `seedPhrase.txt` for your and your wallet's safety.
8. Copy the 12 word phrase into the `seedPhrase.txt` document and save it.

# **Running WagScraper**
1. Open a command prompt and navigate to the folder in which you cloned WagScraper (it should be `C:\[foo]\WagScraper`)
2. Type `node index.js` and hit enter
3. A small Chrome like browser will pop up and automatically begin checking the wagyuswap website and filling in an Excel sheet every 2 minutes until the browser is closed or the process is terminated.
4. Make sure not to mess with or close out of the browser or command prompt to keep the WagScraper running.

# **Adding your Excel Sheet to WagScraper**
Simply copy your excel sheet into the folder you cloned WagScraper and rename it `excelSheet.xlsx`

# **Altering How Often WagScraper scrapes and how long it scrapes**
By default, WagScraper scrapes the wagyuswap website every 2 minutes and does so until the process is terminated, or the Chromium browser is closed.

To change this:
1. Open `index.js` in the WagScraper folder
2. `PATH_TO_EXCEL_SHEET` is the path and name of the Excel Sheet WagScraper saves to
3. `DELAY_BETWEEN_READING_VALUES_SECONDS` is the amount of time, in seconds, WagScraper waits to scrape the website and add a new row of values to the excel sheet (Defaults to 2 minutes)
4. `TIME_OUT_AFTER_SECONDS` is how long, in seconds, WagScraper will spend scraping data. (Default is *Infinity* meaning it only terminates when you terminate the process or close the Chromium browser)
