const FormButton = ({ name, color, disabled, onClick }) => {
  return (
    <button
      className={`btn shadow pt-0 pb-1 btn-${!disabled ? color : "secondary"}`}
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default FormButton;
