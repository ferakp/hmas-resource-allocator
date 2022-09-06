import React from 'react';
import styles from './Auth.module.css';

export class Auth extends React.Component {
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
        ['username', ['string'], 'The username of user.', true, ['view']],
        ['password', ['string'], 'The password of user.', true, ['view']],
        ['token', ['string'], 'The API token the REST API returns.', true, ['view']],
      ],

      // List objects
      // name, isSupportingSpecialControllers, description
      listObjectsArgumentsData: [
        ['username', false, 'The username of user.'],
        ['password', false, 'The password of user.'],
      ],

      // Create an object
      // name, isNecessaryParameter, description
      createObjectData: [['token', true, 'The previous API token.']],
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.title}>Auth</p>
          <div className={styles.tableContent}>
            <p>Topics</p>
            <ul className={styles.tableList}>
              <li>
                <a href="#object">Schema</a>
              </li>
              <li>
                <a href="#listobjects">Login</a>
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
                <a href="#createobject">Refresh a token</a>
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
            The schema defines all the fields that exist within an auth record. Any response from these endpoints can be expected to contain the fields. Each field has its own
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
            Login
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>
            Login to application using your username and password. Both username and password are sent to the REST API in bcrypted format. Do not send plain username and password!
          </p>

          <p className={styles.subsectionTitle} id="listobjectsdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>GET /api/v1/auth/login</p>

          <p className={styles.subsectionTitle} id="listobjectsexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl -H .... -X https://example.com/api/v1/auth/login</p>

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
            Refresh a token
          </p>
          <p className={`${styles.descriptionText} ${styles.noStyleDescription}`}>
            {' '}
            Refresh existing token. Each API token is valid till 24 hours. This endpoint supports <b>Bearer</b> authentication scheme.
          </p>

          <p className={styles.subsectionTitle} id="createobjectdefinition">
            Definition
          </p>
          <p className={styles.descriptionText}>GET /api/v1/auth/refreshtoken</p>

          <p className={styles.subsectionTitle} id="createobjectexamplerequests">
            Example Requests
          </p>
          <p className={styles.descriptionText}>curl -H .... -X https://example.com/api/v1/auth/refreshtoken</p>

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
