import { withErrorBoundary } from "../hoc-helpers";
import "./form-header.css";

// eslint-disable-next-line react-refresh/only-export-components
const FormHeader = ({ name, onClose }) => {
  const closeButton = onClose ? (
    <span className=" m-0 pl-3 hover-zoom" onClick={onClose}>
      ❌
    </span>
  ) : null;
  return (
    <div className="form-header shadow d-flex">
      <h6 className="mr-auto p-0 m-0">{name}</h6>
      {closeButton}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default withErrorBoundary(FormHeader);
