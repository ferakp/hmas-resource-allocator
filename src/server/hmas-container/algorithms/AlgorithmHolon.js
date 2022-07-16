import * as utils from '../utils/utils';
import * as log from '../logger/logger';
import * as Algorithms from '../algorithms/Algorithms';

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

class SwitchHolon {
  // ID
  id = 0.12;
  // Name
  name = 'SwitchHolon';
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

class AllocationHolon {
  // ID
  id = 0.14;
  // Name
  name = 'AllocationHolon';
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
  parentHolon = null;
  representativeHolon = null;
  childHolons = [];
  layerHolons = [];
  numberOfReadMessages = 0;
  numberOfPerceptions = 0;


  constructor(){

  }

  /**
   * Load algorithms with getAlgorithms call
   */
  loadAlgorithms(){

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

    this.handlePerceptions = this.handlePerceptions.concat(perceptions);
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

    this.layerHolons.forEach(holon => {
        if(holon.id === message.receiver) holon.receiveMessage(message);
    });
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

    this.layerHolons.forEach(holon => {
        if(holon.id === message.receiver) holon.receiveMessage(message);
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
