import * as utils from './utils';

describe('Routing test', () => {

  it('should have / route for login and login with the username admin and the password password', async () => {
    await utils.login();
    await $('p[class*="Dashboard"]').waitForExist({ timeout: 4000 });
    await utils.logout();
  });

  it('should have open /api route', async () => {
    await browser.url(`http://localhost:3000/api`);
    await $('p[class*="Api_title"]').waitForExist({ timeout: 4000 });
    const el = await $('p[class*="Api_title"]');
    expect(await el.getText()).toBe('REST API Documentation');
  });

  it('should have open /help route', async () => {
    await browser.url(`http://localhost:3000/help`);
    await $('p[class*="Help_title"]').waitForExist({ timeout: 4000 });
    const el = await $('p[class*="Help_title"]');
    expect(await el.getText()).toBe('Help');
  });

  it('should redirect to /dashboard/analytics after login', async () => {
    await utils.login();
    await $('p[class*="Analytics"]').waitForExist({ timeout: 4000 });
    await utils.logout();
  });

  it('should have the route /dashboard/tasks', async () => {
    await utils.login();
    await $('p[class*="Analytics"]').waitForExist({ timeout: 4000 });
    await browser.url(`http://localhost:3000/dashboard/tasks`);
    await $('p[class*="Tasks"]').waitForExist({ timeout: 4000 });
    await utils.logout();
  });

  it('should have the route /dashboard/holons', async () => {
    await utils.login();
    await $('p[class*="Analytics"]').waitForExist({ timeout: 4000 });
    await browser.url(`http://localhost:3000/dashboard/holons`);
    await $('p[class*="Holons"]').waitForExist({ timeout: 4000 });
    await utils.logout();
  });

  it('should have the route /dashboard/allocations', async () => {
    await utils.login();
    await $('p[class*="Analytics"]').waitForExist({ timeout: 4000 });
    await browser.url(`http://localhost:3000/dashboard/allocations`);
    await $('p[class*="Allocations"]').waitForExist({ timeout: 4000 });
    await utils.logout();
  });

  it('should have the route /dashboard/algorithms', async () => {
    await utils.login();
    await $('p[class*="Analytics"]').waitForExist({ timeout: 4000 });
    await browser.url(`http://localhost:3000/dashboard/algorithms`);
    await $('p[class*="Algorithms"]').waitForExist({ timeout: 4000 });
    await utils.logout();
  });

  it('should have the route /account', async () => {
    await utils.login();
    await $('p[class*="Analytics"]').waitForExist({ timeout: 4000 });
    await browser.url(`http://localhost:3000/account`);
    await $('div[class*="header"]').waitForExist({ timeout: 4000 });
    await utils.logout();
  });
});
