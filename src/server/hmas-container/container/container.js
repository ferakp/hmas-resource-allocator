import * as core from '../core/core';
import { Holon } from '../generic/holon';
import * as logger from '../logger/logger';

// PROPERTIES
export let isContainerActive = false;
export const superHolon = null;
export const holons = [];


/**
 * PERCEPTION 
 * Each perception is an object with following properties: name, content
 */
export const perceptions = [];


try {
  initialize();
  isContainerActive = true;
  logger.createLog('Success', 'Initialization process was successfull');
} catch (err) {
  logger.createLog('Error', 'Unable to initialize container');
  isContainerActive = false;
}

/**
 * FUNCTIONS
 *
 */

/**
 * Function for initialization process
 * PHASE 1 - Create a super holon
 * PHASE 2 - Import and create all holons from database
 * PHASE 3 - Create holarchy
 * Set parent holon
 * Add layer holons
 * PHASE 4 - Update status, type and position of holons
 * PHASE 5 - Create algorithm holon
 */
function initialize() {
  // PHASE 1
  superHolon = new Holon({
    id: 0.666666,
    type: 'UTILITY',
    name: 'Super Holon',
    created_on: new Date(),
    updated_on: new Date(),
    created_by: 0.666662111,
  });
  superHolon.latest_state.position = 'SUPER';
  superHolon.latest_state.status = 'RUNNING';
  superHolon.isArtificialHolon = true;

  // PHASE 2
  updateHolons();

  // PHASE 3
  superHolon.latest_state.childHolons = holons;
  superHolon.latest_state.childHolons.forEach((holon) => {
    holon.latest_state.parentHolon = superHolon;
  });
  superHolon.latest_state.childHolons.forEach((holon) => {
    holon.latest_state.layerHolons = holons;
  });

  // PHASE 4
  superHolon.latest_state.childHolons.forEach((holon) => {
    holon.latest_state.status = 'RUNNING';
    holon.latest_state.type = 'UTILITY';
    holon.latest_state.position = 'SINGLEPART';
  });

  // PHASE 5
  const algorithmHolon = new Holon({
    id: 0.66666611,
    type: 'UTILITY',
    name: 'Algorithm Holon',
    created_on: new Date(),
    updated_on: new Date(),
    created_by: 0.66666221,
  });


}

// FUNCTIONS

/**
 *
 * @param {object} message holon-to-holon message with following properties:
 * {object} sender - author of message
 * {string} type - message type
 * {string} content - message content
 * {string} ontology - message ontology
 * {array} receivers - receivers
 * {number} conversation ID - unique conversation ID
 */
export function deliverMessage(message) {
  if (!Array.isArray(message.receivers) && message.receivers.length === 0) return;

  message.receivers.forEach((receiverId) => {
    for (let i = 0; i < holons.length; i++) {
      // todo
    }
  });
}

// INTERVALS
const holonsUpdaterInterval = setInterval(updateHolons, 30000);
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
        holons[i].update(holon);
      } else {
        try {
          holons.push(new Holon(holon));
        } catch (err) {}
      }
      isContainerActive = true;
    });
  } catch (err) {
    isContainerActive = false;
  }
};
