/*
 Force PDFs to render inline in Chrome.

 WARNING: This may have significant security implications. If you don't understand why, do NOT install this extension.

 Author: Nick Semenkovich <semenko@alum.mit.edu> | https://nick.semenkovich.com/
 License: MIT
*/

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

// Enable this line (and the rule to SendMessage) if you're debugging.
// chrome.declarativeWebRequest.onMessage.addListener(function callback(details) { console.log(details.message + ' ' + details.stage + ' ' + details.requestId); });

