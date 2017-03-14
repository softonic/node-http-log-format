import httpHeaders from 'http-headers';

export function formatRequest(request) {
  // `httpVersion` is only available in incoming requests
  const { httpVersion, method } = request;

  // `timestamp` does not belong to the classes that the core Node.js http[s] module returns,
  // but we use it if it is defined
  const timestamp = request.timestamp;

  // `url` in IncomingMessage, `path` in ClientRequest
  const url = request.url || request.path;

  // `headers` in IncomingMessage, `_headers` in ClientRequest
  // eslint-disable-next-line no-underscore-dangle
  const headers = request.headers || request._headers || {};

  const socket = request.socket || {};
  const { remoteAddress, remotePort, localAddress, localPort } = socket;

  return {
    timestamp,
    httpVersion,
    method,
    url,
    headers,
    remoteAddress,
    remotePort,
    localAddress,
    localPort,
  };
}

export function formatResponse(response) {
  const statusCode = response.statusCode;

  // `headers` in IncomingMessage, parsed headers in ServerResponse
  const headers = response.headers || httpHeaders(response, true) || {};

  // `timestamp` and `responseTime` do not belong to the classes that the core Node.js http[s]
  // module returns, but we use them if they are defined
  const { timestamp, responseTime } = response;

  return {
    timestamp,
    statusCode,
    headers,
    responseTime,
  };
}
