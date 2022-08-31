import React, { useReducer } from 'react';
import styles from './App.module.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router';
import { getContext } from './state/context';
import { initialState } from './state/state';
import { reducer } from './state/state';
import { LeftSidebar } from './components/sidebars/left-side-bar/LeftSidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { Account } from './components/account/Account';
import { Help } from './components/help/Help';
import { Holons } from './components/holons/Holons';
import { Settings } from './components/settings/Settings';
import { Login } from './components/login/Login';
import * as api from './api/api';

class App extends React.Component {
  static AppContext = getContext();
  state = { activeContainer: 'Default' };

  constructor(props) {
    super(props);
    api.setDispatch(this.props.dispatch);
  }

  render() {
    return (
      <App.AppContext.Provider value={{ dispatch: this.props.dispatch }}>
        <div className={styles.app}>
          <LeftSidebar activeLink={this.state.activeContainer} {...this.props} />
          <div className={styles.container}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard {...this.props} />} />
                <Route path="/holons" element={<Holons {...this.props} />} />
                <Route path="/help" element={<Help {...this.props} />} />
                <Route path="/settings" element={<Settings {...this.props} />} />
                <Route path="/account" element={<Account {...this.props} />} />
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
