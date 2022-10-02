import React from "react";
import styles from "./BasicNavbar.module.css";

export class BasicNavbar extends React.Component {
  state = { minimized: false };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  resize = () => {
    this.setState({ minimized: false });
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ minimized: false });
    }
  };

  componentDidMount() {
    window.addEventListener("resize", this.resize);
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  trigramClicked = () => {
    this.setState({ minimized: !this.state.minimized });
  };

  render() {
    return (
      <div
        className={`${styles.upperContainer} ${
          this.state.minimized ? styles.mobileMode : ""
        }`}
        ref={this.wrapperRef}
      >
        <div className={`${styles.container}`}>
          <div className={styles.mobileModeContainer}>
            <a className={`${styles.link} ${styles.menuName}`} href="#">
              {this.props.navbarObject?.menuName}
            </a>
            <p className={styles.trigram} onClick={() => this.trigramClicked()}>
              &#9776;
            </p>
          </div>
          <div className={`${styles.header}`}>
            {this.props.navbarObject.links &&
              Object.entries(this.props.navbarObject.links).map(
                (link, index) => {
                  return (
                    <a
                      className={styles.link}
                      href={link[1].href}
                      key={"header" + index}
                    >
                      {link[1].name}
                    </a>
                  );
                }
              )}
          </div>
        </div>
        <div>
          <div className={`${styles.mobileModeLinks}`}>
            {[<hr className={styles.headerLine} key="headerLine"></hr>].concat([
              this.props.navbarObject.links &&
                Object.entries(this.props.navbarObject.links).map(
                  (link, index) => {
                    return (
                      <a
                        className={styles.link}
                        href={link[1].href}
                        key={"mml" + index}
                      >
                        {link[1].name}
                      </a>
                    );
                  }
                ),
            ])}
          </div>
        </div>
      </div>
    );
  }
}
