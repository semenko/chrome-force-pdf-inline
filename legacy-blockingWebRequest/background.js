/*
 Force PDFs to render inline in Chrome (for the Stable channel).

 Note: This is a slower version than the Declarative Web Request extension at:
 https://chrome.google.com/webstore/detail/render-pdfs-inline/mpmmilbhemhehclnkpkfepmaikiolaab

 (Unfortunately, the DWR API isn't available on the Stable channel.)


 WARNING: This may have significant security implications. If you don't understand why, do NOT install this extension.

 Author: Nick Semenkovich <semenko@alum.mit.edu> | https://nick.semenkovich.com/
 License: MIT
 */

chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        var responseHeaders = details.responseHeaders;
        responseHeaders.forEach(function(header){
            switch(header.name.toLowerCase()) {
                case 'content-disposition':
                    header.value = header.value.replace('attachment', 'inline');
                    console.log('Injecting Content-Disposition inline header for:', details);
                    break;
                case 'content-type':
                    if (header.value.indexOf('application/octet-stream') !== -1) {
                        // This might break stuff, but if you name your file PDF, we're gonna force it to be a PDF.
                        header.value = header.value.replace('application/octet-stream', 'application/pdf');
                        console.log('Injecting Content-Type PDF header for:', details);
                    }
                    break;
            }
        });
        return {responseHeaders: responseHeaders};
    },
    // Catch any PDF named files and rewrite attachment to inline.
    {
        urls: ["*://*/*.pdf",
            "*://*/*.Pdf",
            "*://*/*.pDf",
            "*://*/*.pdF",
            "*://*/*.PDf",
            "*://*/*.PdF",
            "*://*/*.pDF",
            "*://*/*.PDF"],
        types: ["main_frame"]
    },
    ["blocking", "responseHeaders"]
);

// Handle PDFs on non .pdf URLs.
chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        var responseHeaders = details.responseHeaders;
        var contentTypeIsPDF = false;
        var contentNotInline = true;
        var contentDispositionPosition = 0;
        responseHeaders.forEach(function(header, i){
            switch(header.name.toLowerCase()) {
                case 'content-disposition':
                    if (header.value.indexOf('inline') === -1) {
                        // We're not inline. Likely an attachment.
                        contentNotInline = true;
                        contentDispositionPosition = i;
                    }
                    break;
                case 'content-type':
                    if (header.value.indexOf('application/pdf') !== -1) {
                        // It's a PDF! Let's note that.
                        contentTypeIsPDF = true;
                    }
                    break;
            }
        });
        if (contentTypeIsPDF && contentNotInline) {
            // We are a PDF, but we're not inline. Let's set the inline header.
            console.log('Injecting Content-Type PDF header for:', details);
            if (details.responseHeaders[contentDispositionPosition].name.toLowerCase().indexOf('content-disposition') !== -1) {
                details.responseHeaders[contentDispositionPosition].value = "inline";
            } else {
                console.warn('Unexpected error in responseHeaders for:', details);
            }
        }
        return {responseHeaders: responseHeaders};
    },
    // Catch anything, and we'll match content type above.
    {
        urls: ["http://*/*", "https://*/*"],
        types: ["main_frame"]
    },
    ["blocking", "responseHeaders"]
);
