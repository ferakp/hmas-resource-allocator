import * as utils from './utils';

describe('Tasks view test', () => {
  it('should delete all tasks', async () => {
    await browser.setTimeout({ script: 100000 });
    await utils.login();
    await utils.deleteAllTasks();
    await utils.logout();
  });

  it('should create a new task', async () => {
    await browser.setTimeout({ script: 100000 });
    await utils.login();
    await utils.deleteAllTasks();
    await utils.addTask('Task1', 'Custom', 'Typical task', 2, 22, 'sql');
    await $('p*=Task1').waitForExist({ timeout: 4000 });
    await utils.logout();
  });

  it('should edit the task with given parameters ', async () => {
    await browser.setTimeout({ script: 100000 });
    await utils.login();
    await utils.deleteAllTasks();
    await utils.addTask('Task1', 'Custom', 'Typical task', 2, 22, 'sql');
    await utils.editTask('Task2', 'Custom', 'Typical task', 2, 22, 'sql');
    await $('p*=Task2').waitForExist({ timeout: 4000 });
    await utils.logout();
  });

  it('should check all task row elements exist', async () => {
    await browser.setTimeout({ script: 100000 });
    await utils.login();
    await utils.deleteAllTasks();
    await utils.addTask('Task1', 'Custom', 'Typical task', 2, 22, 'sql');
    await $('p*=Task1').waitForExist({ timeout: 4000 });
    await utils.logout();
  });
});
