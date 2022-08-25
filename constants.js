export const DELAY_BETWEEN_READING_VALUES_SECONDS = 2*60; // 2 minute delay between reading values into the excel spreadsheet
export const TIME_OUT_AFTER_SECONDS = 10*60; //Infinity means this program will run for Infinity seconds, namely you'll have to manually terminate the process to stop it
export const DELAY_BETWEEN_CLICKS_SECONDS = 0.4;
export const HBARUSDCPrefixSelector = "#__next > div > div.MuiBox-root.css-zf0iqh > div.MuiContainer-root.css-nkatz7 > div > div > div.MuiBox-root.css-tw4vmx > div > div > div > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.MuiAccordion-root.MuiAccordion-rounded.Mui-expanded.css-1uhiqn8";
export const HBARUSDCHeaderSelector = HBARUSDCPrefixSelector + " > div.MuiButtonBase-root.MuiAccordionSummary-root.Mui-expanded.css-1g8uv80 > div.MuiAccordionSummary-content.Mui-expanded.css-1n11r91";
export const HBARUSDCContentSelector = "#__next > div > div.MuiBox-root.css-zf0iqh > div.MuiContainer-root.css-nkatz7 > div > div > div.MuiBox-root.css-tw4vmx > div > div > div > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.MuiAccordion-root.MuiAccordion-rounded.Mui-expanded.css-1uhiqn8 > div.MuiCollapse-root.MuiCollapse-vertical.MuiCollapse-entered.css-c4sutr > div > div > div";
export const PATH_TO_EXCEL_SHEET = "./hbarUSDC.xlsx";
export const MIN_HARVEST_AMT_DOLLARS = 20;