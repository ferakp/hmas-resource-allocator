import * as utils from '../utils/utils';
import * as backendApi from '../api/backend-api';
import * as algorithms from './Algorithms';

export class AllocationHolon {
  // This ID is reserved for allocation holon, do not change it!
  id = -5555;
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

  // Controllers
  algorithmRegisterationPending = false;

  // Intervals
  loadAlgorithmsInterval = null;

  latest_state = {
    representativeHolon: null,
    status: holonStatus.na,
    type: holonTypes.na,
    position: holonPositions.na,
    parentHolon: null,
    childHolons: [],
    layerHolons: [],
    isAlgorithmsRegistered: false,
  };

  constructor() {
    this.loadAlgorithmsInterval = setInterval(async () => await this.loadAlgorithms(), 500);
    utils.log('Status', 'Allocation holon - holon has been started');
  }

  async loadAlgorithms() {
    try {
      if(this.algorithmRegisterationPending) return;
      this.algorithmRegisterationPending = true;
      this.data.algorithms = algorithms.getAlgorithms();
      await this.registerAlgorithms();
      this.latest_state.isAlgorithmsRegistered = true;
      clearInterval(this.loadAlgorithmsInterval);
      utils.log('Status', 'Allocation holon - algorithms have been loaded');
      this.algorithmRegisterationPending = false;
    } catch (err) {
      this.algorithmRegisterationPending = false;
      this.latest_state.isAlgorithmsRegistered = false;
      utils.log('Status', 'Allocation holon - unable to load algorithms');
    }
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
        case 'dataRequest':
          if (message.content === 'algorithms' && message.ontology === 'algorithms') {
            utils.log('Status', 'Allocation holon - received data request for algorithms');
            this.sendMessage(message, 'data', { algorithms: this.data.algorithms }, 'algorithms');
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

    this.latest_state.layerHolons.forEach((holon) => {
      if (holon.id === message.receiver) holon.receiveMessage(message);
    });
  }

  /**
   * Register algorithms
   * this.data.algorithms is an array with objects with properties type, name, run, description
   */
  async registerAlgorithms() {
    const response = await backendApi.registerAlgorithms(this.data.algorithms);
    if (response.errors.length === 0 && response.data.length === this.data.algorithms.length) utils.log('Status', 'Allocation holon - algorithms have been registered');
    else {
      throw new Error('Error', 'Allocation holon - failed to register algorithms');
    }
  }

  stop() {
    clearInterval(this.loadAlgorithmsInterval);
    this.data = {};
    utils.log('Status', 'Allocation holon - stopped');
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
