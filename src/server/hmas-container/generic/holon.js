import * as utils from '../utils/utils';

export class Holon {
  // Is artificial holon
  isArtificialHolon = false;
  // Perception is an object with following properties: type, content
  perceptions = [];
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
  latest_state = {
    status: holonStatus.na,
    type: holonTypes.na,
    position: holonPosition.na,
    parentHolon: null,
    childHolons: [],
    layerHolons: [],
    numberOfReadMessages: 0,
    numberOfPerceptions: 0,
  };

  constructor(holonObject) {
    const formattedHolon = utils.formatHolonObject(holonObject);
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
  }

  /**
   * FUNCTIONS
   */

  update(holonObject) {
    const formattedHolon = utils.formatHolonObject(holonObject);
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
