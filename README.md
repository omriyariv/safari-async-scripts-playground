# safari-async-scripts-playground

Test environment to test the behavior of async script tags in Safari.

## Install
Make sure to get the latest [Node.js](https://nodejs.org/en/) (tested with v18.16.1). Then clone this repo and install dependencies:
```sh
npm install
```

## Running
Start the webserver
```sh
npm start
```

## The bug
When setting the script tag with the async keyword, Safari waits for the DOMContentLoaded event before running the script. This seems to go against the [HTML spec](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script). Chrome seems to handle it correctly.

## Analyzing Results

You can control 2 features using the querystring:
- `?bootloader=1` will inject the script tag from an inline javascript ("the bootloader"). Otherwise the script tag is included in the original HTML flushed from the server.
- `?async=1` will include the async attribute on the script tag, whether it's injected by the bootloader or flushed with the original HTML.

Output:



- Visit https://localhost:3000 using Safari.
- With Brotli enabled, the browser dumps 5 lines at once. Opening the JS console confirms that all script tags executed roughly at the same time.
- With Brotli disabled, the broswer shows the HTML payload in chunks, since the server is configured to chunk 5 responses in 1 second intervals.
- Testing on Chrome with Brotli enabled confirms chunked responses are incrementally shown on screen.
