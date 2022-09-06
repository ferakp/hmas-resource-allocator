import React from 'react';
import styles from './Search.module.css';

export class Search extends React.Component {
  state = { schemaData: [], listObjectsArgumentsData: [] };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.update();
  }

  update() {
    // Schema data
    // name, type, description, isReadOnly, Context
    this.setState({
      schemaData: [
        ['type', ['string'], 'Search type.', false, ['view', 'edit', 'embed']],
        ['resource', ['string'], 'Search resource.', false, ['view', 'edit', 'embed']],
        ['ids', ['array (elements as number)'], 'Search ids.', false, ['view', 'edit', 'embed']],
        ['latest_update', ['string (JS Date)'], 'The latest update time.', false, ['view', 'edit', 'embed']],
      ],

      // Create an object
      // name, isNecessaryParameter, description
      createObjectData: [
        [
          'type',
          true,
          'Search type. Accepted types are bulk-search and bulk-update-check. Bulk-search is reserved for bulk search.' +
            ' Bulk-update-check checks the status of given IDs and inform user if any of them are deleted or changed.',
        ],
        ['resource', true, 'Search resource. Following resources are accepted: users, holons, tasks, allocations.'],
        ['ids', true, 'Search ids.'],
        ['latest_update', false, 'The latest update time.'],
      ],
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.title}>Search</p>
          <div className={styles.tableContent}>
            <p>Topics</p>
            <ul className={styles.tableList}>
              <li>
                <a href="#object">Schema</a>
              </li>
              <li>
                <a href="#createobject">Make an advanced search</a>
                <ul className={styles.innerTableList}>
                  <li>
                    <a href="#createobjectdefinition">Definition</a> -{' '}
                  </li>
                  <li>
                    <a href="#createobjectexamplerequests">Example Request</a> -{' '}
                  </li>
                  <li>
                    <a href="#createobjectarguments">Arguments</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <p className={styles.sectionTitle} id="object">
            Schema
          </p>
          <p className={styles.descriptionText}>
            The schema defines all the fields that exist within a search record. Any response from these endpoints can be expected to contain the fields. Each field has its own
            format, description and requirement(s).
          </p>

          <table className={styles.sectionTable}>
            <tbody>
              {this.state.schemaData?.map((data, i) => {
                return (
                  <tr key={'trschemadata' + i}>
                    <td>
                      <code>{data[0]}</code>
                      <br />
                      <br />
                      <span>({data[1].join(', ')})</span>
                    </td>
                    <td>
                      {data[2]}
                      <br />
                      {data[3] === true ? (
                        <span>
                          <br />
                          Read only
                          <br />
                        </span>
                      ) : (
                        ''
                      )}
                      <br />
                      Context: {data[4].join(', ')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className={styles.sectionTitle} id="createobject">
            Make an advanced search
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>
            Use this endpoint to make an advanced search. The parameters with the asterisk (*) character are necessary ones that are needed in creation of a search.
          </p>

          <p className={styles.subsectionTitle} id="createobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>POST /api/v1/search</p>

          <p className={styles.subsectionTitle} id="createobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl -H ..... -X POST https://example.com/api/v1/search</p>

          <p className={styles.subsectionTitle} id="createobjectarguments">
            Arguments
          </p>
          <table className={styles.sectionTable}>
            <tbody>
              {this.state.createObjectData?.map((data, i) => {
                return (
                  <tr key={'trschemadataasd' + i}>
                    <td>
                      <code>
                        {data[0]}
                        {data[1] ? <span style={{ color: 'red' }}>*</span> : ''}
                      </code>
                    </td>
                    <td>{data[2]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
