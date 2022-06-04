import React from "react";
import styles from "./Account.module.css";

export class Account extends React.Component {
  state = {};

  constructor(props) {
    super(props);
  }

  render() {
    return <div className={styles.container}></div>;
  }
}
