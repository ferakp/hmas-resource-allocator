import * as utils from '../utils/utils';
import * as graphApi from '../api/graph-api';

export class Holon {
  // Previous holonObject
  holonObject = null;
  // Is artificial holon
  isArtificialHolon = false;
  // Perception is an object with following properties: type, content
  perceptions = [];
  handledPerceptions = [];
  // Unread messages
  // Message is an object with following properties: sender, type, content, ontology, receiver and conversation ID
  messages = [];
  // Messages that have been read
  readMessages = [];

  id = null;
  type = null;
  name = null;
  gender = null;
  daily_work_hours = null;
  remote_address = null;
  api_token = null;
  availability_data = null;
  load_data = null;
  stress_data = null;
  cost_data = null;
  age = null;
  experience_years = null;
  created_on = null;
  updated_on = null;
  created_by = null;
  graphRecords = [];
  latest_state = {
    representativeHolon: null,
    status: holonStatus.na,
    type: holonTypes.na,
    position: holonPositions.na,
    parentHolon: null,
    childHolons: [],
    layerHolons: [],
  };

  constructor(holonObject) {
    this.holonObject = holonObject;
    const formattedHolon = utils.formatHolonObject(holonObject, holonStatus, holonTypes, holonPositions);
    if (!formattedHolon) throw new Error();
    this.id = formattedHolon.id;
    this.type = formattedHolon.type;
    this.name = formattedHolon.name;
    this.gender = formattedHolon.gender;
    this.daily_work_hours = formattedHolon.daily_work_hours;
    this.remote_address = formattedHolon.remote_address;
    this.api_token = formattedHolon.api_token;
    this.availability_data = formattedHolon.availability_data;
    this.load_data = formattedHolon.load_data;
    this.stress_data = formattedHolon.stress_data;
    this.cost_data = formattedHolon.cost_data;
    this.age = formattedHolon.age;
    this.experience_years = formattedHolon.experience_years;
    this.created_on = formattedHolon.created_on;
    this.updated_on = formattedHolon.updated_on;
    this.created_by = formattedHolon.created_by;
    this.latest_state = formattedHolon.latest_state;
    this.is_available = formattedHolon.is_available;
    setInterval(() => this.updateGraph(), 20000);
  }

  /**
   * FUNCTIONS
   */

  update(holonObject) {
    if (JSON.stringify(this.holonObject) === JSON.stringify(holonObject)) return;
    const formattedHolon = utils.formatHolonObject(holonObject, holonStatus, holonTypes, holonPositions);
    this.type = formattedHolon.type;
    this.name = formattedHolon.name;
    this.gender = formattedHolon.gender;
    this.daily_work_hours = formattedHolon.daily_work_hours;
    this.remote_address = formattedHolon.remote_address;
    this.api_token = formattedHolon.api_token;
    this.availability_data = formattedHolon.availability_data;
    this.load_data = formattedHolon.load_data;
    this.stress_data = formattedHolon.stress_data;
    this.cost_data = formattedHolon.cost_data;
    this.age = formattedHolon.age;
    this.experience_years = formattedHolon.experience_years;
    this.created_on = formattedHolon.created_on;
    this.updated_on = formattedHolon.updated_on;
    this.created_by = formattedHolon.created_by;
    this.is_available = formattedHolon.is_available;
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
    this.readMessages.concat(this.messages);
    this.messages = [];
  }

  async updateGraph() {
    if (this.id !== null && this.name !== 'SuperHolon') {
      this.graphRecords = await graphApi.getGraph('Holon', this.id);
    }
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
