///<reference types="chrome"/>

chrome.runtime.onInstalled.addListener(() => {
    //this is just an example
    //   chrome.storage.sync.set({ color });
    //   console.log('Default background color set to %cgreen', `color: ${color}`);
});

chrome.action.onClicked.addListener(function (listener) {
    openExtension();
});

let queuedLocalTransactions = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log("Background script recieved message", request)
    
    switch(request.type) {
        case "hashconnect-connect-extension-forward":
            chrome.tabs.query({
                url: chrome.runtime.getURL('dist/*'),
            }, function (tabs) {
                if (tabs.length == 0) {
                    queuedLocalTransactions.push({ type: "Pairing", message: request.pairingString, origin: request.origin });
                    openExtension();
                } else {
                    chrome.runtime.sendMessage({type: "hashconnect-connect-extension-forward-to-app", pairingString: request.pairingString, origin: request.origin });
                    chrome.tabs.update(tabs[0].id, { active: true });
                    chrome.windows.update(tabs[0].windowId, { focused: true })
                }
            });
            
        break;
        case "hashconnect-send-local-transaction-forward":
            chrome.tabs.query({
                url: chrome.runtime.getURL('dist/*'),
            }, function (tabs) {
                if (tabs.length == 0) {
                    queuedLocalTransactions.push({ type: "Transaction", message: request.transaction, origin: request.origin });
                    openExtension();
                } else {
                    chrome.runtime.sendMessage({type: "hashconnect-local-transaction-forward-to-app", transaction: request.transaction, origin: request.origin});
                    chrome.tabs.update(tabs[0].id, { active: true });
                    chrome.windows.update(tabs[0].windowId, { focused: true })
                }
            });
        break;
        case "hashconnect-app-ready-for-queued-messages":
            // console.log("App ready for queued messages, currently queued: ", queuedLocalTransactions);

            queuedLocalTransactions.forEach(queued_message => {
                switch(queued_message.type){
                    case "Transaction":
                        chrome.runtime.sendMessage({type: "hashconnect-local-transaction-forward-to-app", transaction: queued_message.message, origin: queued_message.origin});
                    break;
                    case "Pairing":
                        chrome.runtime.sendMessage({type: "hashconnect-connect-extension-forward-to-app", pairingString: queued_message.message, origin: queued_message.origin});
                        break;
                }
            })

            queuedLocalTransactions = [];
        break;
    }
    
    //   chrome.notifications.create('worktimer-notification', request.options, function() { });

    sendResponse();
});


function openExtension() {
    var options_url = chrome.runtime.getURL('dist/index.html');
    chrome.tabs.query({
        url: chrome.runtime.getURL('dist/*'),
    }, function (tabs) {
        if (tabs.length == 0) {
            chrome.tabs.create({
                url: options_url,
                active: false
            }, function (tab) {
                // After the tab has been created, open a window to inject the tab
                chrome.windows.create({
                    tabId: tab.id,
                    type: 'popup',
                    focused: true,
                    width: 600,
                    height: 850
                    // incognito, top, left, ...
                });
            });
        } else {
            // If there's more than one, close all but the first
            for (var i = 1; i < tabs.length; i++)
                chrome.tabs.remove(tabs[i].id);
            // And focus the options page
            chrome.tabs.update(tabs[0].id, { active: true });
            chrome.windows.update(tabs[0].windowId, { focused: true })
        }
    });
}