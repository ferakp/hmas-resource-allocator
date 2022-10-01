export const wait = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const login = async () => {
  await browser.url(`http://localhost:3000/`);
  await $('#usernameInput').setValue('admin');
  await $('#passwordInput').setValue('password');
  await $('button[type="button"]').click();
  await wait(500);
};

export const logout = async () => {
  const childLogout = await $('p*=Logout');
  const parentLogout = childLogout.parentElement();
  await parentLogout.click();
};

export const deleteAllHolons = async () => {
  await browser.url(`http://localhost:3000/dashboard/holons`);
  await $('p[class*="Dashboard"]').waitForExist({ timeout: 4000 });
  await wait(3000);
  let deleteButtons = await $$('svg[class*="deleteIcon"');
  for (let i = 0; i < deleteButtons.length; i++) {
    await deleteButtons[i].click();
    await wait(2000);
  }
  deleteButtons = await $$('svg[class*="deleteIcon"');
  expect(deleteButtons.length).toBe(0);
};

export const addHolon = async (name, type, gender, dailyWorkHours, age, experienceYears, availabilityData, loadData, stressData) => {
  await browser.url(`http://localhost:3000/dashboard/holons`);
  await $('p[class*="Dashboard"]').waitForExist({ timeout: 4000 });
  let addButton = await $('button[class*="addHolonButton"');
  addButton.click();
  await wait(250);

  // Details tab
  let nameField = await $('#holonNameField');
  let typeField = await $('#typeField');
  let genderField = await $('#genderField');
  let dailyWorkHoursField = await $('#dailyWorkHoursField');
  let ageField = await $('#ageField');
  let experienceYearsField = await $('#experienceYearsField');
  await setValue(nameField, name);
  await setValue(typeField, type);
  await setValue(genderField, gender);
  await setValue(dailyWorkHoursField, gender);
  await setValue(dailyWorkHoursField, dailyWorkHours);
  await setValue(ageField, age);
  await setValue(experienceYearsField, experienceYears);

  // Availability data tab
  (await $('p*=Availability data')).parentElement().click();
  await wait(250);
  let remoteAddressField = await $('#remoteAddressField1');
  let apiTokenField = await $('#apiTokenField1');
  let availabilityDataField = await $('#availabilityDataField');
  await setValue(availabilityDataField, availabilityData);
  await wait(250);

  // Load data tab
  (await $('p*=Load data')).parentElement().click();
  await wait(250);
  let loadDataField = await $('#loadDataField');
  await setValue(loadDataField, loadData);

  // Stress data field
  (await $('p*=Stress data')).parentElement().click();
  await wait(250);
  let stressDataField = await $('#stressDataField');
  await setValue(stressDataField, stressData);

  // Save button
  let saveButton = await $('div[class*="editorButtonsSection"] button');
  saveButton.click();
  await wait(1000);
};

export const editHolon = async (name, type, gender, dailyWorkHours, age, experienceYears, availabilityData, loadData, stressData) => {
  await browser.url(`http://localhost:3000/dashboard/holons`);
  await $('p[class*="Dashboard"]').waitForExist({ timeout: 4000 });
  let button = await $('p[class*="rowName"');
  await button.click();
  await wait(500);

  // Details tab
  let nameField = await $('#holonNameField');
  let typeField = await $('#typeField');
  let genderField = await $('#genderField');
  let dailyWorkHoursField = await $('#dailyWorkHoursField');
  let ageField = await $('#ageField');
  let experienceYearsField = await $('#experienceYearsField');
  await setValue(nameField, name);
  await setValue(typeField, type);
  await setValue(genderField, gender);
  await setValue(dailyWorkHoursField, gender);
  await setValue(dailyWorkHoursField, dailyWorkHours);
  await setValue(ageField, age);
  await setValue(experienceYearsField, experienceYears);

  // Availability data tab
  (await $('p*=Availability data')).parentElement().click();
  await wait(250);
  let remoteAddressField = await $('#remoteAddressField1');
  let apiTokenField = await $('#apiTokenField1');
  let availabilityDataField = await $('#availabilityDataField');
  await setValue(availabilityDataField, availabilityData);
  await wait(250);

  // Load data tab
  (await $('p*=Load data')).parentElement().click();
  await wait(250);
  let loadDataField = await $('#loadDataField');
  await setValue(loadDataField, loadData);

  // Stress data field
  (await $('p*=Stress data')).parentElement().click();
  await wait(250);
  let stressDataField = await $('#stressDataField');
  await setValue(stressDataField, stressData);

  // Save button
  let saveButton = await $('div[class*="editorButtonsSection"] button');
  saveButton.click();
  await wait(1000);
};

export const deleteAllTasks = async () => {
  await browser.url(`http://localhost:3000/dashboard/tasks`);
  await $('p[class*="Dashboard"]').waitForExist({ timeout: 4000 });
  await wait(3000);
  let deleteButtons = await $$('svg[class*="deleteTaskIcon"');
  for (let i = 0; i < deleteButtons.length; i++) {
    await deleteButtons[i].click();
    await wait(2000);
  }
  deleteButtons = await $$('svg[class*="deleteTaskIcon"');
  expect(deleteButtons.length).toBe(0);
};

export const addTask = async (name, type, description, priority, estimatedTime, knowledgeTag) => {
  await browser.url(`http://localhost:3000/dashboard/tasks`);
  await $('p[class*="Dashboard"]').waitForExist({ timeout: 4000 });
  let addButton = await $('button*=Add a new task');
  addButton.click();
  await wait(250);

  // Details tab
  let nameField = await $('#taskNameField');
  let typeField = await $('#taskTypeField');
  let descriptionField = await $('#taskDescriptionField');
  await setValue(nameField, name);
  await setValue(typeField, type);
  await setValue(descriptionField, description);

  // Priority tab
  (await $('p*=Priority')).parentElement().click();
  await wait(250);
  let priorities = await $$('label');
  if (priority > 0 && priority < 6) await priorities[priority - 1].click();
  await wait(250);

  // Estimated time tab
  (await $('p*=Estimated time')).parentElement().click();
  await wait(250);
  let estimatedTimeField = await $('#estimatedTimeField');
  await setValue(estimatedTimeField, estimatedTime);

  // Knowledge tags tab
  (await $('p*=Knowledge tags')).parentElement().click();
  await wait(250);
  let kgField = await $('#kgField');
  await setValue(kgField, knowledgeTag);
  await (await $('button*=Add')).click();
  await wait(250);

  // Save button
  let saveButton = await $('div[class*="editorButtonsSection"] button');
  saveButton.click();
  await wait(1000);
};

export const editTask = async (name, type, description, priority, estimatedTime, knowledgeTag) => {
  await browser.url(`http://localhost:3000/dashboard/tasks`);
  await $('p[class*="Dashboard"]').waitForExist({ timeout: 4000 });
  await (await $('p[class*="rowName"')).click();
  await wait(500);

  // Details tab
  let nameField = await $('#taskNameField');
  let typeField = await $('#taskTypeField');
  let descriptionField = await $('#taskDescriptionField');
  await setValue(nameField, name);
  await setValue(typeField, type);
  await setValue(descriptionField, description);

  // Priority tab
  (await $('p*=Priority')).parentElement().click();
  await wait(250);
  let priorities = await $$('label');
  if (priority > 0 && priority < 6) await priorities[priority - 1].click();
  else await priorities[0].click();
  await wait(500);

  // Estimated time tab
  (await $('p*=Estimated time')).parentElement().click();
  await wait(250);
  let estimatedTimeField = await $('#estimatedTimeField');
  await setValue(estimatedTimeField, estimatedTime);

  // Knowledge tags tab
  (await $('p*=Knowledge tags')).parentElement().click();
  await wait(250);
  let kgField = await $('#kgField');
  await setValue(kgField, knowledgeTag);
  await (await $('button[class*="addKnowledgeTagButton"]')).click();
  await wait(500);

  // Save button
  let saveButton = await $('div[class*="editorButtonsSection"] button');
  saveButton.click();
  await wait(1000);
};

export const deleteAllAllocations = async () => {
  await browser.url(`http://localhost:3000/dashboard/allocations`);
  await $('p[class*="Dashboard"]').waitForExist({ timeout: 4000 });
  let deleteButtons = await $$('svg[class*="deleteIcon"');
  deleteButtons.forEach((button) => {
    button.click();
  });
  await wait(1000);
  deleteButtons = await $$('svg[class*="deleteIcon"');
  expect(deleteButtons.length).toBe(0);
};

export const addAllocation = async (algorithm, holonIds, taskIds) => {};

export const addUser = async (role, username, firstname, lastname, email, password) => {};

export const setValue = async (field, value) => {
  await field.click();
  for (let i = 0; i < 15; i++) {
    if (i === 14) await browser.keys('\uE003');
    else browser.keys('\uE003');
  }
  await field.setValue(value);
};
