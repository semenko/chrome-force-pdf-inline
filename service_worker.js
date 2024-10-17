'use strict';

const IN_DEBUG_MODE = !('update_url' in chrome.runtime.getManifest());

if (IN_DEBUG_MODE) {
  console.log('Logging started!');

  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
    const msg = `PDF forced inline at ${e.request.url}\n\tMatched on rule: ${e.rule.ruleId}`;
    console.log(msg);
  });
}