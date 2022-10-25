import Style from "./layoutsStyle.module.css";

function InputField(props) {

  function getInputValue(event) {
    let inputValue = event.target.value;
    const inputName = event.target.name;
    if (props.type === "number") {
      inputValue = convertNumbers(inputValue);
    } else if (props.type === "text") {
      inputValue = inputValue.toUpperCase();
    }
    props.saveToMainStorage(inputName, inputValue);
  }

  function convertNumbers(value) {
    let intValue;
    if (value != "") {
      intValue = parseInt(value);
    } else {
      return value
    }
    if (intValue > props.maxNumber) {
      return parseInt(props.maxNumber)
    } else {
      return intValue
    }
  }

  const isValueNull = props.nullValue.includes(props.name) ? true : false;

  return (
    <div className={Style.inputField__container}>
      <label className={Style.inputField__label}>
        {props.label}
        <input
          className={`${Style.inputField__field} ${isValueNull && Style.inputField__field_null}`}
          value={props.value}
          name={props.name}
          type={props.type}
          max={props.maxNumber}
          min={props.minNumber}
          maxLength={props.maxTextLength}
          onChange={getInputValue}
        />
      </label>
    </div>
  );
}

export default InputField;
