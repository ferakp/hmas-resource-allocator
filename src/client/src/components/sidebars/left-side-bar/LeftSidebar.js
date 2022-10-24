import React from 'react';
import styles from './LeftSidebar.module.css';
import Icon from '@mdi/react';
import { getContext } from '../../../state/context';
import { mdiViewDashboardVariant } from '@mdi/js';
import { mdiCloudBraces } from '@mdi/js';
import { mdiCogOutline } from '@mdi/js';
import { mdiLogin } from '@mdi/js';
import { mdiHelpCircle } from '@mdi/js';
import { mdiAccountDetails } from '@mdi/js';
import { mdiAccountGroup } from '@mdi/js';
import { mdiChevronLeft } from '@mdi/js';
import { mdiChevronRight } from '@mdi/js';
import { mdiDatabase } from '@mdi/js';

export class LeftSidebar extends React.Component {
  state = {
    mode: 'Default',
  };
  static AppContext = getContext();

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize({ target: window });
  }

  handleResize = (event) => {
    if (event.target.innerWidth < 1400 && this.state.mode !== 'Minimize') this.setState({ mode: 'Minimize' });
    else if (event.target.innerWidth >= 1400 && this.state.mode !== 'Default') this.setState({ mode: 'Default' });
  };

  linkClick = (link) => {
    if (link && link === 'KnowledgeGraph') {
      let host = process.env.REACT_APP_NEO4J_HOST || window.location.origin.split(':')[1].replace('//', '');
      let port =  process.env.REACT_APP_NEO4J_PORT || 7474;
      const protocol = 'http';
      const url = process.env.REACT_APP_NEO4J_PORT.toString() === "80" ? protocol + '://' + host : protocol + '://' + host + ':' + port;
      window.open(url, '_blank');
    } else if (link && link !== 'Logout' && link !== 'Login') this.props.navigate('/' + link.toLowerCase());
    else if (link) {
      this.props.navigate('/');
      this.props.dispatch({ type: 'LOGOUT' });
    }
  };

  switchMenuMode = () => {
    if (this.state.mode === 'Minimize') this.setState({ mode: 'Default' });
    else {
      this.setState({ mode: 'Minimize' });
    }
  };

  render() {
    return (
      <div className={`${styles.container} ${this.state.mode === 'Minimize' ? styles.minimize : ''}`} ref={this.wrapperRef}>
        <div className={styles.innerContainer}>
          <div className={styles.logoContainer}>
            <div className={styles.iconContainer}>
              <div className={styles.titleContainer}>
                <p className={styles.title}>RAS</p>
                <p className={styles.titleFullName}>Resource Allocation System</p>
              </div>
            </div>
          </div>
          <div className={styles.linkContainer}>
            <div className={`${styles.link} ${this.props.location.pathname.startsWith('/dashboard') ? styles.activeLink : ''}`} onClick={() => this.linkClick('Dashboard')}>
              <Icon path={mdiViewDashboardVariant} size={1} color="rgba(255, 255, 255, 0.548)" className={styles.linkIcon} />
              <p className={styles.linkName}>Dashboard</p>
            </div>
            <div className={`${styles.link} ${this.props.location.pathname.startsWith('/api') ? styles.activeLink : ''}`} onClick={() => this.linkClick('API')}>
              <Icon path={mdiCloudBraces} size={1} color="rgba(255, 255, 255, 0.548)" className={styles.linkIcon} />
              <p className={styles.linkName}>API</p>
            </div>
            <div className={`${styles.link} ${this.props.location.pathname.startsWith('/help') ? styles.activeLink : ''}`} onClick={() => this.linkClick('Help')}>
              <Icon path={mdiHelpCircle} size={1} color="rgba(255, 255, 255, 0.548)" className={styles.linkIcon} />
              <p className={styles.linkName}>Help</p>
            </div>
            <div className={`${styles.link} ${this.props.location.pathname.startsWith('/users') ? styles.activeLink : ''}`} onClick={() => this.linkClick('Users')}>
              <Icon path={mdiAccountGroup} size={1} color="rgba(255, 255, 255, 0.548)" className={styles.linkIcon} />
              <p className={styles.linkName}>Users</p>
            </div>
            <div className={`${styles.link} ${styles.knowledgeGraph}`} onClick={() => this.linkClick('KnowledgeGraph')}>
              <Icon path={mdiDatabase} size={1} color="white" className={styles.linkIcon} />
              <p className={styles.linkName}>Knowledge Graph</p>
            </div>
            <div className={styles.minimizer}>
              <div className={styles.minimizerContent}>
                <div className={styles.minimizerIcon} onClick={() => this.switchMenuMode()}>
                  {this.state.mode === 'Minimize' ? (
                    <Icon path={mdiChevronRight} style={{ paddingLeft: '0px' }} size={1.3} color="white" className={styles.linkIcon} />
                  ) : (
                    <Icon path={mdiChevronLeft} style={{ paddingLeft: '0px' }} size={1.3} color="white" className={styles.linkIcon} />
                  )}
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <hr></hr>
              <div className={styles.link} onClick={() => (this.props.state.auth.user ? this.linkClick('Logout') : this.linkClick('Login'))}>
                <Icon rotate={this.props.state.auth.user ? 180 : 0} path={mdiLogin} size={1} color="rgba(255, 255, 255, 0.548)" className={styles.linkIcon} />
                <p className={styles.linkName}>{this.props.state.auth.user ? 'Logout' : 'Login'}</p>
              </div>
              {this.props.state.auth.user ? (
                <div className={`${styles.link} ${this.props.location.pathname.startsWith('/account') ? styles.activeLink : ''}`} onClick={() => this.linkClick('Account')}>
                  <Icon path={mdiAccountDetails} size={1} color="rgba(255, 255, 255, 0.548)" className={styles.linkIcon} />
                  <p className={styles.linkName}>
                    {this.props.state.auth.user.firstname[0].toUpperCase() +
                      this.props.state.auth.user.firstname.slice(1) +
                      ' ' +
                      this.props.state.auth.user.lastname[0].toUpperCase() +
                      '.'}
                  </p>
                </div>
              ) : (
                ''
              )}
              <hr></hr>
              <div className={styles.versionInfoContainer}>
                <p className={styles.versionInfoTitle}>Version number</p>
                <p className={styles.versionInfoNumber}>{this.props.state.version.number}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
