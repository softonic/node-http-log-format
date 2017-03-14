import http from 'http';
import { formatRequest, formatResponse } from '../index';

function createMockSocket() {
  const localAddress = '127.0.0.1';
  const localPort = '12345';
  const remoteAddress = '123.123.123.123';
  const remotePort = '80';
  const socket = {
    localAddress,
    localPort,
    remoteAddress,
    remotePort,
  };
  return socket;
}

describe('http-log-format', () => {
  describe('formatRequest(request)', () => {
    it('should extract the fields from incoming requests', () => {
      const socket = createMockSocket();

      const request = new http.IncomingMessage(socket);
      Object.assign(request, {
        method: 'GET',
        url: '/home',
        httpVersion: '1.1',
        headers: {
          host: 'example.com:80',
          foo: 'bar',
        },
      });

      // Custom property that we use to track the response time
      const timestamp = '2017-01-01T00:00:00Z';
      request.timestamp = timestamp;

      const formattedRequest = formatRequest(request);

      expect(formattedRequest).toEqual({
        timestamp,
        method: 'GET',
        httpVersion: '1.1',
        url: '/home',
        headers: {
          host: 'example.com:80',
          foo: 'bar',
        },
        localAddress: socket.localAddress,
        localPort: socket.localPort,
        remoteAddress: socket.remoteAddress,
        remotePort: socket.remotePort,
      });
    });

    it('should extract the fields from outgoing requests', () => {
      const request = new http.ClientRequest({
        method: 'GET',
        protocol: 'http:',
        host: 'example.com',
        port: '80',
        path: '/home',
        headers: {
          foo: 'bar',
        },
        // Prevent a real request
        agent: null,
        createConnection: () => {},
      });

      // Custom property that we use to track the response time
      const timestamp = '2017-01-01T00:00:00Z';
      request.timestamp = timestamp;

      const socket = createMockSocket();
      request.socket = socket;

      const formattedRequest = formatRequest(request);

      expect(formattedRequest).toEqual({
        timestamp,
        method: 'GET',
        httpVersion: undefined, // no httpVersion in outgoing requests
        url: '/home',
        headers: {
          host: 'example.com:80',
          foo: 'bar',
        },
        localAddress: socket.localAddress,
        localPort: socket.localPort,
        remoteAddress: socket.remoteAddress,
        remotePort: socket.remotePort,
      });
    });
  });

  describe('formatResponse(response)', () => {
    it('should extract the fields from incoming responses', () => {
      const socket = createMockSocket();

      const response = new http.ServerResponse(socket);
      Object.assign(response, {
        method: 'GET',
        url: '/home',
        httpVersion: '1.1',
        headers: {
          foo: 'bar',
        },
        statusCode: 200,
      });

      // Custom properties that we use to track the response time
      const timestamp = '2017-01-01T00:00:00Z';
      const responseTime = 25;
      response.timestamp = timestamp;
      response.responseTime = responseTime;

      const formattedResponse = formatResponse(response);

      expect(formattedResponse).toEqual({
        timestamp,
        responseTime,
        headers: {
          foo: 'bar',
        },
        statusCode: 200,
      });
    });

    it('should extract the fields from outgoing responses', () => {
      const req = {};
      const response = new http.ServerResponse(req);
      response.statusCode = 404;
      response.setHeader('foo', 'bar');
      response.flushHeaders();

      // Custom properties that we use to track the response time
      const timestamp = '2017-01-01T00:00:00Z';
      const responseTime = 25;
      response.timestamp = timestamp;
      response.responseTime = responseTime;

      const formattedResponse = formatResponse(response);

      expect(formattedResponse).toEqual({
        timestamp,
        responseTime,
        headers: expect.objectContaining({
          foo: 'bar',
        }),
        statusCode: 404,
      });
    });
  });
});
