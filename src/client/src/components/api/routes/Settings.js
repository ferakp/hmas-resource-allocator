import React from 'react';
import styles from './Settings.module.css';

export class Settings extends React.Component {
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
        ['id', ['number'], 'The unique identifier for the settings.', true, ['view', 'edit']],
        ['settings', ['string (JSON)'], 'The settings.', false, ['view', 'edit', 'embed']],
        ['created_on', ['string (JS Date)'], 'The exact time the settings was created.', true, ['view']],
        ['updated_on', ['string (JS Date)'], 'The latest time when the settings were updated.', true, ['view']],
        ['created_by', ['string (JS Date)'], 'The ID of the user to whom the settings belong.', true, ['view']],
      ],

      // List objects
      // name, isSupportingSpecialControllers, description
      listObjectsArgumentsData: [
        ['id', false, 'The unique identifier for the settings.'],
        ['settings', false, 'The settings.'],
        ['created_on', true, 'The exact time the settings was created.time.'],
        ['updated_on', true, 'The latest time when the settings were updated.'],
        ['created_by', false, 'The ID of the user to whom the settings belong.'],
      ],

      // Create an object
      // name, isNecessaryParameter, description
      createObjectData: [['settings', true, 'The settings.']],

      // Retrieve an object
      // name, description
      retrieveObjectData: [['id', 'Unique identifier for the settings.']],

      // Update an object
      // name, description
      updateObjectData: [['settings', 'The settings.']],

      // Delete an object
      // name, description
      deleteObjectData: [['id', 'Unique identifier for the settings.']],
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.title}>Settings</p>
          <div className={styles.tableContent}>
            <p>Topics</p>
            <ul className={styles.tableList}>
              <li>
                <a href="#object">Schema</a>
              </li>
              <li>
                <a href="#listobjects">List settings</a>
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
              <li>
                <a href="#createobject">Create settings</a>
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
              <li>
                <a href="#retrieveobject">Retrieve settings</a>
                <ul className={styles.innerTableList}>
                  <li>
                    <a href="#retrieveobjectdefinition">Definition</a> -{' '}
                  </li>
                  <li>
                    <a href="#retrieveobjectsexamplerequests">Example Request</a> -{' '}
                  </li>
                  <li>
                    <a href="#retrieveobjectarguments">Arguments</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#updateobject">Update settings</a>
                <ul className={styles.innerTableList}>
                  <li>
                    <a href="#updateobjectdefinition">Definition</a> -{' '}
                  </li>
                  <li>
                    <a href="#updateobjectexamplerequests">Example Request</a> -{' '}
                  </li>
                  <li>
                    <a href="#updateobjectarguments">Arguments</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#deleteobject">Delete settings</a>
                <ul className={styles.innerTableList}>
                  <li>
                    <a href="#deleteobjectdefinition">Definition</a> -{' '}
                  </li>
                  <li>
                    <a href="#deleteobjectexamplerequests">Example Request</a> -{' '}
                  </li>
                  <li>
                    <a href="#deleteobjectarguments">Arguments</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <p className={styles.sectionTitle} id="object">
            Schema
          </p>
          <p className={styles.descriptionText}>
            The schema defines all the fields that exist within a settings record. Any response from these endpoints can be expected to contain the fields. Each field has its own
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

          <p className={styles.sectionTitle} id="listobjects">
            List settings
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>
            Query this endpoint to retrieve a collection of settings. The response you receive can be controlled and filtered using the URL query parameters below. Parameters with
            the asterisk (*) character support .e (equal), .elt (equal or less than), .egt (equal or greater than), .gt (greater than) and .lt (less than) suffix controllers.
            <br />
            <br /> For example GET <u>api/v1/settings?updated_on.egt="2022-09-04T12:17:17.551Z"</u> would return all settings that have been updated on 4th July 2022 (12 AM) or after
            the given time.
          </p>

          <p className={styles.subsectionTitle} id="listobjectsdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>GET /api/v1/settings</p>

          <p className={styles.subsectionTitle} id="listobjectsexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl https://example.com/api/v1/settings</p>

          <p className={styles.subsectionTitle} id="listobjectsarguments">
            Arguments
          </p>
          <table className={styles.sectionTable}>
            <tbody>
              {this.state.listObjectsArgumentsData?.map((data, i) => {
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

          <p className={styles.sectionTitle} id="createobject">
            Create settings
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>
            Use this endpoint to create settings. The parameters with the asterisk (*) character are necessary ones that are needed in creation of settings.
          </p>

          <p className={styles.subsectionTitle} id="createobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>POST /api/v1/settings</p>

          <p className={styles.subsectionTitle} id="createobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl -H ..... -X POST https://example.com/api/v1/settings</p>

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

          <p className={styles.sectionTitle} id="retrieveobject">
            Retrieve settings
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>Use this endpoint to retrieve a specific settings.</p>

          <p className={styles.subsectionTitle} id="retrieveobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>GET /api/v1/settings/&#8249;id&#8250;</p>

          <p className={styles.subsectionTitle} id="retrieveobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl https://example.com/api/v1/settings/&#8249;id&#8250;</p>

          <p className={styles.subsectionTitle} id="retrieveobjectarguments">
            Arguments
          </p>
          <table className={styles.sectionTable}>
            <tbody>
              {this.state.retrieveObjectData?.map((data, i) => {
                return (
                  <tr key={'trschemadasdataasd' + i}>
                    <td>
                      <code>{data[0]}</code>
                    </td>
                    <td>{data[1]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className={styles.sectionTitle} id="updateobject">
            Update settings
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>Use this endpoint to update a specific settings.</p>

          <p className={styles.subsectionTitle} id="updateobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>PATCH /api/v1/settings/&#8249;id&#8250;</p>

          <p className={styles.subsectionTitle} id="updateobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl -H .... -X PATCH https://example.com/api/v1/settings/&#8249;id&#8250;</p>

          <p className={styles.subsectionTitle} id="updateobjectarguments">
            Arguments
          </p>

          <table className={styles.sectionTable}>
            <tbody>
              {this.state.updateObjectData?.map((data, i) => {
                return (
                  <tr key={'trschemadasdatassasd' + i}>
                    <td>
                      <code>{data[0]}</code>
                    </td>
                    <td>{data[1]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className={styles.sectionTitle} id="deleteobject">
            Delete settings
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>Use this endpoint to delete a specific settings.</p>

          <p className={styles.subsectionTitle} id="deleteobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>DELETE /api/v1/settings/&#8249;id&#8250;</p>

          <p className={styles.subsectionTitle} id="deleteobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl -X DELETE https://example.com/api/v1/settings/&#8249;id&#8250;</p>

          <p className={styles.subsectionTitle} id="deleteobjectarguments">
            Arguments
          </p>

          <table className={styles.sectionTable}>
            <tbody>
              {this.state.deleteObjectData?.map((data, i) => {
                return (
                  <tr key={'trschemadasdatasddasd' + i}>
                    <td>
                      <code>{data[0]}</code>
                    </td>
                    <td>{data[1]}</td>
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
