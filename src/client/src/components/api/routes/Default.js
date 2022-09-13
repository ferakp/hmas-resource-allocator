import React from 'react';
import styles from './Default.module.css';

export class Default extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.title}>Reference</p>
          <div className={styles.descriptionContainer}>
            <div className={styles.tableContent}>
              <p>Table</p>
              <ul className={styles.tableList}>
                <li>
                  <a href="#description">Description</a>
                </li>
                <li>
                  <a href="#endpointreference">Endpoint Reference</a>
                </li>
                <li>
                  <a href="#version">Version</a>
                </li>
              </ul>
            </div>
            <p className={styles.descriptionText} id="description">
              The HMAS Resource Allocator's REST API is implemented using <a href="https://en.wikipedia.org/wiki/Representational_state_transfer">REST</a> principles. The REST API
              uses <a href="https://jsonapi.org/">JSON:API</a> specifications for efficient requests and responses. It has rich content for error responses and it provides
              detailed error messages for both requests and responses. The API uses built-in HTTP features, like HTTP authentication and HTTP verbs, which can be understood by
              off-the-shelf HTTP clients, and supports cross-origin resource sharing to allow you to interact securely with the API from a client-side web application.
            </p>

            <p className={styles.descriptionText}>
              The REST API provides private data accessible to only authenticated clients, as well as public data for monitoring status of server. Once authenticated the REST API
              supports most actions, allowing you to build alternative dashboards for a site, enhance your plugins with more responsive management tools, or integrate into existing
              system.
            </p>

            <p className={styles.descriptionText}>
              This API reference provides information on the specific endpoints available through the API, their parameters, and their response data format.
            </p>

            <p className={styles.referenceTableTitle}>REST API Developer Endpoint Reference</p>

            <table className={styles.endpointTable} id="endpointreference">
              <tbody>
                <tr>
                  <th>Resource</th>
                  <th>Base Route</th>
                  <th>Public</th>
                </tr>
                <tr>
                  <td><a href="/api/holons">Holons</a></td>
                  <td>/api/v1/holons</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td><a href="/api/allocations">Allocations</a></td>
                  <td>/api/v1/allocations</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td><a href="/api/tasks">Tasks</a></td>
                  <td>/api/v1/tasks</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td><a href="/api/users">Users</a></td>
                  <td>/api/v1/users</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td><a href="/api/algorithms">Algorithms</a></td>
                  <td>/api/v1/algorithms</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td><a href="/api/nli">Nli</a></td>
                  <td>/api/v1/nli</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td><a href="/api/settings">Settings</a></td>
                  <td>/api/v1/settings</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td><a href="/api/auth">Auth</a></td>
                  <td>/api/v1/auth</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td><a href="/api/status">Status</a></td>
                  <td>/api/v1/status</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td><a href="/api/search">Search</a></td>
                  <td>/api/v1/search</td>
                  <td>No</td>
                </tr>
              </tbody>
            </table>

            <p className={styles.versionTitle}>Version</p>

            <p className={styles.descriptionText} id="version">
              Current REST API version is 1.0, updated on 4th July 2022. This REST API documentation is written for the 1.0 version and doesn't not necessarily support newer versions. 
              If you are a REST API developer, please contact the system administrator before changing this documentation. 
            </p>
          </div>
        </div>
      </div>
    );
  }
}
