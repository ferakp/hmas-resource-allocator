import React from "react";
import styles from "./Resources.module.css";

export class Resources extends React.Component {
    state = {
    };
  
    constructor(props) {
      super(props);
      this.wrapperRef = React.createRef();
    }

    render() {
        return <div className={styles.container}>
            <p>Resources</p>
        </div>;
      }
}