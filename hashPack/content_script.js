window.addEventListener("message", function (event) {
    if (event.data.type && (event.data.type == "hashconnect-query-extension")) {
        // console.log("HashPack extension content script received extension query: ", event.data);

        let metadata = {
            name: "HashPack",
            icon: "https://wallet.hashpack.app/assets/favicon/favicon.ico",
            description: "A HBAR wallet"
        }

        window.postMessage({ type: "hashconnect-query-extension-response", metadata: metadata }, "*");

    } else if (event.data.type && (event.data.type == "hashconnect-connect-extension")) {
        // console.log("HashPack extension content received pairing request: ", event.data);
        if(chrome.runtime)
            chrome.runtime.sendMessage({ type: "hashconnect-connect-extension-forward", pairingString: event.data.pairingString, origin: event.origin});
        else
            window.postMessage({ type: "hashconnect-connect-extension-forward", pairingString: event.data.pairingString, origin: event.origin }, "*");
    } else if(event.data.type && (event.data.type == "hashconnect-send-local-transaction")){
        // console.log("HashPack extension content received transaction: ", event.data);
        if(chrome.runtime)
            chrome.runtime.sendMessage({ type: "hashconnect-send-local-transaction-forward", transaction: event.data.message, origin: event.origin});
        else
            window.postMessage({ type: "hashconnect-send-local-transaction-forward", transaction: event.data.message, origin: event.origin }, "*");
    }
}, false);


window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    //enter here the action you want to do once loaded 
},false);
