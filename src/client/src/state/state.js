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
  globalErrorMessage: null
};

const syncFromLocalStorage = () => {
  const auth = localStorage.getItem("authState");
  if(auth && JSON.parse(auth)) {
    initialState.auth = JSON.parse(auth);
  }
}

syncFromLocalStorage();