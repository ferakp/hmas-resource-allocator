import React from 'react';
import styles from './Dashboard.module.css';
import { ProgressBar } from '../progress-bar/ProgressBar';
import { Analytics } from './analytics/Analytics';
import { Tasks } from './tasks/Tasks';
import { Algorithms } from './algorithms/Algorithms';
import { Allocations } from './allocations/Allocations';
import { Holons } from './holons/Holons';
import { Route, Routes } from 'react-router-dom';

export class Dashboard extends React.Component {
  state = {
    selectedTab: 'Analytics',
    tabs: ['Analytics', 'Tasks', 'Holons', 'Allocations', 'Algorithms'],
    errorMessage: '',
    displayError: false,
    loading: false,
  };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  showErrorMessage = (errorMessage) => {
    this.setState({ errorMessage: errorMessage, displayError: true });
    setTimeout(() => this.setState({ displayError: false }), 3000);
  };

  tabClicked = (tabName) => {
    this.setState({ selectedTab: tabName });
    this.props.navigate('dashboard/' + tabName.toLowerCase());
  };

  switchLoading = (mode) => {
    if (!mode) this.setState({ loading: !this.state.loading });
    else if (mode === 'on') this.setState({ loading: true });
    else this.setState({ loading: false });
  };

  render() {
    if (!this.props.state.auth.user) setTimeout(() => this.props.navigate('/'), 200);
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <p>Dashboard</p>
        </div>

        <div className={styles.tabs}>
          {this.state.tabs.map((tabName, index) => {
            return (
              <div className={styles.tabLinkContainer} key={'tabLinkContainer' + index}>
                <p onClick={() => this.tabClicked(tabName)} className={`${styles.tab} ${tabName === this.state.selectedTab ? styles.activeTab : ''}`}>
                  {tabName}
                </p>
              </div>
            );
          })}
        </div>

        <hr className={styles.tabHr} />
        <div className={styles.tabContainer}>
          <ProgressBar loading={this.state.loading} />
          <div className={`${styles.tabErrorContainer} ${this.state.displayError ? styles.displayError : ''}`}>
            <p className={styles.errorMessage}>{this.state.errorMessage}</p>
          </div>
          <Routes>
            <Route path="/analytics" element={<Analytics switchLoading={this.switchLoading} showErrorMessage={this.showErrorMessage} {...this.props} />} />
            <Route path="/tasks" element={<Tasks switchLoading={this.switchLoading} showErrorMessage={this.showErrorMessage} {...this.props} />} />
            <Route path="/algorithms" element={<Algorithms switchLoading={this.switchLoading} showErrorMessage={this.showErrorMessage} {...this.props} />} />
            <Route path="/allocations" element={<Allocations switchLoading={this.switchLoading} showErrorMessage={this.showErrorMessage} {...this.props} />} />
            <Route path="/holons" element={<Holons switchLoading={this.switchLoading} showErrorMessage={this.showErrorMessage} {...this.props} />} />
          </Routes>
        </div>
      </div>
    );
  }
}
