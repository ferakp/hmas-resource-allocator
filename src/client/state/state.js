import { messages } from "../messages/messages";

export let initialState = {
  auth: {
    login: {
      loginTime: 0,
      loginSuccessfull: false,
      responseMessage: "",
    },
    passwordRequest: {
      requestTime: 0,
      requestSuccessfull: false,
      responseMessage: "",
    },
    user: {
      username: "",
      userId: "",
    },
  },
};

export const reducer = (state, action) => {
  let newState = { ...state };
  switch (action.type) {
    case "LOGIN":
      newState.auth.login.loginTime = Date.now();
      if (
        action.payload.username === "demo" &&
        action.payload.password === "demo"
      ) {
        newState.auth.login.loginSuccessfull = true;
        newState.auth.user.loginSuccessfull = true;
        newState.auth.user.username = "Demo";
        newState.auth.user.userId = 555555;
      } else {
        newState.auth.login.loginSuccessfull = false;
        newState.auth.login.responseMessage = messages.INVALID_CREDENTIALS;
      }
      break;
    case "LOGOUT":
      newState.auth.user.loginSuccessfull = false;
      newState.auth.user.username = "";
      newState.auth.user.userId = "";
      break;
    case 'READ_NOTIFICATIONS':
      newState.auth.login.responseMessage = "";
      newState.auth.passwordRequest.responseMessage = "";
      break;
    case "FORGOT_PASSWORD":
      newState.auth.passwordRequest.requestTime = Date.now();
      newState.auth.passwordRequest.requestSuccessfull = true;
      newState.auth.passwordRequest.responseMessage =
        messages.PASSWORD_REQUEST_HAS_BEEN_SENT;
      break;
    default:
      throw new Error();
  }
  return newState;
};
