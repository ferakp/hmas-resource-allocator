export let initialState = {
    user : {
        username: "",
        loginTime: "",
        userId: ""
    }
}


export const reducer = (state, action) => {
    let newState = { ...state };
    switch (action.type) {
      case "LOGIN":
        newState.user.username = "Demo";
        newState.user.loginTime = new Date().toString();
        newState.user.userId = 10000000000000000;
        break;
      default:
        throw new Error();
    }
    return newState;
  };