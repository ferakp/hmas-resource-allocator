import React from "react";
import styles from "./Settings.module.css";

export class Settings extends React.Component {
  state = {};

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  render() {
    if (!this.props.state.auth.user) setTimeout(() => this.props.navigate('/'), 200);
    return <div className={styles.container}></div>;
  }
}
