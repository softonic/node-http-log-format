# @softonic/http-log-format

Functions to transform native Node.js HTTP requests and responses to the Softonic HTTP log format

## Installation

```bash
npm install @softonic/http-log-format
```

## Usage

```js
// CommonJS
// const http = require('http');
// const {
//   formatRequest,
//   formatResponse,
//   stringifyRequest,
//   stringifyResponse,
// } = require('@softonic/http-log-format');

// ES2015
import http from 'http';
import {
  formatRequest,
  formatResponse,
  stringifyRequest,
  stringifyResponse,
} from '@softonic/http-log-format';

http.createServer((req, res) => {
  // send response...

  const formattedRequest = formatRequest(req, {
    // whitelist and blacklist should not be used together
    whitelistHeaders: ['accept', 'accept-language', 'host'],
    blacklistHeaders: ['cookie'],
  });
  const formattedResponse = formatResponse(res, {
    // whitelist and blacklist should not be used together
    whitelistHeaders: ['content-type', 'content-language', 'content-length'],
    blacklistHeaders: ['set-cookie'],
  });

  const message = `${stringifyRequest(req) ${stringifyResponse(res)}}`;

  // Some logger instance
  logger.info({
    request: formattedResponse,
    response: formattedResponse,
  }, message);
});

http.request(options, (res) => {
  // process response...

  const formattedRequest = formatRequest(res.req, {
    // whitelist and blacklist should not be used together
    whitelistHeaders: ['accept', 'accept-language', 'host'],
    blacklistHeaders: ['cookie'],
  });
  const formattedResponse = formatResponse(res, {
    // whitelist and blacklist should not be used together
    whitelistHeaders: ['content-type', 'content-language', 'content-length'],
    blacklistHeaders: ['set-cookie'],
  });

  const message = `${stringifyRequest(res.req) ${stringifyResponse(res)}}`;

  // Some logger instance
  logger.info({
    request: formattedResponse,
    response: formattedResponse,
  }, message);
});
```

## Testing

Clone the repository and execute:

```bash
npm test
```

## Contribute

1. Fork it: `git clone https://github.com/softonic/node-http-log-format.git`
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Added some feature'`
4. Check the build: `npm run build`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
