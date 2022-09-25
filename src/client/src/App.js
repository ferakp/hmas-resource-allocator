import React, { useReducer } from 'react';
import styles from './App.module.css';
import { Route, Routes } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router';
import { getContext } from './state/context';
import { initialState } from './state/state';
import { reducer } from './state/reducer';
import { LeftSidebar } from './components/sidebars/left-side-bar/LeftSidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { Account } from './components/account/Account';
import { Help } from './components/help/Help';
import { Api } from './components/api/Api';
import { Login } from './components/login/Login';
import { Users } from './components/users/Users';
import * as api from './api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends React.Component {
  static AppContext = getContext();
  state = { activeContainer: 'Default', displayingErrorMessage: false };

  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    if (this.props.state.globalErrorMessage && !this.state.displayingErrorMessage) {
      this.props.dispatch({ type: 'ADD_GLOBAL_ERROR_MESSAGE', payload: { globalErrorMessage: '' } });
      this.setState({ displayingErrorMessage: true });
      toast.error(this.props.state.globalErrorMessage, { autoClose: 4100, closeOnClick: true, hideProgressBar: true, pauseOnHover: false });
      setTimeout(() => this.setState({ displayingErrorMessage: false }), 4500);
    }
  }

  componentDidMount() {
    if (
      !this.props.state.auth.user &&
      this.props.location.pathname !== '/' &&
      !this.props.location.pathname.startsWith('/api') &&
      !this.props.location.pathname.startsWith('/help')
    )
      setTimeout(() => this.props.navigate('/'), 500);
    // Wait till other libraries have uploaded
    setTimeout(() => {
      // Active API
      api.setDispatch(this.props.dispatch);
      if (this.props.state.auth.token) {
        api.setToken(this.props.state.auth.token);
        api.activateApi();
      }
      if (this.props.state.auth.user && this.props.location.pathname === '/') {
        setTimeout(() => this.props.navigate('/dashboard'), 150);
      }
    }, 100);
  }

  render() {
    return (
      <App.AppContext.Provider value={{ dispatch: this.props.dispatch }}>
        <div className={styles.app}>
          <LeftSidebar activeLink={this.state.activeContainer} {...this.props} />
          <div className={styles.container}>
            <ToastContainer />
            <Routes>
              <Route path="/dashboard/*" element={<Dashboard {...this.props} />} />
              <Route path="/api/*" element={<Api {...this.props} />} />
              <Route path="/help" element={<Help {...this.props} />} />
              <Route path="/account" element={<Account {...this.props} />} />
              <Route path="/users" element={<Users {...this.props} />} />
              <Route path="/" element={<Login {...this.props} />} />
            </Routes>
          </div>
        </div>
      </App.AppContext.Provider>
    );
  }
}

const AppWrapper = () => {
  const [state, dispatch] = useReducer(reducer, JSON.parse(JSON.stringify(initialState)));
  let navigate = useNavigate();
  let location = useLocation();
  return <App location={location} navigate={navigate} state={state} dispatch={dispatch}></App>;
};

export default AppWrapper;
