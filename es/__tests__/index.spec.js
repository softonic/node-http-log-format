import { formatRequest, stringifyRequest, formatResponse, stringifyResponse } from '../index';
import {
  buildIncomingRequest,
  buildOutgoingRequest,
  buildIncomingResponse,
  buildOutgoingResponse,
} from './HttpBuilders';

describe('http-log-format', () => {
  describe('formatRequest(request)', () => {
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

  describe('formatResponse(response)', () => {
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
