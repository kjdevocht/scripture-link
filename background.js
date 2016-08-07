var link = null;


function createLink() {

    document.getElementById("tmp-clipboard").value = link;
    document.getElementById("tmp-clipboard").select();

    //Copy Content
    document.execCommand("Copy", false, null);
    link = null;


}

var showForPages = ["https://www.lds.org/*"];
chrome.contextMenus.create({
    title: "Create link", 
    contexts:["page","selection"], 
    onclick: createLink,
    documentUrlPatterns: showForPages,

});

chrome.runtime.onMessage.addListener(function(msg) {
    /* First, validate the message's structure */
    if (msg.from === 'scripture link') {
        link = msg.subject;
    }

});
