import React from 'react';
import styles from './Account.module.css';
import { UsersEditor } from '../users/users-editor/UsersEditor';

export class Account extends React.Component {
  state = { mode: 'success', message: '' };

  constructor(props) {
    super(props);
  }

  pingStatus = (type) => {
    if (type === 'success') {
      this.setState({ mode: 'success', message: 'The changes have been saved' });
    } else if (type === 'fail') {
      this.setState({ mode: 'fail', message: 'Unable to save the changes' });
    }
    setTimeout(() => this.setState({ message: '' }), 2500);
  };

  render() {
    if (!this.props.state.auth.user) {
      setTimeout(() => this.props.navigate('/'), 50);
      return <div></div>;
    }
    
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <p>Account information</p>
        </div>

        <div className={styles.content}>
          <div className={`${styles.tabErrorContainer} ${this.state.displayError ? styles.displayError : ''}`}>
            <p className={styles.errorMessage}>{this.state.errorMessage}</p>
          </div>

          <p className={styles.descriptionText}>
            You've logged in as{' '}
            <u>
              <b>
                {this.props.state.auth.user?.firstname[0].toUpperCase() +
                  this.props.state.auth.user?.firstname.slice(1) +
                  ' ' +
                  this.props.state.auth.user?.lastname[0].toUpperCase() +
                  this.props.state.auth.user?.lastname.slice(1)}
              </b>
            </u>
          </p>

          <p className={`${styles.descriptionText} ${styles.borderLeft}`}>
            Decreasing <b>role</b> is allowed without any permission, but increasing role is prohibited in this version (1.0.0).
            <br />
            It's recommended that you do not change your role.
          </p>

          <UsersEditor {...this.props} isDraft={false} pingStatus={this.pingStatus} data={this.props.state.auth?.user} />
          {this.state.message ? <p className={`${styles.message} ${this.state.mode === 'success' ? styles.success : styles.fail}`}>{this.state.message}</p> : ''}
        </div>
      </div>
    );
  }
}
