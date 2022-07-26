import { messages } from '../messages/messages';
import * as utils from '../utils/utils';

export let initialState = {
  version: {
    number: 'v1.0.0',
  },
  auth: {
    loginTime: null,
    token: null,
    user: null,
  },
  data: {
    algorithms: [],
    allocations: [],
    holons: [],
    settings: [],
    tasks: [],
    users: [],
  },
};

export const reducer = (state, action) => {
  let newState = { ...state };
  switch (action.type) {
    case 'REFRESHTOKEN':
      newState.auth.token = action.payload.token;
    case 'LOGGEDIN':
      newState.auth.loginTime = action.payload.loginTime;
      newState.auth.user = action.payload.user;
      break;
    case 'LOGOUT':
      newState.auth = JSON.parse(JSON.stringify(initialState.auth));
      break;
    case 'READ_NOTIFICATIONS':
      break;
    case 'FORGOT_PASSWORD':
      break;
    case 'DATA_UPDATED':
      utils.debounceUpdateData(newState, action.payload.data);
      break;
    case 'UPDATE_TASK':
      utils.updateTask(newState, action.payload.task);
      break;
    case 'DELETE_TASK':
      utils.deleteTask(newState, action.payload.id);
      break;
    case 'ADD_TASK':
      utils.addTask(newState, action.payload.task);
      break;
    default:
      throw new Error();
  }
  return newState;
};
