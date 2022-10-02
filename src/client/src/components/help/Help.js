import React from 'react';
import styles from './Help.module.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export class Help extends React.Component {
  state = {
    anchor: '',
  };

  constructor(props) {
    super(props);
  }

  selectAnchor = (name) => {
    this.setState({ anchor: name });
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.title}>Help</p>
        </div>
        <div className={styles.content}>
          <div className={styles.leftContent}>
            <p className={styles.sectionTitle} id="general">
              General
            </p>
            <div className={styles.descriptionContainer}>
              <p className={styles.descriptionText}>
                The HMAS resource allocation system is a holonic multi-agent system providing allocation services for labour resources. It manages a fixed amount of some given
                tasks that must be allocated to labour resources (holons) who request that resource from the system. The system converts labour resources into holons and provide
                additional features for registering tasks.
              </p>

              <p className={styles.descriptionText}>
                The purpose of the system is to provide a flexible platform for advanced and complex allocation requests that are dependent on real-time dynamic labour resources
                and tasks. The system consist of six sub-systems: web application, backend, HMAS Container, relational database, graph database and natural language interface.
              </p>
            </div>

            <p className={styles.sectionTitle} id="webapplication">
              Web Application
            </p>
            <div className={styles.descriptionContainer}>
              <p className={styles.descriptionText}>
                The web application is application software that runs in a web browser. It provides instructions, functionalities and additional support for using the HMAS resource
                allocation system. The web application provides six different pages:{' '}
                <a onClick={() => this.selectAnchor('database')} href="#database">
                  Dashboard
                </a>
                ,{' '}
                <a onClick={() => this.selectAnchor('webapplicationapi')} href="#webapplicationapi">
                  API
                </a>
                ,{' '}
                <a onClick={() => this.selectAnchor('webapplicationhelp')} href="#webapplicationhelp">
                  Help
                </a>
                ,{' '}
                <a onClick={() => this.selectAnchor('webapplicationusers')} href="#webapplicationusers">
                  Users
                </a>
                ,{' '}
                <a onClick={() => this.selectAnchor('webapplicationsettings')} href="#webapplicationsettings">
                  Settings{' '}
                </a>
                and{' '}
                <a onClick={() => this.selectAnchor('webapplicationaccount')} href="#webapplicationaccount">
                  Account
                </a>
                .
              </p>

              <div className={styles.subSection}>
                <p className={styles.subSectionTitle} id="webapplicationdashboard">
                  Dashboard
                </p>
                <p className={styles.descriptionText}>
                  The dashboard page provides functionalities for viewing, editing, maintaning, deleting and monitoring data, tasks, holons, allocations, settings and algorithms.
                  Accessing dashboard requires an account with the role of user, admin or moderator.
                </p>
                <div className={styles.imageContainer}>
                  <Zoom>
                    <img src="/helpdashboard.png" style={{ maxWidth: '400px', maxHeight: '400px' }} />
                  </Zoom>
                  <p className={styles.imageCaption}>Figure: Dashboard</p>
                </div>
              </div>

              <div className={styles.subSection}>
                <p className={styles.subSectionTitle} id="webapplicationapi">
                  API
                </p>
                <p className={styles.descriptionText}>
                  The API page is built for providing documentation for the REST API. It provides the list of available endpoints with instructions. The API page is accessible for
                  both non-registered and registered users. It also provides information about specifications and standards the system uses in its REST API calls and responses.
                </p>
              </div>

              <div className={styles.subSection}>
                <p className={styles.subSectionTitle} id="webapplicationhelp">
                  Help
                </p>
                <p className={styles.descriptionText}>
                  This page contains information about the system, its sub-systems and usage. It provides detailed descriptions about the structure of the system and its
                  functionalities.
                </p>
              </div>

              <div className={styles.subSection}>
                <p className={styles.subSectionTitle} id="webapplicationusers">
                  Users
                </p>
                <p className={styles.descriptionText}>
                  Provides functionalities for viewing and maintaining users. Additionally, this page provides data for monitoring and inspecting all users.
                </p>
              </div>

              <div className={styles.subSection}>
                <p className={styles.subSectionTitle} id="webapplicationsettings">
                  Settings
                </p>
                <p className={styles.descriptionText}>
                  This page provides the settings of the web application. It has the settings of the application's API, colors, updaters and other application related features.
                  Each user has its own private settings stores in the relational database. Stored settings are retrieved from the relational database through the REST API.
                </p>
              </div>

              <div className={styles.subSection}>
                <p className={styles.subSectionTitle} id="webapplicationaccount">
                  Account
                </p>
                <p className={styles.descriptionText}>
                  Personal user-related information is available at Account page. Users are allowed to update their names, emails and password in account page.
                </p>
              </div>
            </div>

            <p className={styles.sectionTitle} id="database">
              Database
            </p>
            <div className={styles.descriptionContainer}>
              <p className={styles.descriptionText}>
                PostgreSQL database is available to both users and applications through the public REST API. The HMAS Resource Allocation system stores only relational data in its
                PostgreSQL database. Other types of data is stored in Neo4j graph database. For security purposes avoid direct relational database access and use only REST API for
                data manipulation.
              </p>
              <div className={styles.imageContainer}>
                <Zoom>
                  <img src="/databaseschema.png" style={{ maxWidth: '400px', maxHeight: '400px' }} />
                </Zoom>
                <p className={styles.imageCaption}>Figure: Database schema for version 1.0</p>
              </div>
            </div>

            <p className={styles.sectionTitle} id="rest">
              REST API
            </p>
            <div className={styles.descriptionContainer}>
              <p className={styles.descriptionText}>
                The HMAS Resource Allocator's REST API is implemented using <a href="https://en.wikipedia.org/wiki/Representational_state_transfer">REST</a> principles. The REST
                API uses <a href="https://jsonapi.org/">JSON:API</a> specifications for efficient requests and responses. More information is available on its page at{' '}
                <a href="/api">REST API</a>.
              </p>
            </div>

            <p className={styles.sectionTitle} id="hmascontainer">
              HMAS Container
            </p>
            <div className={styles.descriptionContainer}>
              <p className={styles.descriptionText}>
                HMAS Container is a holonic multi-agent platform for running holons and providing a multi-agent platform environment and functionalities for to them. Its holons
                automatically imports user-made allocation requests and returns the results back to the relational database. Every labour resource is represented by a user-made
                holon and the resource allocation algorithms are in format of the customized holons as well.
              </p>
            </div>

            <p className={styles.sectionTitle} id="naturallanguageinterface">
              Natural Language Interface
            </p>
            <div className={styles.descriptionContainer}>
              <p className={styles.descriptionText}>
                Natural Language Interface is a Python module providing interpretation functionalities from English to intermediate command language. It inspects sentences for
                possible commands and produces intermediate interpretations.
              </p>
            </div>

            <p className={styles.sectionTitle} id="version">
              Version
            </p>
            <div className={styles.descriptionContainer}>
              <p className={styles.descriptionText}>
                Each subsystem has its own version number. The current version number for the web application is 1.0. The REST API uses v1-version and the latest HMAS Container is
                updated to 1.2 version.
              </p>
            </div>
          </div>
          <div className={styles.rightContent}>
            <div className={styles.tableContent}>
              <p>Content</p>
              <ul className={styles.tableList}>
                <li>
                  <a className={this.state.anchor === 'general' ? styles.active : ''} href="#general" onClick={() => this.selectAnchor('general')}>
                    Resource Allocation System
                  </a>
                </li>
                <li>
                  <div className={styles.innerLinks}>
                    <a className={this.state.anchor === 'webapplication' ? styles.active : ''} href="#webapplication" onClick={() => this.selectAnchor('webapplication')}>
                      Web Application
                    </a>
                    <a
                      className={this.state.anchor === 'webapplicationdashboard' ? styles.active : ''}
                      href="#webapplicationdashboard"
                      onClick={() => this.selectAnchor('webapplicationdashboard')}
                    >
                      Dashboard
                    </a>
                    <a className={this.state.anchor === 'webapplicationapi' ? styles.active : ''} href="#webapplicationapi" onClick={() => this.selectAnchor('webapplicationapi')}>
                      API
                    </a>
                    <a
                      className={this.state.anchor === 'webapplicationhelp' ? styles.active : ''}
                      href="#webapplicationhelp"
                      onClick={() => this.selectAnchor('webapplicationhelp')}
                    >
                      Help
                    </a>
                    <a
                      className={this.state.anchor === 'webapplicationusers' ? styles.active : ''}
                      href="#webapplicationusers"
                      onClick={() => this.selectAnchor('webapplicationusers')}
                    >
                      Users
                    </a>
                    <a
                      className={this.state.anchor === 'webapplicationsettings' ? styles.active : ''}
                      href="#webapplicationsettings"
                      onClick={() => this.selectAnchor('webapplicationsettings')}
                    >
                      Settings
                    </a>
                    <a
                      className={this.state.anchor === 'webapplicationaccount' ? styles.active : ''}
                      href="#webapplicationaccount"
                      onClick={() => this.selectAnchor('webapplicationaccount')}
                    >
                      Account
                    </a>
                  </div>
                </li>
                <li>
                  <a className={this.state.anchor === 'database' ? styles.active : ''} href="#database" onClick={() => this.selectAnchor('database')}>
                    Database
                  </a>
                </li>
                <li>
                  <a className={this.state.anchor === 'rest' ? styles.active : ''} href="#rest" onClick={() => this.selectAnchor('rest')}>
                    REST API
                  </a>
                </li>
                <li>
                  <a className={this.state.anchor === 'hmascontainer' ? styles.active : ''} href="#hmascontainer" onClick={() => this.selectAnchor('hmascontainer')}>
                    HMAS Container
                  </a>
                </li>
                <li>
                  <a
                    className={this.state.anchor === 'naturallanguageinterface' ? styles.active : ''}
                    href="#naturallanguageinterface"
                    onClick={() => this.selectAnchor('naturallanguageinterface')}
                  >
                    Natural Language Interface
                  </a>
                </li>
                <li>
                  <a className={this.state.anchor === 'version' ? styles.active : ''} href="#version" onClick={() => this.selectAnchor('version')}>
                    Version
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
