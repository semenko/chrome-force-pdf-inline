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
    // Rather than intercept and parse all headers for content-type (slow, but catches ~everything)
    // we prefer to catch only PDF named files, as a faster best-effort for inline.
    {
        urls: ["*://*/*.pdf",
            "*://*/*.Pdf",
            "*://*/*.pDf",
            "*://*/*.pdF",
            "*://*/*.PDf",
            "*://*/*.PdF",
            "*://*/*.pDF",
            "*://*/*.PDF"],
        types: ["main_frame", "sub_frame"]
    },
    ["blocking", "responseHeaders"]
);
