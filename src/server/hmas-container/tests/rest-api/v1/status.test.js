import * as app from '../../../app';
import * as testUtils from '../../utils/utils';
import * as Logger from '../../../logger/logger';

/**
 * BEFORE RUNNING THIS TEST MAKE SURE THE BACKEND IS UP AND RUNNING WITH THE DEVELOPMENT NODE_ENV VARIABLES
 *
 * This test assumes the backend API (REST API) is up and running with the test environment configuration
 *
 *
 *
 *
 */

// Configuring test environment
jest.useRealTimers();
jest.setTimeout(40000);

beforeAll(async () => {
  // Shut down printer
  Logger.stopPrinting();
});

afterAll(async () => {
  app.stopServer();
  testUtils.stop();
  await testUtils.wait(5);
});

describe('test /api/v1/status endpoint', () => {
  test('send a get request to /api/v1/status endpoint and receive correct response template', async () => {
    await testUtils.wait(5);
    let response = await testUtils.get('status', '', '');
    response = response.data || response.response.data;

    // Response has correct link
    expect(response).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/status') }),
      })
    );

    // Response has no errors
    expect(response.errors.length).toBe(0);

    expect(response.data[0].type).toBe('status');
    expect(Object.keys(response.data[0].attributes).includes('core')).toBe(true);
    expect(Object.keys(response.data[0].attributes).includes('restApi')).toBe(true);
    expect(Object.keys(response.data[0].attributes).includes('holonContainer')).toBe(true);
    expect(Object.keys(response.data[0].attributes).includes('latestUpdate')).toBe(true);
  });

  test('send a get request to /api/v1/status endpoint and receive correct response', async () => {
    await testUtils.wait(12);
    let response = await testUtils.get('status', '', '');
    response = response.data || response.response.data;

    // Response has correct link
    expect(response).toEqual(
      expect.objectContaining({
        links: expect.objectContaining({ self: expect.stringContaining('/api/v1/status') }),
      })
    );

    // Response has no errors
    expect(response.errors.length).toBe(0);

    expect(response.data[0].type).toBe('status');
    expect(response.data[0].attributes.core).toBe(true);
    expect(response.data[0].attributes.restApi).toBe(true);
    expect(response.data[0].attributes.holonContainer).toBe(true);
    expect(response.data[0].attributes.latestUpdate).not.toBe(null);
  });
});
