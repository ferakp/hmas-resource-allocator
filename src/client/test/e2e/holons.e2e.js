import * as utils from './utils';

describe('Holon view test', () => {
  it('should delete all holons', async () => {
    await browser.setTimeout({ script: 100000 });
    await utils.login();
    await utils.deleteAllHolons();
    await utils.logout();
  });

  it('should create a new holon', async () => {
    await browser.setTimeout({ script: 100000 });
    await utils.login();
    await utils.deleteAllHolons();
    await utils.addHolon('Holon1', 'Custom', 'Man', '8', '29', '6', '0.2', '0.1', '0.2');
    await $('p*=Holon1').waitForExist({ timeout: 4000 });
    await utils.logout();
  });

  it('should edit the holon with given parameters ', async () => {
    await browser.setTimeout({ script: 100000 });
    await utils.login();
    await utils.deleteAllHolons();
    await utils.addHolon('Holon1', 'Custom', 'Man', '8', '29', '6', '0.2', '0.1', '0.2');
    await utils.editHolon('Holon2', 'Custom', 'Man', '8', '29', '6', '0.2', '0.1', '0.2');
    await $('p*=Holon2').waitForExist({ timeout: 4000 });
    await utils.logout();
  });

  it('should assure that all holon row elements exist', async () => {
    await browser.setTimeout({ script: 100000 });
    await utils.login();
    await utils.deleteAllHolons();
    await utils.addHolon('Holon1', 'Custom', 'Man', '8', '29', '6', '0.2', '0.1', '0.2');
    await $('p*=Holon1').waitForExist({ timeout: 4000 });
    await $('p*=29').waitForExist({ timeout: 4000 });
    await $('p*=6').waitForExist({ timeout: 4000 });
    await $('p*=8').waitForExist({ timeout: 4000 });
    await $('svg[class*="editIcon"]').waitForExist({ timeout: 4000 });
    await $('svg[class*="deleteIcon"]').waitForExist({ timeout: 4000 });
    await utils.logout();
  });
});
