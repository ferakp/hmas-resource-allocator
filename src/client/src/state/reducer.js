import { initialState } from './state';
import * as utils from '../utils/utils';
import * as api from '../api/api';

export const reducer = (state, action) => {
  let newState = { ...state };
  switch (action.type) {
    case 'REFRESHTOKEN':
      newState.auth.token = action.payload.token;
      localStorage.setItem('authState', JSON.stringify(newState.auth));
      api.setToken(action.payload.token);
      break;
    case 'LOGGEDIN':
      newState.auth.loginTime = action.payload.loginTime;
      newState.auth.user = action.payload.user;
      newState.auth.token = action.payload.token;

      // Invalid login information received - logout user
      if (!newState.auth.loginTime || !newState.auth.user || !newState.auth.token) {
        newState.auth = JSON.parse(
          JSON.stringify({
            loginTime: null,
            token: null,
            user: null,
          })
        );
        api.deActivateApiMinimal();
      }
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
      api.deActivateApiMinimal();
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
    case 'UPDATE_HOLON':
      utils.updateHolon(newState, action.payload.holon);
      break;
    case 'DELETE_TASK':
      utils.deleteTask(newState, action.payload.id);
      break;
    case 'ADD_TASK':
      utils.addTask(newState, action.payload.task);
      break;
    case 'ADD_HOLON':
      utils.addHolon(newState, action.payload.holon);
      break;
    case 'ADD_GLOBAL_ERROR_MESSAGE':
      newState.globalErrorMessage = action.payload.globalErrorMessage;
      break;
  }
  return newState;
};
