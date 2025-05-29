import TextareaAutosize from "react-textarea-autosize";

const FormCell = ({
  field,
  onLabelChange,
  onClick,
  value,
  formSelectData,
  needMoreRecords,
  fieldControl,
  disabled,
}) => {
  const textFieldLength = value && value.length > 15 ? value.length : 15;
  const textStyle = { width: `${textFieldLength + 2}ch`, maxWidth: window.innerWidth * 0.9 }; //Авторазмер поля
  const numberFieldLength = value && value.length > 5 ? value.length : 5;
  const numberStyle = { width: `${numberFieldLength + 6}ch`, maxWidth: window.innerWidth * 0.9 }; //Авторазмер поля
  const requiredField = fieldControl &&
    fieldControl.filter((item) => item === field.FieldName || item === field.FieldName + "ID").length !== 0 && (
      <span className="text-danger">{value ? "" : " *"}</span>
    ); // Обязательное поле

  const highliteBlockedCell =
    field.FieldDescription.includes("@") || field.FieldDescription === "ID" ? "alert-warning" : "";

  switch (field.FieldType) {
    case "text":
      return (
        <>
          {field.FieldRow && <hr />}
          <span key={field.ID} className="form-group p-0 m-1" onPointerDownCapture={(e) => e.stopPropagation()}>
            <label className="col-form-label col-auto pt-0 mt-1" htmlFor={field.FieldName}>
              {field.FieldDescription.replace("@", "")}
              {requiredField}
            </label>
            <input
              key={field.ID}
              type="text"
              className={`form-control-sm mt-1 p-1 col-auto shadow text-left ${highliteBlockedCell}`}
              name={field.FieldName}
              onChange={onLabelChange}
              value={value ? value.replaceAll("&#34;", '"') : ""}
              disabled={field.FieldDescription.includes("@")}
              style={textStyle}
            />
          </span>
        </>
      );

    case "textArea":
      return (
        <>
          {field.FieldRow && <hr />}
          <span
            key={field.ID}
            className={`form-group d-flex justify-content-left p-0 m-1`}
            onPointerDownCapture={(e) => e.stopPropagation()}
          >
            <label className="col-form-label pt-0 mt-1" htmlFor={field.FieldName}>
              {field.FieldDescription.replace("@", "")}
              {requiredField}
            </label>

            <TextareaAutosize
              key={field.ID}
              className={`form-control-sm ml-3 p-0 shadow text-center ${highliteBlockedCell}`}
              name={field.FieldName}
              onChange={onLabelChange}
              value={value || ""}
              style={{ width: "50em" }}
              disabled={field.FieldDescription.includes("@")}
            />
          </span>
        </>
      );

    case "date":
      return (
        <>
          {field.FieldRow && <hr />}
          <span key={field.ID} className="form-group p-0 m-1" onPointerDownCapture={(e) => e.stopPropagation()}>
            <label className="col-form-label col-auto pt-0 mt-1" htmlFor={field.FieldName}>
              {field.FieldDescription}
              {requiredField}
            </label>
            <input
              key={field.ID}
              type="date"
              className="form-control-sm col-auto mr-auto shadow"
              name={field.FieldName}
              onChange={onLabelChange}
              value={value ? value.slice(0, 10) : ""}
            />
          </span>
        </>
      );

    case "yesNo":
      const checked = value === "1" || value === 1 ? true : false;
      return (
        <>
          {field.FieldRow && <hr />}
          <span key={field.ID} className="form-group m-1 p-0" onPointerDownCapture={(e) => e.stopPropagation()}>
            <label className="col-form-label col-auto pt-0 mt-1" htmlFor={field.FieldName}>
              {field.FieldDescription}
              {requiredField}
            </label>
            <input
              key={field.ID}
              type="checkbox"
              className="form-control-sm col-auto mr-auto shadow"
              name={field.FieldName}
              onChange={onClick}
              value={value || ""}
              checked={checked}
            />
          </span>
        </>
      );

    case "number":
      return (
        <>
          {field.FieldRow && <hr />}
          <span key={field.ID} className="form-group p-0 m-1" onPointerDownCapture={(e) => e.stopPropagation()}>
            <label className="col-form-label col-auto pt-0 mt-1" htmlFor={field.FieldName}>
              {field.FieldDescription.replace("@", "")}
              {requiredField}
            </label>
            <input
              key={field.ID}
              type="number"
              className={`form-control-sm mt-1 p-1 shadow text-center ${highliteBlockedCell}`}
              name={field.FieldName}
              onChange={onLabelChange}
              value={value || ""}
              disabled={field.FieldDescription.includes("@") || field.FieldDescription === "ID"}
              style={numberStyle}
            />
          </span>
        </>
      );

    case "select":
      const selectOptions = formSelectData[field.FieldName].map((item) => {
        return (
          <option key={item.ID} value={item.ID}>
            {item[field.FieldNameExt].substr(0, 100)} ✺{item.ID}
          </option>
        );
      });

      const addRecordsButton = needMoreRecords && (
        <span
          onClick={needMoreRecords}
          className="btn btn-sm mt-1 btn-outline-secondary secondary mr-auto ml-1 m-1 shadow"
          onPointerDownCapture={(e) => e.stopPropagation()}
        >
          🛠
        </span>
      );
      return (
        <>
          {field.FieldRow && <hr />}
          <span key={field.ID} className="form-group p-0 m-1" onPointerDownCapture={(e) => e.stopPropagation()}>
            <label className="col-form-label col-auto pt-0 mt-1" htmlFor={field.FieldName}>
              {field.FieldDescription}
              {requiredField}
            </label>

            <select
              value={value === null ? "" : value}
              className="form-control-sm col-auto shadow"
              name={`${field.FieldName}ID`}
              key={field.ID}
              onChange={onLabelChange}
              style={{
                minHeight: "5px",
                borderRadius: "10px",
              }}
              disabled={disabled}
            >
              <option key={0} value={""}>
                Выбрать
              </option>
              {selectOptions}
            </select>
            {addRecordsButton}
          </span>
        </>
      );

    case "hide":
      return <></>;

    default:
      return <p>{field.FieldType} Для этого типа поля нет данных</p>;
  }
};

FormCell.defaultProps = {
  value: "",
  disabled: false,
};

export default FormCell;
