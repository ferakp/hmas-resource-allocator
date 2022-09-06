import React from 'react';
import styles from './Status.module.css';

export class Status extends React.Component {
  state = { schemaData: [], listObjectsArgumentsData: [] };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.update();
  }

  update() {
    this.setState({});
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.title}>Status</p>
          <div className={styles.tableContent}>
            <p>Topics</p>
            <ul className={styles.tableList}>
              <li>
                <a href="#listobjects">Retrieve a status</a>
                <ul className={styles.innerTableList}>
                  <li>
                    <a href="#listobjectsdefinition">Definition</a> -{' '}
                  </li>
                  <li>
                    <a href="#listobjectsexamplerequests">Example Request</a> -{' '}
                  </li>
                  <li>
                    <a href="#listobjectsarguments">Arguments</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <p className={styles.sectionTitle} id="listobjects">
            Retrieve a status
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>Query this endpoint to retrieve a status.</p>

          <p className={styles.subsectionTitle} id="listobjectsdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>GET /api/v1/status</p>

          <p className={styles.subsectionTitle} id="listobjectsexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl https://example.com/api/v1/status</p>
        </div>
      </div>
    );
  }
}
