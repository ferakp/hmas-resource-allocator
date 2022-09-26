import * as utils from '../utils/utils';
import * as backendApi from '../api/backend-api';

/**
 * Pipe holon is a holon specialized retrieve and maintain tasks
 *
 * NOTICE
 * Tasks are formatted before being moved to storage
 * Invalid tasks are ignored
 *
 *
 */
export class PipeHolon {
  // This ID is reserved for pipe holon, do not change it!
  id = -4444;
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
    utils.log('Status', 'Pipe holon - the holon has been started');
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
    perceptions.forEach((perception) => {
      if (perception.type === 'tasksUpdate' && Array.isArray(perception.content.tasks)) {
        const tasks = [];
        perception.content.tasks.forEach((task) => {
          const formattedTask = utils.formatTask(task);
          if (formattedTask !== null) tasks.push(formattedTask);
        });
        utils.log('Status', 'Pipe holon - tasks have been updated');
        this.data.tasks = tasks;
      }
    });
    this.handledPerceptions = this.handledPerceptions.concat(perceptions);
  }

  readMessage() {
    const messages = this.messages;
    this.messages = [];

    messages.forEach((message) => {
      switch (message.type) {
        case 'dataRequest':
          if (message.content === 'tasks' && message.ontology === 'tasks') {
            this.sendMessage(message, 'data', { tasks: this.data.tasks }, 'tasks');
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
