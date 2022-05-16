import React from "react";
import styles from "./Analytics.module.css";

export class Analytics extends React.Component {
    state = {
    };
  
    constructor(props) {
      super(props);
      this.wrapperRef = React.createRef();
    }

    render() {
        return <div className={styles.container}>
            <p>Analytics</p>
        </div>;
      }
}