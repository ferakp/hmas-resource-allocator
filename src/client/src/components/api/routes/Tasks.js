import React from 'react';
import styles from './Tasks.module.css';

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
        ['id', ['number'], 'The unique identifier for the tasks.', true, ['view']],
        ['type', ['string'], 'The type of task.', false, ['view', 'edit', 'embed']],
        ['name', ['string'], "The task's name.", false, ['view', 'edit', 'embed']],
        ['description', ['string'], 'The description for the task.', false, ['view', 'edit', 'embed']],
        ['estimated_time', ['number'], 'The amount of hours the task need to be completed.', false, ['view', 'edit', 'embed']],
        [
          'knowledge_tags',
          ['string (JSON)'],
          'The knowledge/topics the task is related to. This field has inner field "tags" which is a type of array.',
          false,
          ['view', 'edit', 'embed'],
        ],
        ['resource_demand', ['string (JSON)'], "The resources the task demand. This field has inner field 'demands' which is a type of array.", false, ['view', 'edit', 'embed']],
        ['priority', ['number'], 'Priority. Min: 0 (N/A) and Max: 5 (highest). ', false, ['view', 'edit', 'embed']],
        ['created_on', ['string'], 'The exact time the task was created.', true, ['view']],
        ['created_by', ['string'], 'The ID of the user who created the task.', true, ['view']],
        ['start_date', ['string'], 'The time when the task should start.', false, ['view', 'edit', 'embed']],
        ['due_date', ['string'], 'The time when the task should be ready.', false, ['view', 'edit', 'embed']],
        [
          'assigned_to',
          ['string (JSON)'],
          'The IDs of the users the task is assigned to. This field has inner field "ids" which is a type of array.',
          false,
          ['view', 'edit', 'embed'],
        ],
        ['updated_on', ['string (JS Date)'], 'The latest time the task was updated.', true, ['view']],
        ['completed_on', ['string (JS Date)'], 'The latest time the task was completed.', true, ['view']],
        ['is_completed', ['boolean'], 'Is task completed.', false, ['view', 'edit', 'embed']],
      ],

      // List objects
      // name, isSupportingSpecialControllers, description
      listObjectsArgumentsData: [
        ['id', false, 'Limit results to those matching the given ID.'],
        ['type', false, 'Limit results to those matching the given type.'],
        ['name', false, 'Limit results to those matching the given name.'],
        ['estimated_time', false, 'Limit results to those matching the given estimated time.'],
        ['priority', true, 'Limit results to those matching the priority.'],
        ['created_on', true, 'Limit results to those matching the given creation time.'],
        ['created_by', false, 'Limit results to those matching the given creator.'],
        ['start_date', true, 'Limit results to those matching the given start time.'],
        ['due_date', true, 'Limit results to those matching the due time.'],
        ['assigned_to', false, 'Limit results to those matching the given assigned user IDs.'],
        ['updated_on', true, 'Limit results to those matching the update time.'],
        ['completed_on', true, 'Limit results to those matching the completion time.'],
        ['is_completed', false, 'Limit results to those matching the completed tasks.'],
      ],

      // Create an object
      // name, isNecessaryParameter, description
      createObjectData: [
        ['type', false, 'The type of task.'],
        ['name', true, 'The name of task.'],
        ['description', true, 'The description of task.'],
        ['estimated_time', false, 'The estimated completion time of the task in hours.'],
        ['knowledge_tags', false, 'The knowledge/topics the task is related to.'],
        ['resource_demand', false, 'The resources the task demand. '],
        ['priority', false, 'Priority.'],
        ['start_date', false, 'The time when the task should start.'],
        ['due_date', false, 'The time when the task should be ready.'],
        ['assigned_to', false, 'The IDs of the users the task is assigned to.'],
      ],

      // Retrieve an object
      // name, description
      retrieveObjectData: [['id', 'Unique identifier for the task.']],

      // Update an object
      // name, description
      updateObjectData: [
        ['id', 'Unique identifier for the task.'],
        ['type', 'The type of task.'],
        ['name', 'The name of task.'],
        ['description', 'The description of task.'],
        ['estimated_time', 'The estimated completion time of the task in hours.'],
        ['knowledge_tags', 'The knowledge/topics the task is related to.'],
        ['resource_demand', 'The resources the task demand. '],
        ['priority', 'Priority.'],
        ['start_date', 'The time when the task should start.'],
        ['due_date', 'The time when the task should be ready.'],
        ['assigned_to', 'The IDs of the users the task is assigned to.'],
        ['is_completed', 'Is task completed.'],
      ],

      // Delete an object
      // name, description
      deleteObjectData: [['id', 'Unique identifier for the task.']],
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.title}>Tasks</p>
          <div className={styles.tableContent}>
            <p>Topics</p>
            <ul className={styles.tableList}>
              <li>
                <a href="#object">Schema</a>
              </li>
              <li>
                <a href="#listobjects">List tasks</a>
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
                <a href="#createobject">Create a task</a>
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
                <a href="#retrieveobject">Retrieve a task</a>
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
                <a href="#updateobject">Update a task</a>
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
                <a href="#deleteobject">Delete a task</a>
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
            The schema defines all the fields that exist within a task record. Any response from these endpoints can be expected to contain the fields. Each field has its own
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
            List tasks
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>
            Query this endpoint to retrieve a collection of tasks. The response you receive can be controlled and filtered using the URL query parameters below. Parameters with
            the asterisk (*) character support .e (equal), .elt (equal or less than), .egt (equal or greater than), .gt (greater than) and .lt (less than) suffix controllers.
            <br /> For example GET <u>api/v1/tasks?updated_on.egt="2022-09-04T12:17:17.551Z"</u> would return all tasks that have been updated on 4th July 2022 (12 AM) or after
            the given time.
          </p>

          <p className={styles.subsectionTitle} id="listobjectsdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>GET /api/v1/tasks</p>

          <p className={styles.subsectionTitle} id="listobjectsexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl https://example.com/api/v1/tasks</p>

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
            Create a task
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>
            Use this endpoint to create a task. The parameters with the asterisk (*) character are necessary ones that are needed in creation of a task.
          </p>

          <p className={styles.subsectionTitle} id="createobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>POST /api/v1/tasks</p>

          <p className={styles.subsectionTitle} id="createobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl -H ..... -X POST https://example.com/api/v1/tasks</p>

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
            Retrieve a task
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>Use this endpoint to retrieve a specific task.</p>

          <p className={styles.subsectionTitle} id="retrieveobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>GET /api/v1/tasks/&#8249;id&#8250;</p>

          <p className={styles.subsectionTitle} id="retrieveobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl https://example.com/api/v1/tasks/&#8249;id&#8250;</p>

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
            Update a task
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>Use this endpoint to update a specific task.</p>

          <p className={styles.subsectionTitle} id="updateobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>PATCH /api/v1/tasks/&#8249;id&#8250;</p>

          <p className={styles.subsectionTitle} id="updateobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl -H .... -X PATCH https://example.com/api/v1/tasks/&#8249;id&#8250;</p>

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
            Delete a task
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>Use this endpoint to delete a specific task.</p>

          <p className={styles.subsectionTitle} id="deleteobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>DELETE /api/v1/tasks/&#8249;id&#8250;</p>

          <p className={styles.subsectionTitle} id="deleteobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl -X DELETE https://example.com/api/v1/tasks/&#8249;id&#8250;</p>

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
