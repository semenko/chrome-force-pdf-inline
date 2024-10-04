'use strict';

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
  const msg = `PDF forced inline at ${e.request.url}\n\tMatched on rule: ${e.rule.ruleId}`;
  console.log(msg);
});

console.log('This app is by Nick Semenkovich <semenko@alum.mit.edu>.\n\nLogging started.');
