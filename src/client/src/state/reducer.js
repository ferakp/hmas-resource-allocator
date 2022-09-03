import { initialState } from './state';
import * as utils from '../utils/utils';

export const reducer = (state, action) => {
  let newState = { ...state };
  switch (action.type) {
    case 'REFRESHTOKEN':
      newState.auth.token = action.payload.token;
      localStorage.setItem('authState', JSON.stringify(newState.auth));
    case 'LOGGEDIN':
      newState.auth.loginTime = action.payload.loginTime;
      newState.auth.user = action.payload.user;
      localStorage.setItem('authState', JSON.stringify(newState.auth));
      break;
    case 'LOGOUT':
      newState.auth = JSON.parse(
        JSON.stringify({
          loginTime: null,
          token: null,
          user: null,
        })
      );
      localStorage.setItem('authState', JSON.stringify(newState.auth));
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
    case 'ADD_GLOBAL_ERROR_MESSAGE':
      newState.globalErrorMessage = action.payload.globalErrorMessage;
      break;
  }
  return newState;
};
