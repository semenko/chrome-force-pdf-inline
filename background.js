/*
Force PDFs to render inline in Chrome.

WARNING: This has significant security implications. If you don't understand why, do NOT install this extension.

Author: Nick Semenkovich <semenko@alum.mit.edu>
License: MIT
*/

var rule = {
    conditions: [
		 new chrome.declarativeWebRequest.RequestMatcher({
			 resourceType: ['main_frame'],
			 contentType: ['application/pdf'],
			 responseHeaders: [{nameEquals: 'Content-Disposition', valueContains: 'attachment'}],
			 stages: ["onHeadersReceived"]
		     })
		 ],
    actions: [
	      new chrome.declarativeWebRequest.RemoveResponseHeader({name: 'Content-Disposition'}),
	      new chrome.declarativeWebRequest.AddResponseHeader({name: 'Content-Disposition', value: 'inline'}),
	      // Uncomment for debug logging. See bottom of this file for the listener.
	      // new chrome.declarativeWebRequest.SendMessageToExtension({message: 'Rewriting PDF header.'})
	      ]};


function addRule() {
    chrome.declarativeWebRequest.onRequest.addRules([rule]);
}

// Remove all rules, then add (or re-add) our rule.
// This applies after an update/version bump, etc.
function setup() {
    // Remove all rules and add ours
    chrome.declarativeWebRequest.onRequest.removeRules(null,
						       function() {
							   if (chrome.runtime.lastError) {
							       console.error('Error clearing rules: ' + chrome.runtime.lastError);
							   } else {
							       addRule();
							   }
						       });
};

// Set some onInstalled listeners to fire, since we're not a persistent background page.
chrome.runtime.onInstalled.addListener(setup);

// Enable this line (and the rule to SendMessage) if you're debugging.
// chrome.declarativeWebRequest.onMessage.addListener(function callback(details) { console.log(details.message + ' ' + details.stage + ' ' + details.requestId); });

