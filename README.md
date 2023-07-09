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

## Testing

You can control 2 features using the querystring:
- `?bootloader=1` will inject the script tag from an inline javascript ("the bootloader"). Otherwise the script tag is included in the original HTML flushed from the server.
- `?async=1` will include the async attribute on the script tag, whether it's injected by the bootloader or flushed with the original HTML.

## Output

http://127.0.0.1:3000

Safari 16.5
```
script executing
first flush parsed
body parsed, response ended
````

Chrome 114
```
script executing
first flush parsed
body parsed, response ended
```

http://127.0.0.1:3000?async=1

Safari 16.5
```
first flush parsed
body parsed, response ended
script executing
```

Chrome 114
```
script executing
first flush parsed
body parsed, response ended
```

http://127.0.0.1:3000?bootloader=1

Safari 16.5
```
bootloader init
async=false
first flush parsed
script executing
body parsed, response ended
```

Chrome 114
```
bootloader init
async=false
first flush parsed
script executing
body parsed, response ended
```

http://127.0.0.1:3000?bootloader=1&async=1

Safari 16.5
```
bootloader init
async=true
first flush parsed
body parsed, response ended
script executing
```

Chrome 114
```
bootloader init
async=true
first flush parsed
script executing
body parsed, response ended
```

## Analysis
In Safari, regardless if the script was included in the original HTML or injected dynamically by an inline bootloader, setting the async keyword causes the script to be executed after the reponse ended (I'm assuming thi is triggered by DOMContentLoaded).
