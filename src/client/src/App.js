import React, { useReducer } from 'react';
import styles from './App.module.css';
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

  linkClick = (link) => {
    switch (link) {
      case 'Login':
        this.setState({ activeContainer: 'Default' });
      case 'Logout':
        this.props.dispatch({ type: 'LOGOUT' });
        setTimeout(() => console.log('auth ', this.props.state.auth), 2000);
        this.setState({ activeContainer: 'Default' });
    }
  };

  componentDidUpdate() {
    if (this.props.state.auth.user && this.state.activeContainer === 'Default'){
      this.setState({ activeContainer: 'Dashboard' });
    } 
  }

  getContainer = () => {
    if (!this.props.state.auth.user) return <Login {...this.props} />;
    switch (this.state.activeContainer) {
      case 'Dashboard':
        return <Dashboard {...this.props} />;
      case 'Holons':
        return <Holons {...this.props} />;
      case 'Help':
        return <Help {...this.props} />;
      case 'Settings':
        return <Settings {...this.props} />;
      case 'Account':
        return <Account {...this.props} />;
      case 'Default':
        return <Dashboard {...this.props} />;
    }
  };

  render() {
    return (
      <App.AppContext.Provider value={{ dispatch: this.props.dispatch }}>
        <div className={styles.app}>
          <LeftSidebar activeLink={this.state.activeContainer} onLinkClick={this.linkClick} {...this.props} />
          <div className={styles.container}>{this.getContainer()}</div>
        </div>
      </App.AppContext.Provider>
    );
  }
}

const AppWrapper = () => {
  const [state, dispatch] = useReducer(reducer, JSON.parse(JSON.stringify(initialState)));
  return <App state={state} dispatch={dispatch}></App>;
};

export default AppWrapper;
