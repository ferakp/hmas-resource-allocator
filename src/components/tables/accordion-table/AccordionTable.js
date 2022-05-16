import React from "react";
import styles from "./AccordionTable.module.css";
import { debounce } from "../../libs/utilities";

export class AccordionTable extends React.Component {
  state = { maxElementCount: 99, accordionOpen: false, accordionIndex: 0, accordionHeight: 0 };

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.updateLayoutDebounce = debounce(this.updateLayout, 500);
  }

  resize = () => {
    this.updateLayoutDebounce();
  };

  updateLayout = () => {
    let oldCount = this.state.maxElementCount;
    let newCount = Math.floor(this.wrapperRef.current.clientWidth / 155);
    if (newCount < 3) this.setState({ maxElementCount: 3 });
    if (newCount > this.props.object?.headers.length) newCount = this.props.object?.headers.length;
    this.setState({
        maxElementCount: newCount,
      });
  };

  componentDidMount() {
    window.addEventListener("resize", this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  switchAccordion = (index) => {
    this.setState({
      accordionOpen: !this.state.accordionOpen,
      accordionIndex: index,
      accordionHeight: 0
    });
    setTimeout(() => this.setState({accordionHeight: 150}), 0);
  };

  addSettings = () => {
    if (
      this.props.object?.headers &&
      !this.props.object.headers.includes("Settings")
    ) {
      this.props.object.headers.push("Settings");
      !this.props.object?.rows ||
        this.props.object.rows.forEach((element) => {
          element.push(["Open", "Close"]);
        });
    }
  };

  render() {
    this.addSettings();
    return (
      <div className={styles.container} ref={this.wrapperRef}>
        <table className={styles.table}>
          <thead>
            <tr>
              {this.props.object?.headers.map((header, index) => {
                if (
                  index + 2 > this.state.maxElementCount &&
                  index != this.props.object.headers.length - 1
                )
                  return;
                return <th key={"th" + index}>{header}</th>;
              })}
            </tr>
          </thead>

          <tbody>
            {this.props.object?.rows.map((row, indexR) => {
              return (
                <React.Fragment key={"rf" + indexR}>
                  <tr key={"tr" + indexR} className={`${indexR % 2 === 0 ? styles.dataRowEven : ""} ${styles.dataRows}`}>
                    {row.map((el, index) => {
                      if (
                        index + 2 > this.state.maxElementCount &&
                        index != this.props.object.headers.length - 1
                      )
                        return;
                      return index !== this.props.object.headers.length - 1 ? (
                        <td key={"td" + index}>{el}</td>
                      ) : this.state.accordionOpen &&
                        this.state.accordionIndex === indexR ? (
                        <td
                          key={"td" + index}
                          onClick={() => this.switchAccordion(indexR)}
                        >
                          {`${el[1]}`}&nbsp; &#x2191;
                        </td>
                      ) : (
                        <td
                          key={"td" + index}
                          onClick={() => this.switchAccordion(indexR)}
                        >
                          {`${el[0]}`}&nbsp; &#x2193;
                        </td>
                      );
                    })}
                  </tr>
                  <tr
                    key={"accordion" + indexR}
                    className={
                      this.state.accordionOpen &&
                      this.state.accordionIndex === indexR
                        ? styles.accordionOpen
                        : styles.accordionClose
                    }
                    style={{height: this.state.accordionHeight+"px"}}
                  >
                    <td
                      colSpan={
                        this.state.maxElementCount
                      }
                    >
                      <div className={styles.accordionContainer}>
                          <p>s</p>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
