import React from 'react';
import styles from './Dashboard.module.css';
import { Analytics } from './analytics/Analytics';
import { Tasks } from './tasks/Tasks';
import { Algorithms } from './algorithms/Algorithms';
import { Allocations } from './allocations/Allocations';
import { Holons } from './holons/Holons';

export class Dashboard extends React.Component {
  state = {
    selectedTab: 'Analytics',
    tabs: ['Analytics', 'Tasks', 'Holons', 'Allocations', 'Algorithms'],
    errorMessage: '',
    displayError: false,
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
  };

  getTab = () => {
    switch (this.state.selectedTab) {
      case 'Analytics':
        return <Analytics showErrorMessage={this.showErrorMessage} {...this.props} />;
        break;
      case 'Tasks':
        return <Tasks showErrorMessage={this.showErrorMessage} {...this.props} />;
        break;
      case 'Algorithms':
        return <Algorithms showErrorMessage={this.showErrorMessage} {...this.props} />;
        break;
      case 'Allocations':
        return <Allocations showErrorMessage={this.showErrorMessage} {...this.props} />;
        break;
      case 'Holons':
        return <Holons showErrorMessage={this.showErrorMessage} {...this.props} />;
        break;
    }
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
          <div className={`${styles.tabErrorContainer} ${this.state.displayError ? styles.displayError : ''}`}>
            <p className={styles.errorMessage}>{this.state.errorMessage}</p>
          </div>
          {this.getTab()}
        </div>
      </div>
    );
  }
}
