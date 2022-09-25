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
    activity: [],
  },
  globalErrorMessage: null,
  settings: {
    
  }
};

const syncFromLocalStorage = () => {
  const auth = localStorage.getItem('authState');
  if (auth && JSON.parse(auth)) {
    const initialStateAuth = JSON.parse(auth);
    if (!initialStateAuth.loginTime && !initialStateAuth.token && !initialStateAuth.user) {
      return;
    } else {
      initialState.auth = initialStateAuth;
    }
  }
};

syncFromLocalStorage();
