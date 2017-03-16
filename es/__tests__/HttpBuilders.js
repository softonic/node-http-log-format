import http from 'http';

export function buildOutgoingRequest({
  method,
  host,
  port,
  path,
  headers = {},
  timestamp,
  localAddress,
  localPort,
  remoteAddress,
  remotePort,
}) {
  const request = new http.ClientRequest({
    method,
    protocol: 'http:',
    host,
    port,
    path,
    headers,
    // Prevent a real request
    agent: null,
    createConnection: () => {},
  });

  // Custom property that we use to track the response time
  request.timestamp = timestamp;

  request.socket = {
    localAddress,
    localPort,
    remoteAddress,
    remotePort,
  };

  return request;
}

export function buildIncomingRequest({
  httpVersion,
  method,
  host,
  port,
  path,
  headers = {},
  timestamp,
  localAddress,
  localPort,
  remoteAddress,
  remotePort,
}) {
  const socket = {
    localAddress,
    localPort,
    remoteAddress,
    remotePort,
  };

  const realHeaders = Object.assign({}, headers, { host: `${host}:${port}` });

  const request = new http.IncomingMessage(socket);
  Object.assign(request, {
    method,
    url: path,
    httpVersion,
    headers: realHeaders,
  });

  // Custom property that we use to track the response time
  request.timestamp = timestamp;

  return request;
}

export function buildIncomingResponse({
  statusCode,
  headers,
  responseTime,
  timestamp,
}) {
  const socket = {};

  const response = new http.IncomingMessage(socket);
  Object.assign(response, {
    headers,
    statusCode,
    timestamp,
    responseTime,
  });
  response.statusCode = statusCode;

  return response;
}

export function buildOutgoingResponse({
  statusCode,
  headers,
  responseTime,
  timestamp,
}) {
  const req = {};
  const response = new http.ServerResponse(req);

  Object.keys(headers).forEach(headerName => response.setHeader(headerName, headers[headerName]));
  response.flushHeaders();

  Object.assign(response, {
    statusCode,
    // Custom properties that we use to track the response time
    timestamp,
    responseTime,
  });

  return response;
}
