import * as core from '../core/core';
import { Holon } from '../generic/holon';

// PROPERTIES
export let isContainerActive = false;
export const holons = [];
export const perceptions = [];
export const superHolon = null;


initialize();


/**
 * FUNCTIONS
 * 
 */


/**
 * Function for initialization process
 * PHASE 1 - Create a super holon
 * PHASE 2 - Import and create all holons from database
 * PHASE 3 - Create holarchy
 */
function initialize() {
  // PHASE 1
  superHolon = new Holon({
    id: 0.666666,
    type: 'UTILITY',
    name: 'Super Holon',
    created_on: new Date(),
    updated_on: new Date(),
    created_by: 0.66666,
  });
  superHolon.latest_state.position = 'SUPER';
  superHolon.isArtificialHolon = true;

  // PHASE 2
  updateHolons();

  // PHASE 3
  superHolon.latest_state.childHolons = holons;

  // TODO

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
