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
// const { formatRequest, formatResponse } = require('@softonic/http-log-format');

// ES2015
import http from 'http';
import { formatRequest, formatResponse } from '@softonic/http-log-format';

http.createServer((req, res) => {
  // send response...

  const formattedRequest = formatRequest(req);
  const formattedResponse = formatResponse(res);

  // Some logger instance
  logger.info({
    request: formattedResponse,
    response: formattedResponse,
  });
});

http.request(options, (res) => {
  // process response...

  const formattedRequest = formatRequest(res.req);
  const formattedResponse = formatResponse(res);

  // Some logger instance
  logger.info({
    request: formattedResponse,
    response: formattedResponse,
  });
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
