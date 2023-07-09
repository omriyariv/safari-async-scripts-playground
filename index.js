const express = require('express');
const http = require('http');
let compression = require('compression');

const PORT = 3000;
const FINAL_RESPONSE_DELAY = 5000;
const BYTES_LENGTH = 1024 * 5;

const app = express();
const dummyPayload = Buffer.alloc(BYTES_LENGTH, '.');

// Exposes the flush() method
app.use(compression());

// Makes /script.js available
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200);
  res.write(`<!DOCTYPE html><html><head>`);
  if (req.query.bootloader) {
    const bootloader = `
      console.log("bootloader init");
      console.log("async=${!!req.query.async}");
      const scriptTag = document.createElement('script');
      scriptTag.setAttribute('src', '/script.js');
      ${req.query.async ? "scriptTag.setAttribute('async', '1');" : ""}
      document.head && document.head.appendChild(scriptTag);
    `;
    res.write(`<script>${bootloader}</script>`);
  } else {
    res.write(`<script src="/script.js" ${req.query.async ? 'async' : ''}></script>`);
  }
  // Safari buffers before parsing initial HTML, this long script
  // with a long comment line forces it to parse after the first flush.
  res.write(`<script>console.log('first flush parsed'); // ${dummyPayload}</script></head>`);
  res.flush();

  setTimeout(() => {
    res.write(`<body><script>console.log('body parsed, response ended');</script></body></html>`);
    res.end();
  }, FINAL_RESPONSE_DELAY);
});

http.createServer(app).listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
