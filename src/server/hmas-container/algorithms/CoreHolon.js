import * as utils from '../utils/utils';
import * as backendApi from '../api/backend-api';

export class CoreHolon {
  // This ID is reserved for core holon, do not change it!
  id = -33333;
  // Name
  name = 'CoreHolon';
  // Perception is an object with following properties: type, content
  perceptions = [];
  handledPerceptions = [];
  // Unread messages
  // Message is an object with following properties: sender, type, content, ontology, receiver and conversation ID
  messages = [];
  // Messages that have been read
  readMessages = [];
  // Data
  data = {};
  // Data updater intervals
  algorithmsUpdaterInterval = setInterval(() => {
    if (!Array.isArray(this.data.algorithms)) this.sendMessage({ sender: -5555, conversationId: utils.generateRandomNumber() }, 'dataRequest', 'algorithms', 'algorithms');
    else clearInterval(this.algorithmsUpdaterInterval);
  }, 5000);
  tasksUpdaterInterval = setInterval(() => {
    this.sendMessage({ sender: -4444, conversationId: utils.generateRandomNumber() }, 'dataRequest', 'tasks', 'tasks');
  }, 5000);

  latest_state = {
    representativeHolon: null,
    status: holonStatus.na,
    type: holonTypes.na,
    position: holonPositions.na,
    parentHolon: null,
    childHolons: [],
    layerHolons: [],
  };

  constructor() {
    utils.log('Status', 'Core holon - holon has been started');
  }

  receiveMessage(message) {
    this.messages.push(message);
    this.readMessage();
  }

  receivePerception(perception) {
    this.perceptions.push(perception);
    this.handlePerceptions();
  }

  handlePerceptions() {
    const perceptions = this.perceptions;
    this.perceptions = [];
    this.handledPerceptions = this.handledPerceptions.concat(perceptions);
  }

  readMessage() {
    const messages = this.messages;
    this.messages = [];
    messages.forEach((message) => {
      switch (message.type) {
        case 'allocationRequest':
          // message.content.allocationRequest has following properties: allocation
          if (message.ontology === 'allocations') {
            utils.log('Status', 'Core holon - received an allocation request for allocation ID ' + message.content.allocationRequest.allocation.id);
            const allocationRequest = message.content.allocationRequest;
            allocationRequest.allHolons = this.latest_state.layerHolons;
            allocationRequest.allTasks = this.data.tasks;
            const result = this.allocate(allocationRequest);
            utils.log('Status', 'Core holon - completed the allocation request ' + message.content.allocationRequest.allocation.id);
            this.sendMessage(message, 'allocationCompleted', { allocationId: Number(message.content.allocationRequest.allocation.id), result }, 'allocations');
          }
          break;
        case 'data':
          if (message.ontology === 'algorithms' && message.content.algorithms && Array.isArray(message.content.algorithms)) {
            this.data.algorithms = message.content.algorithms;
            utils.log(
              'Status',
              'Core holon - received ' + this.data.algorithms.length + ' algorithms with following names: ' + this.data.algorithms.map((alg) => alg.name).join(', ')
            );
          } else if (message.ontology === 'tasks' && message.content.tasks && Array.isArray(message.content.tasks)) {
            if (JSON.stringify(this.data.tasks) === JSON.stringify(message.content.tasks)) return;
            this.data.tasks = message.content.tasks;
            utils.log('Status', 'Core holon - received ' + this.data.tasks.length + ' tasks');
          }
          break;
      }
    });
    this.readMessages = this.readMessages.concat(messages);
  }

  /**
   * Prepare allocation for the algorithm's run function
   * Returns the result (json) with error message if allocation could not be sent to algorithm
   * @param {object} allocationRequest has properties allHolons, allTasks and allocation
   * @returns {string} result - has max one property: error or allocations
   */
  allocate(allocationRequest) {
    try {
      const allocation = allocationRequest.allocation;
      const allHolons = allocationRequest.allHolons;
      const allTasks = allocationRequest.allTasks;
      const algorithmName = allocation.request.algorithm;
      if (!algorithmName) return JSON.stringify({ error: 'HMAS Container received allocation with invalid algorithm name' });
      if (!allHolons || !Array.isArray(allHolons) || allHolons.length === 0) return JSON.stringify({ error: 'HMAS Container received allocation but HMAS has no colons' });
      if (!allTasks || !Array.isArray(allTasks) || allTasks.length === 0) return JSON.stringify({ error: 'HMAS Container received allocation but HMAS has no tasks' });

      const selectedHolons = [];
      const selectedTasks = [];
      let algorithm = null;

      allHolons.forEach((holon) => {
        if (allocation.request.holonIds.includes(holon.id)) {
          selectedHolons.push(holon);
        }
      });

      allTasks.forEach((task) => {
        if (allocation.request.taskIds.includes(task.id)) {
          selectedTasks.push(task);
        }
      });

      this.data.algorithms.forEach((alg) => {
        if (alg.name === algorithmName) {
          algorithm = alg;
        }
      });

      if (algorithm && algorithm.run)
        return algorithm.run(selectedTasks, selectedHolons);
      else {
        return JSON.stringify({ error: "HMAS Container received correct allocation but it couldn't find its algorithm. Please delete the allocation request." });
      }
    } catch (err) {
      utils.log('Error', 'Core holon - unable to execute allocation due to unexpected error');
      return JSON.stringify({ error: 'HMAS Container was unable to handle this allocation request due to unexpected error' });
    }
  }

  sendMessage(receivedMessage, type, content, ontology) {
    const message = {};
    message.sender = this.id;
    message.type = type;
    message.content = content;
    message.ontology = ontology;
    message.receiver = receivedMessage.sender;
    message.conversationId = receivedMessage.conversationId;

    this.latest_state.layerHolons.forEach((holon) => {
      if (holon.id === message.receiver) holon.receiveMessage(message);
    });
  }

  stop() {
    clearInterval(this.algorithmsUpdaterInterval);
    clearInterval(this.tasksUpdaterInterval);
    this.data = {};
    utils.log('Status', 'Core holon - stopped');
  }
}

// CONSTANTS
const holonStatus = {
  na: 'N/A',
  idle: 'IDLE',
  running: 'RUNNING',
  stopped: 'STOPPED',
  finished: 'FINISHED',
};

const holonTypes = {
  na: 'N/A',
  reflex: 'REFLEX',
  model: 'MODEL',
  goal: 'GOAL',
  utility: 'UTILITY',
};

const holonPositions = {
  na: 'N/A',
  super: 'SUPER',
  representative: 'REPRESENTATIVE',
  multipart: 'MULTIPART',
  singlepart: 'SINGLEPART',
  atomic: 'ATOMIC',
};
