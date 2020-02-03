import {
  formatRequest,
  stringifyRequest,
  formatResponse,
  stringifyResponse,
} from '../index';
import {
  buildIncomingRequest,
  buildOutgoingRequest,
  buildIncomingResponse,
  buildOutgoingResponse,
} from './HttpBuilders';

describe('http-log-format', () => {
  describe('formatRequest(request, { whitelistHeaders, blacklistHeaders })', () => {
    it('should extract the fields from incoming requests', () => {
      const request = buildIncomingRequest({
        httpVersion: '1.1',
        method: 'GET',
        protocol: 'http:',
        host: 'example.com',
        port: '80',
        path: '/home',
        headers: {
          foo: 'bar',
        },
        localAddress: '127.0.0.1',
        localPort: 80,
        remoteAddress: '8.8.8.8',
        remotePort: 12345,
        timestamp: '2017-04-01T23:01:52Z',
      });

      const formattedRequest = formatRequest(request);

      expect(formattedRequest).toEqual({
        method: 'GET',
        httpVersion: '1.1',
        url: '/home',
        headers: expect.objectContaining({
          host: 'example.com:80',
          foo: 'bar',
        }),
        localAddress: '127.0.0.1',
        localPort: 80,
        remoteAddress: '8.8.8.8',
        remotePort: 12345,
        timestamp: '2017-04-01T23:01:52Z',
      });
    });

    it('should extract the fields from outgoing requests', () => {
      const request = buildOutgoingRequest({
        method: 'GET',
        protocol: 'http:',
        host: 'example.com',
        port: '80',
        path: '/home',
        headers: {
          foo: 'bar',
        },
        localAddress: '127.0.0.1',
        localPort: 12345,
        remoteAddress: '8.8.8.8',
        remotePort: 80,
        timestamp: '2017-04-01T23:01:52Z',
      });

      const formattedRequest = formatRequest(request);

      expect(formattedRequest).toEqual({
        timestamp: '2017-04-01T23:01:52Z',
        method: 'GET',
        httpVersion: undefined, // no httpVersion in outgoing requests
        url: '/home',
        headers: expect.objectContaining({
          host: 'example.com:80',
          foo: 'bar',
        }),
        localAddress: '127.0.0.1',
        localPort: 12345,
        remoteAddress: '8.8.8.8',
        remotePort: 80,
      });
    });

    it('should whitelist headers from the request', () => {
      const request = buildIncomingRequest({
        headers: {
          foo: 'bar',
          bar: 'baz',
        },
      });

      const formattedRequest = formatRequest(request, {
        whitelistHeaders: ['foo'],
      });

      expect(formattedRequest.headers.foo).toBe('bar');
      expect(formattedRequest.headers.bar).toBeUndefined();
    });

    it('should blacklist headers from the request', () => {
      const request = buildIncomingRequest({
        headers: {
          foo: 'bar',
          bar: 'baz',
        },
      });

      const formattedRequest = formatRequest(request, {
        blacklistHeaders: ['foo'],
      });

      expect(formattedRequest.headers.foo).toBeUndefined();
      expect(formattedRequest.headers.bar).toBe('baz');
    });
  });

  describe('stringifyRequest(request)', () => {
    it('should convert a request object to its string version', () => {
      const request = buildIncomingRequest({
        method: 'POST',
        protocol: 'http:',
        host: 'example.com',
        port: '80',
        path: '/home',
      });

      const stringified = stringifyRequest(request);

      expect(stringified).toBe('POST example.com:80/home');
    });
  });

  describe('formatResponse(response, { whitelistHeaders, blacklistHeaders })', () => {
    it('should extract the fields from incoming responses', () => {
      const response = buildIncomingResponse({
        timestamp: '2017-04-01T23:01:52Z',
        responseTime: 25,
        headers: {
          foo: 'bar',
        },
        statusCode: 200,
      });

      const formattedResponse = formatResponse(response);

      expect(formattedResponse).toEqual({
        timestamp: '2017-04-01T23:01:52Z',
        responseTime: 25,
        headers: expect.objectContaining({
          foo: 'bar',
        }),
        statusCode: 200,
      });
    });

    it('should extract the fields from outgoing responses', () => {
      const response = buildOutgoingResponse({
        timestamp: '2017-04-01T23:01:52Z',
        responseTime: 25,
        headers: {
          foo: 'bar',
        },
        statusCode: 200,
      });

      const formattedResponse = formatResponse(response);

      expect(formattedResponse).toEqual({
        timestamp: '2017-04-01T23:01:52Z',
        responseTime: 25,
        headers: expect.objectContaining({
          foo: 'bar',
        }),
        statusCode: 200,
      });
    });

    it('should whitelist headers from the response', () => {
      const response = buildOutgoingResponse({
        headers: {
          foo: 'bar',
          bar: 'baz',
        },
      });

      const formattedResponse = formatResponse(response, {
        whitelistHeaders: ['foo'],
      });

      expect(formattedResponse.headers.foo).toBe('bar');
      expect(formattedResponse.headers.bar).toBeUndefined();
    });

    it('should blacklist headers from the response', () => {
      const response = buildOutgoingResponse({
        headers: {
          foo: 'bar',
          bar: 'baz',
        },
      });

      const formattedResponse = formatResponse(response, {
        blacklistHeaders: ['foo'],
      });

      expect(formattedResponse.headers.foo).toBeUndefined();
      expect(formattedResponse.headers.bar).toBe('baz');
    });
  });

  describe('stringifyResponse(response)', () => {
    it('should convert a response object to its string version', () => {
      const response = buildIncomingResponse({
        statusCode: 503,
      });

      const stringified = stringifyResponse(response);

      expect(stringified).toBe('503 (Service Unavailable)');
    });
  });
});
