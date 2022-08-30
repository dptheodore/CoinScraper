export const PATH_TO_HASHPACK_EXT = "./hashPack/";

//USER DEFINED CONSTANTS
export const MIN_HARVEST_AMT_DOLLARS = 20; //The dollar amount at which you want this program to harvest a farm pair.
//********NOTE:For each LP pair below,only enter names in which you have money in the farm pool. Also, enter the token names in order they appear on the saucer swap website. For example, it has to be HBAR-USDC, USDC-HBAR would be incorrect*********************
export const PAIRS_TO_HARVEST = ["SAUCE-HBARX", "HBAR-USDC" ]; //Means this program will auto harvest at the MIN_HARVEST_AMT for each of these farm pairs
export const PAIRS_TO_SCRAPE  = ["SAUCE-HBARX", "HBAR-USDC" ]; //Means this program will create/append to an excel spreadsheet for each of these farm pairs
export const DELAY_BETWEEN_READING_VALUES_SECONDS = 2*60; // 2 minute delay between reading values into the excel spreadsheet
export const TIME_OUT_AFTER_SECONDS = 10*60; //Infinity means this program will run for Infinity seconds, namely you'll have to manually terminate the process to stop it
export const DELAY_BETWEEN_CLICKS_SECONDS = 0.4; //If you find that the program is erroring out, or not working, you probably need a longer delay between clicks
export const PATH_TO_EXCEL_SHEET = "./"; //The folder in which you want your excel sheets to reside on your computer. Defaults to the root of this project. (i.e. the same folder as this file)