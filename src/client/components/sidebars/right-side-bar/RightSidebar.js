import React from "react";
import styles from "./RightSidebar.module.css";

export class RightSidebar extends React.Component {
  posX = 0;
  state = { width: 250 };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  resize = () => {
    this.setState({ width: 250 });
  };

  onDragMouseDown = (event) => {
    this.posX = event.clientX;
    document.onmousemove = this.dragElement;
    document.onmouseup = this.stopDragElement;
    event.preventDefault();
  };

  dragElement = (event) => {
    event = event || window.event;
    event.preventDefault();
    let posXDiff = this.posX - event.clientX;
    this.posX = event.clientX;
    this.setState({ width: this.state.width + posXDiff });
  };

  stopDragElement = (event) => {
    document.onmouseup = null;
    document.onmousemove = null;
  };

  componentDidMount() {
    window.addEventListener("resize", this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  render() {
    return (
      <div
        className={styles.container}
        ref={this.wrapperRef}
        style={{ width: this.state.width + "px" }}
      >
        <div className={styles.draggerContainer}>
          <p
            className={styles.dragger}
            onMouseDown={(event) => this.onDragMouseDown(event)}
          >
            ||
          </p>
        </div>
        <div className={styles.innerContainer}></div>
      </div>
    );
  }
}
