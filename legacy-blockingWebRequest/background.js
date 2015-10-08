/*
 Force PDFs to render inline in Chrome.

 WARNING: This may have significant security implications. If you don't understand why, do NOT install this extension.

 Author: Nick Semenkovich <semenko@alum.mit.edu> | https://nick.semenkovich.com/
 License: MIT
 */

chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        console.log(details);
        var responseHeaders = details.responseHeaders;
        console.log(responseHeaders);
        responseHeaders.forEach(function(header){
            switch(header.name.toLowerCase()) {
                case 'content-disposition':
                    if (header.name.toLowerCase() == 'content-disposition') {
                        header.value = header.value.replace('attachment;', 'inline;');
                        console.log('Injecting inline header for:', details)
                    }
                    break;
            }
        });
        return {responseHeaders: responseHeaders};
    },
    // Rather than intercept and parse all headers for content-type (slow, but catches ~everything)
    // we prefer to catch only PDF named files, as a faster best-effort for inline.
    {urls: ["*://*/*.pdf",
	    "*://*/*.Pdf",
	    "*://*/*.pDf",
	    "*://*/*.pdF",
	    "*://*/*.PDf",
	    "*://*/*.PdF",
	    "*://*/*.pDF",
	    "*://*/*.PDF"]},
    ["blocking", "responseHeaders"]
);

/*
var rule = {
    conditions: [
        new chrome.declarativeWebRequest.RequestMatcher({
            resourceType: ['main_frame'], // Only rewrite if the PDF is the whole window, not some iframe, etc.
            contentType: ['application/pdf'],
            responseHeaders: [{nameEquals: 'Content-Disposition', valueContains: 'attachment'}],
            stages: ["onHeadersReceived"]
        }),
        new chrome.declarativeWebRequest.RequestMatcher({
            resourceType: ['main_frame'], // Only rewrite if the PDF is the whole window, not some iframe, etc.
            contentType: ['application/octet-stream'],
            responseHeaders: [
                {nameEquals: 'Content-Disposition', valueContains: '.pdf'}
            ],
            stages: ["onHeadersReceived"]
        })
    ],
    actions: [
        new chrome.declarativeWebRequest.RemoveResponseHeader({name: 'Content-Disposition'}),
        new chrome.declarativeWebRequest.AddResponseHeader({name: 'Content-Disposition', value: 'inline'}),
        new chrome.declarativeWebRequest.RemoveResponseHeader({name: 'Content-Type'}),
        new chrome.declarativeWebRequest.AddResponseHeader({name: 'Content-Type', value: 'application/pdf'}),
        // Uncomment for debug logging. See bottom of this file for the listener.
        // new chrome.declarativeWebRequest.SendMessageToExtension({message: 'Rewriting PDF header.'})
    ]};


function addRule() {
    chrome.declarativeWebRequest.onRequest.addRules([rule]);
}

// This runs on first install & after version updates, etc.
function setup() {
    // Remove all rules and add ours back in.
    chrome.declarativeWebRequest.onRequest.removeRules(null,
        function() {
            if (chrome.runtime.lastError) {
                console.error('Error clearing rules: ' + chrome.runtime.lastError);
            } else {
                addRule();
            }
        });
}

// Set some onInstalled listeners to fire, since we're not a persistent background page.
chrome.runtime.onInstalled.addListener(setup);
/*


 */
// Enable this line (and the rule to SendMessage) if you're debugging.
// chrome.declarativeWebRequest.onMessage.addListener(function callback(details) { console.log(details.message + ' ' + details.stage + ' ' + details.requestId); });

