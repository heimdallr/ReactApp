import Modal from "react-modal";
import { Component } from "react";

const withModal = (View) => {
  return class extends Component {
    render() {
      Modal.setAppElement("#root");
      return (
        <Modal
          isOpen={true}
          style={{
            overlay: {
              // display: "none",
              position: "fixed",
              // top: "4em",
              // left: 10,
              // right: 10,
              // bottom: 10,
              backgroundColor: "rgba(255, 255, 255, 0.01)",
            },
            content: {
              position: "absolute",
              top: "0px",
              left: "0px",
              right: "0px",
              bottom: "0px",
              // border: "3px solid #444",
              background: "rgba(215, 212, 208, 0.01)",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: "3px",
              outline: "none",
              padding: "3px",
            },
          }}
        >
          <div id="modal">
            <View {...this.props} />
          </div>
        </Modal>
      );
    }
  };
};

export default withModal;
