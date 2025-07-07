import "./notifycation.css";
import React, { Component } from "react";

class Notifycation extends Component {
  componentDidMount() {
    this.setState(this.props);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      this.setState({ ...this.props });
    }
  }

  state = {
    message: "",
    color: "",
  };
  render() {
    const { message, color } = this.state;
    if (!message) return null;
    return (
      <div className="notification">
        <div className={`btn w-100 btn-sm btn-${color} m-0 pt-0 pb-0`}>
          <strong>{message}</strong>
        </div>
      </div>
    );
  }
}

export default Notifycation;

Notifycation.defaultProps = {
  message: "No message",
  color: "success",
};
