import { Fragment } from "react";
import { numberOfYears, numberOfSemesters } from "../utils.js";
import Button from "../layouts/Button";
import InputField from "../layouts/InputField";

const InsertCourse = (props) => {
  return (
    <Fragment>
      <InputField
        saveToMainStorage={props.getInputsValue}
        name="ID"
        value={props.inputsValue.ID}
        label="Course ID"
        type="text"
        nullValue={props.emptyInput}
        maxTextLength="4"
      />
      <InputField
        saveToMainStorage={props.getInputsValue}
        name="Number"
        value={props.inputsValue.Number}
        label="Course Number"
        type="number"
        nullValue={props.emptyInput}
        minNumber="100"
        maxNumber="500"
      />
      <InputField
        saveToMainStorage={props.getInputsValue}
        name="Semester"
        value={props.inputsValue.Semester}
        label="Semester"
        type="number"
        nullValue={props.emptyInput}
        minNumber="1"
        maxNumber={numberOfSemesters}
      />
      <InputField
        saveToMainStorage={props.getInputsValue}
        name="Year"
        value={props.inputsValue.Year}
        label="Year"
        type="number"
        nullValue={props.emptyInput}
        minNumber="1"
        maxNumber={numberOfYears}
      />
      <Button onClick={props.onButtonClickHandler} value="Add" />
    </Fragment>
  );
};

export default InsertCourse;
