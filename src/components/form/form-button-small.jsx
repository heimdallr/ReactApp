const FormButtonSmall = ({ name, color, disabled, onClick }) => {
  return (
    <button
      className={`btn btn-sm mr-1 ml-1 shadow btn-${
        !disabled ? color : "secondary"
      }`}
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default FormButtonSmall;
