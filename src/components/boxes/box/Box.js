import React from "react";
import styles from "./Box.module.css";
import image from "./box.png";

export class Box extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <img src={image} />
          <div className={styles.textContainer}>
            <p>{this.props.object?.name}</p>
          </div>
        </div>
        <hr className={styles.hr}></hr>
        <div className={styles.body}></div>
      </div>
    );
  }
}
