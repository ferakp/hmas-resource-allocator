import * as utils from '../utils/utils';
import * as log from '../logger/logger';
import * as algorithms from '../algorithms/Algorithms';
import * as backendApi from '../api/backend-api';

export class AlgorithmHolon {
  // ID
  id = 0.1;
  // Name
  name = 'AlgorithmHolon';
  // Perception is an object with following properties: type, content
  perceptions = [];
  // Unread messages
  // Message is an object with following properties: sender, type, content, ontology, receiver and conversation ID
  messages = [];
  // Messages that have been read
  readMessages = [];

  status = holonStatus.na;
  type = holonTypes.na;
  position = holonPosition.na;
  parentHolon = null;
  childHolons = [];
  layerHolons = [];
  numberOfReadMessages = 0;
  numberOfPerceptions = 0;

  constructor() {
    this.initialize();
  }

  initialize() {
    this.status = holonStatus.running;
    this.type = holonTypes.reflex;
    this.position = holonPosition.super;

    // Create interface holon
    const interfaceHolon = new InterfaceHolon();
    interfaceHolon.status = holonStatus.running;
    interfaceHolon.type = holonTypes.reflex;
    interfaceHolon.position = holonPosition.representative;
    interfaceHolon.parentHolon = this;
    this.childHolons.push(interfaceHolon);

    // Create switch holon
    const switchHolon = new SwitchHolon();
    switchHolon.status = holonStatus.running;
    switchHolon.type = holonTypes.model;
    switchHolon.position = holonPosition.singlepart;
    switchHolon.parentHolon = this;
    this.childHolons.push(switchHolon);

    // Create core holon
    const coreHolon = new CoreHolon();
    coreHolon.status = holonStatus.running;
    coreHolon.type = holonTypes.model;
    coreHolon.position = holonPosition.singlepart;
    coreHolon.parentHolon = this;
    this.childHolons.push(coreHolon);

    // Create allocation holon
    const allocationHolon = new AllocationHolon();
    allocationHolon.status = holonStatus.running;
    allocationHolon.type = holonTypes.utility;
    allocationHolon.position = holonPosition.singlepart;
    allocationHolon.parentHolon = this;
    this.childHolons.push(allocationHolon);

    // Create pipe holon
    const pipeHolon = new PipeHolon();
    pipeHolon.status = holonStatus.running;
    pipeHolon.type = holonTypes.utility;
    pipeHolon.position = holonPosition.singlepart;
    pipeHolon.parentHolon = this;
    this.childHolons.push(pipeHolon);

    // Add layer holons
    const layerHolons = [interfaceHolon, switchHolon, coreHolon, allocationHolon, pipeHolon];
    interfaceHolon.layerHolons = layerHolons;
    switchHolon.layerHolons = layerHolons;
    coreHolon.layerHolons = layerHolons;
    allocationHolon.layerHolons = layerHolons;
    pipeHolon.layerHolons = layerHolons;
  }
}

class InterfaceHolon {
  // ID
  id = 0.11;
  // Name
  name = 'InterfaceHolon';
  // Perception is an object with following properties: type, content
  perceptions = [];
  // Unread messages
  // Message is an object with following properties: sender, type, content, ontology, receiver and conversation ID
  messages = [];
  // Messages that have been read
  readMessages = [];
  // Data
  data = {};

  status = holonStatus.na;
  type = holonTypes.na;
  position = holonPosition.na;
  representativeHolon = null;
  parentHolon = null;
  childHolons = [];
  layerHolons = [];
  numberOfReadMessages = 0;
  numberOfPerceptions = 0;
}

class CoreHolon {
  // ID
  id = 0.13;
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

  status = holonStatus.na;
  type = holonTypes.na;
  position = holonPosition.na;
  representativeHolon = null;
  parentHolon = null;
  childHolons = [];
  layerHolons = [];
  numberOfReadMessages = 0;
  numberOfPerceptions = 0;

  receiveMessage(message) {
    this.messages.push(message);
    this.readMessages();
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

  readMessages() {
    const messages = this.messages;
    this.messages = [];
    messages.forEach((message) => {
      switch (message.type) {
        case 'request':
          // message.content.allocationRequest has following properties: tasks, holons, allocation
          if (message.ontology === 'allocations' && message.content.allocationRequest) {
            utils.log('Info', 'Core holon received an allocation request');
            const result = this.allocate(message.content.allocationRequest);
            this.sendMessage(message, 'requestResponse', { result }, 'allocations');
            utils.log('Info', 'Core holon has completed the allocation request');
          }
          break;
        case 'algorithms':
          if (message.ontology === 'algorithms' && message.content.algorithms) {
            this.data.algorithms = message.content.algorithms;
            utils.log(
              'Info',
              'Core holon has received ' + this.data.algorithms.length + ' algorithms with following names: ' + this.data.algorithms.map((alg) => alg.name).join(', ')
            );
          }
          break;
      }
    });
    this.readMessages = this.readMessages.concat(messages);
  }

  /**
   * Allocates resources
   * @param {object} allocationRequest has properties allHolons, allTasks and allocation
   * @returns {object} result - has two properties: error and allocations
   */
  allocate(allocationRequest) {
    try {
      const allHolons = JSON.parse(JSON.stringify(allocationRequest.allHolons));
      const allTasks = JSON.parse(JSON.stringify(allocationRequest.allTasks));
      const algorithmName = allocationRequest.allocation.request.algorithm;

      const holons = [];
      const tasks = [];
      let algorithm = null;

      allHolons.forEach((holon) => {
        if (allocationRequest.allocation.request.holonIds.includes(holon.id)) {
          holons.push(holon);
        }
      });

      allTasks.forEach((task) => {
        if (allocationRequest.allocation.request.taskIds.includes(task.id)) {
          tasks.push(task);
        }
      });

      this.data.algorithms.forEach((alg) => {
        if (alg.name === algorithmName) {
          algorithm = alg;
        }
      });

      if (algorithm) return algorithm.run(tasks, holons);
      else throw new Error();
    } catch (err) {
      utils.log('Error', 'Core holon was unable to allocate resources');
      return { error: 'Server was unable to handle this allocation request' };
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

    this.layerHolons.forEach((holon) => {
      if (holon.id === message.receiver) holon.receiveMessage(message);
    });
  }
}

class AllocationHolon {
  // ID
  id = 0.14;
  // Name
  name = 'AllocationHolon';
  // Perception is an object with following properties: type, content
  perceptions = [];
  handledPerceptions = [];
  // Unread messages
  // Message is an object with following properties: sender, type, content, ontology, receiver and conversation ID
  messages = [];
  // Messages that have been read
  readMessages = [];
  // Data
  // data.algorithms has following properties: type, name, description, run
  data = {};

  status = holonStatus.na;
  type = holonTypes.na;
  position = holonPosition.na;
  parentHolon = null;
  representativeHolon = null;
  childHolons = [];
  layerHolons = [];
  numberOfReadMessages = 0;
  numberOfPerceptions = 0;

  constructor() {
    this.loadAlgorithms();
  }

  loadAlgorithms() {
    this.data.algorithms = algorithms.getAlgorithms();
    this.registerAlgorithms();
  }

  receiveMessage(message) {
    this.messages.push(message);
    this.readMessages();
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

  readMessages() {
    const messages = this.messages;
    this.messages = [];

    messages.forEach((message) => {
      switch (message.type) {
        case 'request':
          if (message.content === 'algorithms' && message.ontology === 'algorithms') {
            this.sendMessage(message, 'requestResponse', this.data.algorithms, 'algorithms');
          }
          break;
      }
    });

    this.readMessages = this.readMessages.concat(messages);
  }

  sendMessage(receivedMessage, type, content, ontology) {
    const message = {};
    message.sender = this.id;
    message.type = type;
    message.content = content;
    message.ontology = ontology;
    message.receiver = receivedMessage.sender;
    message.conversationId = receivedMessage.conversationId;

    this.layerHolons.forEach((holon) => {
      if (holon.id === message.receiver) holon.receiveMessage(message);
    });
  }

  /**
   * Register algorithms
   * this.data.algorithms is an array with objects with properties type, name, run, description
   */
  async registerAlgorithms() {
    const response = await backendApi.registerAlgorithms(this.data.algorithms);
    if (response) utils.log('Success', 'Algorithms have been registered');
    else throw new Error('Error', 'Failed to register algorithms');
  }
}

class PipeHolon {
  // ID
  id = 0.15;
  // Name
  name = 'PipeHolon';
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

  status = holonStatus.na;
  type = holonTypes.na;
  position = holonPosition.na;
  parentHolon = null;
  representativeHolon = null;
  childHolons = [];
  layerHolons = [];
  numberOfReadMessages = 0;
  numberOfPerceptions = 0;

  receiveMessage(message) {
    this.messages.push(message);
    this.readMessages();
  }

  receivePerception(perception) {
    this.perceptions.push(perception);
    this.handlePerceptions();
  }

  handlePerceptions() {
    const perceptions = this.perceptions;
    this.perceptions = [];

    perceptions.forEach((perception) => {
      switch (perception.name) {
        case 'tasksUpdated':
          this.data.tasks = perception.content.tasks;
          break;
      }
    });

    this.handlePerceptions = this.handlePerceptions.concat(perceptions);
  }

  readMessages() {
    const messages = this.messages;
    this.messages = [];

    messages.forEach((message) => {
      switch (message.type) {
        case 'request':
          if (message.content === 'tasks' && message.ontology === 'tasks') {
            this.sendMessage(message, 'requestResponse', this.data.tasks, 'tasks');
          }
          break;
      }
    });

    this.readMessages = this.readMessages.concat(messages);
  }

  sendMessage(receivedMessage, type, content, ontology) {
    const message = {};
    message.sender = this.id;
    message.type = type;
    message.content = content;
    message.ontology = ontology;
    message.receiver = receivedMessage.sender;
    message.conversationId = receivedMessage.conversationId;

    this.layerHolons.forEach((holon) => {
      if (holon.id === message.receiver) holon.receiveMessage(message);
    });
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

const holonPosition = {
  na: 'N/A',
  super: 'SUPER',
  representative: 'REPRESENTATIVE',
  multipart: 'MULTIPART',
  singlepart: 'SINGLEPART',
  atomic: 'ATOMIC',
};
