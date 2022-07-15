import { messages } from "../messages/messages";

export let initialState = {
  version: {
    number: "v1.0.0"
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
    settings: null,
    tasks: [],
    users: [],
  }
};

export const reducer = (state, action) => {
  let newState = { ...state };
  switch (action.type) {
    case 'REFRESHTOKEN':
      newState.auth.token = action.payload.token;
    case "LOGGEDIN":
      newState.auth.loginTime = action.payload.loginTime;
      newState.auth.user = action.payload.user;
      break;
    case "LOGOUT":
      newState.auth = JSON.parse(JSON.stringify(initialState.auth));
      break;
    case 'READ_NOTIFICATIONS':
      break;
    case "FORGOT_PASSWORD":
      break;
    default:
      throw new Error();
  }
  return newState;
};
