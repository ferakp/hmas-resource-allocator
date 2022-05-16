import React from "react";
import styles from "./Tasks.module.css";

export class Tasks extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  render() {
    return <div className={styles.container}>
        <p>Tasks</p>
    </div>;
  }
}
