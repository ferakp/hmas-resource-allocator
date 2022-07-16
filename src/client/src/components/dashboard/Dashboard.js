import React from "react";
import styles from "./Dashboard.module.css";
import {Analytics} from './analytics/Analytics';
import {Tasks} from './tasks/Tasks';
import {Resources} from './resources/Resources';
import {Algorithms} from './algorithms/Algorithms';
import {Activity} from './activity/Activity';

export class Dashboard extends React.Component {
  state = {
    selectedTab: "Analytics",
    tabs: ["Analytics", "Tasks", "Resources", "Algorithms", "Activity"],
  };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  tabClicked = (tabName) => {
    this.setState({ selectedTab: tabName });
  };

  getTab = () => {
    switch(this.state.selectedTab) {
      case 'Analytics':
        return <Analytics />;
        break;
      case 'Tasks':
        return <Tasks/>;
        break;
      case 'Resources':
        return <Resources />
        break;
      case 'Algorithms':
        return <Algorithms />
        break;
      case 'Activity':
        return <Activity/>
        break;
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <p>Dashboard</p>
        </div>

        <div className={styles.tabs}>
          {this.state.tabs.map((tabName, index) => {
            return (
              <div className={styles.tabLinkContainer} key={"tabLinkContainer" + index}>
                <p
                  onClick={() => this.tabClicked(tabName)}
                  className={`${styles.tab} ${tabName === this.state.selectedTab ? styles.activeTab : ''}`}
                >
                  {tabName}
                </p>
              </div>
            );
          })}
        </div>

        <hr className={styles.tabHr} />
        <div className={styles.tabContainer}>
          {this.getTab()}
        </div>

      </div>
    );
  }
}
