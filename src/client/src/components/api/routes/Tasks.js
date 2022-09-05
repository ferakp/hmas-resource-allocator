import React from 'react';
import styles from './Holons.module.css';

export class Tasks extends React.Component {
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
        ['id', ['number'], 'The unique identifier for the holon.', true, ['view', 'edit']],
        ['type', ['string'], 'The type of holon.', false, ['view', 'edit', 'embed']],
        ['name', ['string'], "The holon's name.", false, ['view', 'edit', 'embed']],
        ['gender', ['string'], 'The gender of holon if the type of holon is employee.', false, ['view', 'edit', 'embed']],
        ['daily_work_hours', ['string'], 'The daily work hours of holon. Calculated by dividing total weekly work hours with seven.', false, ['view', 'edit', 'embed']],
        ['latest_state', ['string'], 'The latest_state of holon. Deprecated by September 2022.', true, ['view']],
        ['remote_address', ['string'], "The remote host address of holon if it's remote holon.", false, ['view', 'edit', 'embed']],
        ['api_token', ['string'], 'The API token for remote connection.', false, ['view', 'edit', 'embed']],
        ['availability_data', ['string'], 'The availability data of holon.', false, ['view', 'edit', 'embed']],
        ['load_data', ['string'], 'The load data of holon.', false, ['view', 'edit', 'embed']],
        ['stress_data', ['string'], 'The stress data of holon.', false, ['view', 'edit', 'embed']],
        ['cost_data', ['string'], 'The cost data of holon.', false, ['view', 'edit', 'embed']],
        ['age', ['string'], 'The age of holon if the type of holon is employee.', false, ['view', 'edit', 'embed']],
        ['experience_years', ['string'], 'The total experience years of holon.', false, ['view', 'edit', 'embed']],
        ['created_on', ['string'], 'The exact time the holon was created.', true, ['view']],
        ['updated_on', ['string'], 'The latest time the holon was updated.', true, ['view']],
        ['created_by', ['string'], 'The ID of the user who created the holon.', true, ['view']],
        ['is_available', ['string'], 'Is holon available for allocation requests.', false, ['view', 'edit', 'embed']],
      ],

      // List objects
      // name, isSupportingSpecialControllers, description
      listObjectsArgumentsData: [
        ['id', false, 'Limit results to those matching the given ID.'],
        ['type', false, 'Limit results to those matching the given type.'],
        ['name', false, 'Limit results to those matching the given name.'],
        ['gender', false, 'Limit results to those matching the given gender.'],
        ['daily_work_hours', true, 'Limit results to those matching the daily work hours.'],
        ['age', true, 'Limit results to those matching the given age.'],
        ['experience_years', true, 'Limit results to those matching the given experience years.'],
        ['created_on', true, 'Limit results to those matching the given created time.'],
        ['updated_on', true, 'Limit results to those matching the update time.'],
        ['created_by', false, 'Limit results to those matching the given creator ID.'],
        ['is_available', false, 'Limit results to those matching the availability.'],
      ],

      // Create an object
      // name, isNecessaryParameter, description
      createObjectData: [
        ['type', true, 'The type of holon.'],
        ['name', true, "The holon's name."],
        ['gender', false, 'The gender of holon if the type of holon is employee.'],
        ['daily_work_hours', false, 'The daily work hours of holon. Calculated by dividing total weekly work hours with seven.'],
        ['remote_address', false, "The remote host address of holon if it's remote holon."],
        ['api_token', false, 'The API token for remote connection.'],
        ['availability_data', false, 'The availability data of holon.'],
        ['load_data', false, 'The load data of holon.'],
        ['stress_data', false, 'The stress data of holon.'],
        ['cost_data', false, 'The cost data of holon.'],
        ['age', false, 'The age of holon if the type of holon is employee.'],
        ['experience_years', false, 'The total experience years of holon.'],
        ['is_available', false, 'Is holon available for allocation requests.'],
      ],

      // Retrieve an object
      // name, description
      retrieveObjectData: [['id', 'Unique identifier for the holon.']],

      // Update an object
      // name, description
      updateObjectData: [
        ['id', 'Unique identifier for the holon.'],
        ['type', 'The type of holon.'],
        ['name', "The holon's name."],
        ['gender', 'The gender of holon if the type of holon is employee.'],
        ['daily_work_hours', 'The daily work hours of holon. Calculated by dividing total weekly work hours with seven.'],
        ['remote_address', "The remote host address of holon if it's remote holon."],
        ['api_token', 'The API token for remote connection.'],
        ['availability_data', 'The availability data of holon.'],
        ['load_data', 'The load data of holon.'],
        ['stress_data', 'The stress data of holon.'],
        ['cost_data', 'The cost data of holon.'],
        ['age', 'The age of holon if the type of holon is employee.'],
        ['experience_years', 'The total experience years of holon.'],
        ['is_available', 'Is holon available for allocation requests.'],
      ],

      // Delete an object
      // name, description
      deleteObjectData: [['id', 'Unique identifier for the holon.']],
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.title}>Holons</p>
          <div className={styles.tableContent}>
            <p>Topics</p>
            <ul className={styles.tableList}>
              <li>
                <a href="#object">Schema</a>
              </li>
              <li>
                <a href="#listobjects">List holons</a>
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
                <a href="#createobject">Create a holon</a>
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
                <a href="#retrieveobject">Retrieve a holon</a>
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
                <a href="#updateobject">Update a holon</a>
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
                <a href="#deleteobject">Delete a holon</a>
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
            The schema defines all the fields that exist within a post record. Any response from these endpoints can be expected to contain the fields. Each field has its own
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
            List Holons
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>
            Query this endpoint to retrieve a collection of holons. The response you receive can be controlled and filtered using the URL query parameters below. Parameters with
            the asterisk (*) character support .e (equal), .elt (equal or less than), .egt (equal or greater than), .gt (greater than) and .lt (less than) suffix controllers.
            <br /> For example GET <u>api/v1/holons?updated_on.egt="2022-09-04T12:17:17.551Z"</u> would return all holons that have been updated on 4th July 2022 (12 AM) or after
            the given time.
          </p>

          <p className={styles.subsectionTitle} id="listobjectsdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>GET /api/v1/holons</p>

          <p className={styles.subsectionTitle} id="listobjectsexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl https://example.com/api/v1/holons</p>

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
            Create a holon
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>
            Use this endpoint to create a holon. The parameters with the asterisk (*) character are necessary ones that are needed in creation of a holon.
          </p>

          <p className={styles.subsectionTitle} id="createobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>POST /api/v1/holons</p>

          <p className={styles.subsectionTitle} id="createobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl -H ..... -X POST https://example.com/api/v1/holons</p>

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
            Retrieve a holon
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>Use this endpoint to retrieve a specific holon.</p>

          <p className={styles.subsectionTitle} id="retrieveobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>GET /api/v1/holons/&#8249;id&#8250;</p>

          <p className={styles.subsectionTitle} id="retrieveobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl https://example.com/api/v1/holons/&#8249;id&#8250;</p>

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
            Update a holon
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>Use this endpoint to update a specific holon.</p>

          <p className={styles.subsectionTitle} id="updateobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>PATCH /api/v1/holons/&#8249;id&#8250;</p>

          <p className={styles.subsectionTitle} id="updateobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl -H .... -X PATCH https://example.com/api/v1/holons/&#8249;id&#8250;</p>

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
            Delete a holon
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>Use this endpoint to delete a specific holon.</p>

          <p className={styles.subsectionTitle} id="deleteobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>DELETE /api/v1/holons/&#8249;id&#8250;</p>

          <p className={styles.subsectionTitle} id="deleteobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl -X DELETE https://example.com/api/v1/holons/&#8249;id&#8250;</p>

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
