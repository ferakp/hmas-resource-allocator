import * as backendApi from '../api/backend-api';
import * as superHolon from '../container/container';
import * as utils from '../utils/utils';

// STATUS
export const serverStatus = {
  restApi: false,
  holonContainer: false,
  latestUpdate: new Date(),
};

// DATA
export let holons = [];
export let tasks = [];
export let allocations = [];
export let allocationInProgress = [];
export let completedAllocations = [];



/**
 * INTERVALS 
 */

// Update data storage
const holonsUpdaterInterval = setInterval(async () => {
  holons = await backendApi.getAllHolons();
}, 30000);
const tasksUpdaterInterval = setInterval(async () => {
  tasks = await backendApi.getAllTasks();
}, 30000);
const allocationsUpdaterInterval = setInterval(async () => {
  allocations = await backendApi.getAllAllocations();
}, 30000);

// Update status object
const statusUpdaterInterval = setInterval(() => {
    serverStatus.latestUpdate = new Date();
    serverStatus.restApi = backendApi.isRestApiActive;
    serverStatus.holonContainer = superHolon.isContainerActive;
  }, 10000);