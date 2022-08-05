import * as backendApi from '../api/backend-api';
import * as container from '../container/container';
import * as utils from '../utils/utils';

// STATUS
export const serverStatus = {
  core: false,
  restApi: false,
  holonContainer: false,
  startTime: new Date(),
  latestUpdate: new Date(),
};

// DATA
export let holons = [];
export let tasks = [];
export let allocations = [];
export let latestDataUpdateTime = new Date();

/**
 * INTERVALS
 */

// Update data storage
const updaterInterval = setInterval(async () => {
  try {
    if(!serverStatus.restApi) {
      utils.log("Status", "Core - unable to update data due to inactive REST API");
      return;
    }
    const prevDataUpdateTime = latestDataUpdateTime;
    const holonsResponse = await backendApi.getAllHolons();
    const tasksResponse = await backendApi.getAllTasks();
    const allocationsResponse = await backendApi.getAllAllocations();

    const errors = holonsResponse.errors.concat(tasksResponse.errors).concat(allocationsResponse.errors);
    if (errors.length > 0) throw new Error();
    
    const newHolons = holonsResponse.data.map(holon => holon.attributes);
    const newTasks = tasksResponse.data.map(task => task.attributes);
    const newAllocations = allocationsResponse.data.map(allocation => allocation.attributes);

    // Update only if retrieved data is different from current data
    if(JSON.stringify(newHolons) !== JSON.stringify(holons)) {
      holons = newHolons;
      latestDataUpdateTime = new Date();
    }

    if(JSON.stringify(newTasks) !== JSON.stringify(tasks)) {
      tasks = newTasks;
      latestDataUpdateTime = new Date();
    }

    if(JSON.stringify(newAllocations) !== JSON.stringify(allocations)) {
      allocations = newAllocations;
      latestDataUpdateTime = new Date();
    }

    if(prevDataUpdateTime < latestDataUpdateTime){
      utils.log("Status", 'Core - data have been updated');
    }
    serverStatus.core = true;
  } catch (err) {
    serverStatus.core = false;
    utils.log("Error", "Core - retrieving data from REST API has failed.");
  }
}, 5000);

// Update status object
const statusUpdaterInterval = setInterval(() => {
  serverStatus.latestUpdate = new Date();
  serverStatus.restApi = backendApi.isRestApiActive;
  serverStatus.holonContainer = container.isContainerActive;
}, 1000);


export const stop = () => {
  clearInterval(statusUpdaterInterval);
  clearInterval(updaterInterval);
  holons = [];
  tasks = [];
  allocations = [];
  utils.log("Status", "Core holon - stopped");
}