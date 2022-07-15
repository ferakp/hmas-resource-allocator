import React from "react";
import styles from "./Algorithms.module.css";

export class Algorithms extends React.Component {
    state = {
    };
  
    constructor(props) {
      super(props);
      this.wrapperRef = React.createRef();
    }

    render() {
        return <div className={styles.container}>
            <p>Algorithms</p>
        </div>;
      }
}