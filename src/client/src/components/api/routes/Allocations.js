import React from 'react';
import styles from './Allocations.module.css';

export class Allocations extends React.Component {
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
        ['id', ['number'], 'The unique identifier for the allocation.', true, ['view']],
        ['request_by', ['number'], 'The ID of the user who created the allocation request.', false, ['view', 'edit', 'embed']],
        ['request', ['string (JSON)'], 'The request.', false, ['view', 'edit', 'embed']],
        ['result', ['string (JSON)'], 'The result.', false, ['view', 'edit', 'embed']],
        ['start_time', ['string (JS Date)'], 'The exact time the allocation request was started by HMAS Container.', false, ['view', 'edit', 'embed']],
        ['end_time', ['string (JS Date)'], 'The exact time the allocation request was finished by HMAS Container.', false, ['view', 'edit', 'embed']],
        ['created_on', ['string (JS Date)'], 'The exact time the allocation was created.', true, ['view']],
        ['updated_on', ['string (JS Date)'], 'The latest time the allocation was updated.', true, ['view']],
        ['completed_on', ['string (JS Date)'], 'The exact time the allocation was completed by user.', true, ['view']],
        ['reallocate', ['boolean'], 'Should HMAS Container reallocate the allocation request.', false, ['view', 'edit', 'embed']],
      ],

      // List objects
      // name, isSupportingSpecialControllers, description
      listObjectsArgumentsData: [
        ['id', false, 'Limit results to those matching the given ID.'],
        ['request_by', false, 'The ID of the user who created the allocation request.'],
        ['start_time', true, 'The exact time the allocation request was started by HMAS Container.'],
        ['end_time', true, 'The exact time the allocation request was finished by HMAS Container.'],
        ['created_on', true, 'The exact time the allocation was created.'],
        ['completed_on', true, 'The exact time the allocation was completed by user.'],
        ['updated_on', true, 'The latest time the allocation was updated.'],
      ],

      // Create an object
      // name, isNecessaryParameter, description
      createObjectData: [['request', true, 'The request.']],

      // Retrieve an object
      // name, description
      retrieveObjectData: [['id', 'Unique identifier for the allocation request.']],

      // Update an object
      // name, description
      updateObjectData: [
        ['start_time', 'The exact time the allocation request was started by HMAS Container.'],
        ['end_time', 'The exact time the allocation request was finished by HMAS Container.'],
        ['result', 'The result'],
        ['completed_on', 'The exact time the allocation was completed by user.'],
        ['reallocate', 'Should HMAS Container reallocate the allocation request.'],
      ],

      // Delete an object
      // name, description
      deleteObjectData: [['id', 'Unique identifier for the allocation request.']],
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.title}>Allocations</p>
          <div className={styles.tableContent}>
            <p>Topics</p>
            <ul className={styles.tableList}>
              <li>
                <a href="#object">Schema</a>
              </li>
              <li>
                <a href="#listobjects">List allocations</a>
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
                <a href="#createobject">Create an allocation</a>
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
                <a href="#retrieveobject">Retrieve an allocation</a>
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
                <a href="#updateobject">Update an allocation</a>
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
                <a href="#deleteobject">Delete an allocation</a>
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
            The schema defines all the fields that exist within an allocation record. Any response from these endpoints can be expected to contain the fields. Each field has its own
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
            List allocations
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>
            Query this endpoint to retrieve a collection of allocations. The response you receive can be controlled and filtered using the URL query parameters below. Parameters
            with the asterisk (*) character support .e (equal), .elt (equal or less than), .egt (equal or greater than), .gt (greater than) and .lt (less than) suffix controllers.
            <br />
            <br /> For example GET <u>api/v1/allocations?updated_on.egt="2022-09-04T12:17:17.551Z"</u> would return all allocations that have been updated on 4th July 2022 (12 AM)
            or after the given time.
          </p>

          <p className={styles.subsectionTitle} id="listobjectsdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>GET /api/v1/allocations</p>

          <p className={styles.subsectionTitle} id="listobjectsexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl https://example.com/api/v1/allocations</p>

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
            Create an allocation
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>
            Use this endpoint to create a allocation. The parameters with the asterisk (*) character are necessary ones that are needed in creation of a allocation.
          </p>

          <p className={styles.subsectionTitle} id="createobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>POST /api/v1/allocations</p>

          <p className={styles.subsectionTitle} id="createobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl -H ..... -X POST https://example.com/api/v1/allocations</p>

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
            Retrieve a allocation
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>Use this endpoint to retrieve a specific allocation.</p>

          <p className={styles.subsectionTitle} id="retrieveobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>GET /api/v1/allocations/&#8249;id&#8250;</p>

          <p className={styles.subsectionTitle} id="retrieveobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl https://example.com/api/v1/allocations/&#8249;id&#8250;</p>

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
            Update an allocation
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>Use this endpoint to update a specific allocation.</p>

          <p className={styles.subsectionTitle} id="updateobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>PATCH /api/v1/allocations/&#8249;id&#8250;</p>

          <p className={styles.subsectionTitle} id="updateobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl -H .... -X PATCH https://example.com/api/v1/allocations/&#8249;id&#8250;</p>

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
            Delete an allocation
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>Use this endpoint to delete a specific allocation.</p>

          <p className={styles.subsectionTitle} id="deleteobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>DELETE /api/v1/allocations/&#8249;id&#8250;</p>

          <p className={styles.subsectionTitle} id="deleteobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl -X DELETE https://example.com/api/v1/allocations/&#8249;id&#8250;</p>

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
