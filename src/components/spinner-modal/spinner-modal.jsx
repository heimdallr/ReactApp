import "./spinner-modal.css";
import withModal from "../hoc-helpers/with-modal";
const SpinnerModal = () => {
  return (
    <div className="spinner-modal">
      <div className="loader"></div>
    </div>
  );
};

export default withModal(SpinnerModal);
