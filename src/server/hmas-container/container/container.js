import * as core from '../core/core';
import * as logger from '../logger/logger';
import * as utils from '../utils/utils';
import { Holon } from '../generic/holon';
import { PipeHolon } from '../algorithms/PipeHolon';
import { CoreHolon } from '../algorithms/CoreHolon';
import { AllocationHolon } from '../algorithms/AllocationHolon';
import { InterfaceHolon } from '../algorithms/InterfaceHolon';

// PROPERTIES
export let isInitialized = false;
export let isContainerActive = false;
export let isCoreActive = false;

export let superHolon = null;
export let holons = [];

let previousAllocations = null;
let previousTasks = null;

/**
 * PERCEPTION
 * Each perception is an object with following properties: name, content
 */
export let perceptions = [];

/**
 * FUNCTIONS
 *
 */

/**
 * Initialize container 
 * - Creates a super holon
 * - Creates holons
 * - Configure all holons
 */
function initialize() {
  try {
    if (!isCoreActive) {
      isInitialized = false;
      isContainerActive = false;
      return;
    }
    // Create a super holon
    superHolon = new Holon({
      id: -1000000,
      type: 'UTILITY',
      name: 'SuperHolon',
      created_on: new Date(),
      updated_on: new Date(),
      created_by: 0.666662111,
    });
    superHolon.latest_state.position = 'SUPER';
    superHolon.latest_state.status = 'RUNNING';
    superHolon.isArtificialHolon = true;

    // Import holons from database
    updateHolons();

    // Update the latest_state of imported holons
    holons.forEach((holon) => {
      holon.latest_state.status = 'RUNNING';
      holon.latest_state.type = 'UTILITY';
      holon.latest_state.position = 'SINGLEPART';
    });

    // Create an allocation holon
    const allocationHolon = new AllocationHolon();
    allocationHolon.latest_state.status = 'RUNNING';
    allocationHolon.latest_state.type = 'UTILITY';
    allocationHolon.latest_state.position = 'SINGLEPART';
    holons.push(allocationHolon);

    // Create a pipe holon
    const pipeHolon = new PipeHolon();
    pipeHolon.latest_state.status = 'RUNNING';
    pipeHolon.latest_state.type = 'UTILITY';
    pipeHolon.latest_state.position = 'SINGLEPART';
    holons.push(pipeHolon);

    // Create a core holon
    const coreHolon = new CoreHolon();
    coreHolon.latest_state.status = 'RUNNING';
    coreHolon.latest_state.type = 'UTILITY';
    coreHolon.latest_state.position = 'SINGLEPART';
    holons.push(coreHolon);

    // Create an interface holon
    const interfaceHolon = new InterfaceHolon();
    interfaceHolon.latest_state.status = 'RUNNING';
    interfaceHolon.latest_state.type = 'UTILITY';
    interfaceHolon.latest_state.position = 'REPRESENTATIVE';
    holons.push(interfaceHolon);

    // Create a super holon
    superHolon.latest_state.childHolons = holons;
    superHolon.latest_state.childHolons.forEach((holon) => {
      holon.latest_state.parentHolon = superHolon;
      holon.latest_state.layerHolons = holons;
      holon.latest_state.representativeHolon = interfaceHolon;
    });

    isContainerActive = true;
    isInitialized = true;
    logger.createLog('Status', 'Container - container has been initialized');
  } catch (err) {
    console.log(err);
    logger.createLog('Error', 'Container - unable to initialize container');
    isInitialized = false;
    isContainerActive = false;
  }
}

// FUNCTIONS

/**
 * UPDATERS
 *
 *
 */

const updateHolons = () => {
  const allHolons = core.holons;
  try {
    allHolons.forEach((holon) => {
      let index = -1;
      for (let i = 0; i < holons.length; i++) {
        if (holons[i].id === Number(holon.id)) {
          index = i;
          break;
        }
      }
      if (index !== -1) {
        holons[index].update(holon);
      } else {
        try {
          holons.push(new Holon(holon));
        } catch (err) {
          utils.log('Error', 'Container - Invalid holon has been received');
        }
      }
    });
  } catch (err) {
    utils.log('Error', 'Error occured during initialization - importing holons failed');
    throw new Error();
  }
};

const updateTasks = () => {
  if (JSON.stringify(previousTasks) !== JSON.stringify(core.tasks)) {
    const tasks = core.tasks;
    previousTasks = tasks;
    perceptions.push({ type: 'tasksUpdate', content: { tasks } });
  }
};

const updateAllocations = () => {
  if (JSON.stringify(previousAllocations) !== JSON.stringify(core.allocations)) {
    const allocations = core.allocations;
    previousAllocations = allocations;
    perceptions.push({ type: 'allocationsUpdate', content: { allocations } });
  }
};

const deliverPerceptions = () => {
  const perceptionsTemp = perceptions;
  perceptions = [];

  perceptionsTemp.forEach((perception) => {
    holons.forEach((holon) => {
      holon.receivePerception(perception);
    });
  });
};

/**
 * INTERVALS
 *
 *
 */
let dataUpdaterInterval = setInterval(() => {
  updateHolons();
  updateTasks();
  updateAllocations();
  deliverPerceptions();
}, 7000);
let initializerInterval = setInterval(() => {
  if (isInitialized) clearInterval(initializerInterval);
  else {
    initialize();
  }
}, 1000);
let coreActivityMonitorInterval = setInterval(() => {
  isCoreActive = core.serverStatus.core;
  if (!isCoreActive) {
    isContainerActive = false;
    utils.log('Status', 'Container - core is inactive, deactivating container');
  }
  if (isCoreActive && !isContainerActive) {
    isContainerActive = true;
    utils.log('Status', 'Container - core is active, activating container');
  }
}, 1000);
let perceptionDelivererInterval = setInterval(() => {
  deliverPerceptions();
}, 2000);

export const stop = () => {
  clearInterval(dataUpdaterInterval);
  clearInterval(initializerInterval);
  clearInterval(coreActivityMonitorInterval);
  clearInterval(perceptionDelivererInterval);
  holons.forEach((holon) => {
    if (['AllocationHolon', 'CoreHolon', 'InterfaceHolon'].includes(holon.name)) {
      holon.stop();
    }
  });
  superHolon = null;
  holons = [];
  previousAllocations = [];
  previousTasks = [];
  perceptions = [];
  utils.log('Status', 'Container - stopped');
};
