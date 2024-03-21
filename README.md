chrome-force-pdf-inline
=======================

A Chrome extension to force PDFs to render inline (overrides Content-Disposition: attachment).

This prevents PDFs from saving & downloading instead of simply opening in Chrome.


## Versions

There are two version of this extension:

- The declarativeWebRequest (DWR) version, which uses an API only available in the beta/dev channels of Chrome.
This is lean, and works as an event page.

- The legacy blockingWebRequest version, which works on the Stable channel of Chrome, but uses an annoying blocking
request handler and an always in-memory background page.


## Installation

Install this app from the [Chrome store](https://chromewebstore.google.com/detail/render-pdfs-inline/mhigkpfinipcldigeeonlokhpdpnkelg)

## Author
**Nick Semenkovich**

+ https://github.com/semenko/
+ https://nick.semenkovich.com/

## License
Copyright 2014-2015, Nick Semenkovich \<semenko@alum.mit.edu\>.

Released under the MIT License. See LICENSE for details.
