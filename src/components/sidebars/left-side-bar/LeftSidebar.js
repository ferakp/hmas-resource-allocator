import React from "react";
import styles from "./LeftSidebar.module.css";
import image from "../../boxes/box/box.png";
import Icon from "@mdi/react";
import { mdiCog } from "@mdi/js";
import { mdiViewDashboardVariant } from "@mdi/js";
import { mdiRobotOutline } from "@mdi/js";
import { mdiCogOutline } from "@mdi/js";
import { mdiLogin } from "@mdi/js";
import { mdiHelpCircle } from "@mdi/js";
import { mdiAccountDetails } from '@mdi/js';

/**
 * Mode: default, loggedIn
 */

export class LeftSidebar extends React.Component {
  state = { mode: "default" };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  render() {
    return (
      <div
        className={styles.container}
        ref={this.wrapperRef}
        style={{ width: this.state.width + "px" }}
      >
        <div className={styles.innerContainer}>
          <div className={styles.logoContainer}>
            <div className={styles.iconContainer}>
              <Icon
                path={mdiCog}
                size={2}
                color="white"
                className={styles.icon}
              />
              <div className={styles.titleContainer}>
                <p className={styles.title}>RAS</p>
                <p className={styles.titleFullName}>
                  (Resource Allocation System)
                </p>
              </div>
              <Icon
                path={mdiCog}
                size={2}
                color="white"
                className={styles.icon}
              />
            </div>
          </div>
          <div className={styles.linkContainer}>
            <div className={styles.link}>
              <Icon
                path={mdiViewDashboardVariant}
                size={1}
                color="rgba(255, 255, 255, 0.548)"
                className={styles.linkIcon}
              />
              <p className={styles.linkName}>Dashboard</p>
            </div>
            <div className={styles.link}>
              <Icon
                path={mdiRobotOutline}
                size={1}
                color="rgba(255, 255, 255, 0.548)"
                className={styles.linkIcon}
              />
              <p className={styles.linkName}>Holons</p>
            </div>
            <div className={styles.link}>
              <Icon
                path={mdiHelpCircle}
                size={1}
                color="rgba(255, 255, 255, 0.548)"
                className={styles.linkIcon}
              />
              <p className={styles.linkName}>Help</p>
            </div>
            <div className={styles.link}>
              <Icon
                path={mdiCogOutline}
                size={1}
                color="rgba(255, 255, 255, 0.548)"
                className={styles.linkIcon}
              />
              <p className={styles.linkName}>Settings</p>
            </div>

            <div className={styles.footer}>
              <hr></hr>
              <div className={styles.link}>
                <Icon
                  rotate={this.state.mode === "loggedIn" ? 180 : 0}
                  path={mdiLogin}
                  size={1}
                  color="rgba(255, 255, 255, 0.548)"
                  className={styles.linkIcon}
                />
                <p className={styles.linkName}>Login</p>
              </div>
              <div className={styles.link}>
                <Icon
                  path={mdiAccountDetails}
                  size={1}
                  color="rgba(255, 255, 255, 0.548)"
                  className={styles.linkIcon}
                />
                <p className={styles.linkName}>Account</p>
              </div>
              <hr></hr>
              <div className={styles.versionInfoContainer}>
                <p>Version number</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
