import { useEffect, useState } from "react";
import { uuidGenerator, numberOfYears, numberOfSemesters } from '.././utils';
import Button from "../layouts/Button";
import Style from "./tablesStyle.module.css";
import { v4 as uuid } from "uuid";

function MyCoursesTable(props) {
  const [tableData, setTableData] = useState([]);
  const [coursesToUpdate, setCoursesToUpdate] = useState([]);
  const [temporaryChanges, setTemporaryChanges] = useState([]);

  useEffect(() => {
    const uuidLastAddedCourse = props.lastAddedCourse ? props.lastAddedCourse.UUID : null;
    uuidLastAddedCourse && addNewCourseToTemporaryChanges(uuidLastAddedCourse);
    getMyCoursesTable(numberOfYears, numberOfSemesters);
  }, [props.tableData]);

  function getSwapedCoursesObject(courseData, courseIndex) {
    let obj = {
      ID: courseData[courseIndex === 0 ? 0 : 1][0],
      Number: parseInt(courseData[courseIndex === 0 ? 0 : 1][1]),
      Semester: parseInt(courseData[courseIndex === 0 ? 1 : 0][2]),
      Year: parseInt(courseData[courseIndex === 0 ? 1 : 0][3]),
    }
    obj.UUID = uuidGenerator(obj);
    setTemporaryChanges(temporaryChanges => [...temporaryChanges, obj.UUID]);
    return obj;
  }

  function deleteCourseAndGetUpdatedTable(coursesTable, course) {
    const courseIndexInMainTable = coursesTable.findIndex(object => {
      return object.UUID === course.UUID;
    });
    coursesTable.splice(courseIndexInMainTable, 1);
    return coursesTable;
  }

  function onSwapCoursesClickHandler() {
    const currentCoursesTable = [...props.tableData];
    let newRawTableData;
    newRawTableData = deleteCourseAndGetUpdatedTable(currentCoursesTable, coursesToUpdate[0]);
    newRawTableData = deleteCourseAndGetUpdatedTable(newRawTableData, coursesToUpdate[1]);

    const plainDataCoursesArray = coursesToUpdate.map((obj) => obj.UUID.split('-'));
    const courseA = getSwapedCoursesObject(plainDataCoursesArray, 0);
    const courseB = getSwapedCoursesObject(plainDataCoursesArray, 1);
    newRawTableData.push(courseA);
    newRawTableData.push(courseB);

    setCoursesToUpdate([]);
    props.updateIndexTableData(newRawTableData);
  }

  function onDeletelClickHandler() {
    const currentCoursesTable = [...props.tableData];
    const newRawTableData = deleteCourseAndGetUpdatedTable(currentCoursesTable, coursesToUpdate[0])
    setTemporaryChanges(temporaryChanges => [...temporaryChanges, coursesToUpdate[0].UUID]);
    resetSelectedCourseStatus();
    setCoursesToUpdate([]);
    props.updateIndexTableData(newRawTableData);
  }

  function onCancelClickHandler() {
    resetSelectedCourseStatus();
    setCoursesToUpdate([]);
  }

  function onCourseClickHandler(event) {
    let UUID = event.target.id;
    let courseData = UUID.split("-");
    courseData = {
      ID: courseData[0],
      Number: parseInt(courseData[1]),
      Semester: parseInt(courseData[2]),
      Year: parseInt(courseData[3]),
      UUID,
      isClicked: true,
    };

    if (coursesToUpdate.length === 0) {
      setCoursesToUpdate([courseData]);
    } else if (coursesToUpdate.length === 1) {
      if (JSON.stringify(coursesToUpdate[0]) === JSON.stringify(courseData)) {
        setCoursesToUpdate([]);
        return resetSelectedCourseStatus();
      } else {
        setCoursesToUpdate(coursesToUpdate => [...coursesToUpdate, courseData]);
      }
    } else {
      resetSelectedCourseStatus();
      setCoursesToUpdate([courseData]);
    }

    setCourseIsSelected(courseData);
  }

  async function onCancelAllClickHandler() {
    const res = await fetch("./api/getMyCourses");
    if (res.status === 200) {
      let { data } = await res.json();
      props.updateIndexTableData(data);
      setCoursesToUpdate([]);
      setTemporaryChanges([]);
    } else {
      let { err } = await res.json();
      alert(`An Error Occured : ${err}`);
    }
  }

  async function onSaveAllClickHandler() {
    let dataToSave;
    const resGet = await fetch("./api/getMyCourses");
    if (resGet.status === 200) {
      const { data } = await resGet.json();
      dataToSave = getDataToSave(data);
    }
    Promise.all(dataToSave)
      .then(() => {
        resetSelectedCourseStatus();
        setCoursesToUpdate([]);
        setTemporaryChanges([]);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function compareAndGetChanges(firstArray, secondArray) {
    let compareCourses;
    let dataToUpdate = [];

    firstArray.forEach((firstCourse) => {
      compareCourses = secondArray.some(
        (secondCourse) =>
          secondCourse.UUID === firstCourse.UUID
      );
      if (!compareCourses) {
        dataToUpdate.push(firstCourse);
      }
    });
    return dataToUpdate; // returns all items exist in array #1 and not-exist in array #2
  }

  function getDataToSave(outDatedData) {
    const newData = props.tableData;
    const deleteCourses = compareAndGetChanges(outDatedData, newData)[0];
    const addCourses = compareAndGetChanges(newData, outDatedData);
    let promises = [];

    if (deleteCourses.length > 0) {
      promises.push(
        fetch("./api/deleteMyCourses", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ deleteCourses }),
        })
      );
    }

    if (addCourses.length > 0) {
      promises.push(
        fetch("./api/insertMyCourses", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ addCourses }),
        })
      );
    }
    return promises;
  }

  function setCourseIsSelected(courseData) {
    props.tableData.forEach((course) => {
      if (course.UUID == courseData.UUID) {
        course.isClicked = true;
      }
    });
  }

  function resetSelectedCourseStatus() {
    props.tableData.forEach((course) => {
      course.isClicked = false;
    });
  }

  function getCourseCellStyle(courseData) {
    if (!!courseData.isClicked) {
      return 'table__courses_list_clicked';
    }
  }

  function courseStyle(uuid) {
    if (temporaryChanges.includes(uuid)) {
      return 'table__courses_list_temp_change';
    }
  }

  function addNewCourseToTemporaryChanges(uuid) {
    setTemporaryChanges(temporaryChanges => [...temporaryChanges, uuid]);
    props.resetLastAddedCourse();
  }

  function getMyCoursesTable(yearsNum, semestersNum) {
    let years = [];
    let semesters = [];
    for (let y = 1; y <= yearsNum; y++) {
      for (let s = 1; s <= semestersNum; s++) {
        semesters.push({
          semesterName: `${s === 3 ? "summer" : s}`,
          courses: props.tableData.filter(
            (row) => row.Year === y && row.Semester === s
          ),
        });
      }
      years.push({ yearName: `${y}`, semesters });
      semesters = [];
    }
    setTableData(years);
  }

  return (
    <div className={Style.table__container}>
      <div className={Style.table__container}>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              {tableData.map((year) => (
                <th key={uuid()} className={Style.table__yearTitle} colSpan={numberOfSemesters}>
                  {year.yearName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Semester</th>
              {tableData.map((year) =>
                year.semesters.map((semester) => (
                  <th key={uuid()} className={Style.table__semesterTitle}>
                    {semester.semesterName}
                  </th>
                ))
              )}
            </tr>
            <tr>
              <th>Courses</th>
              {tableData.map((year) =>
                year.semesters.map((semester) => (
                  <td key={uuid()}>
                    <ul key={uuid()}>
                      {semester.courses.map((course) => (
                        <li
                          key={uuid()}
                          id={course.UUID}
                          onClick={onCourseClickHandler}
                          className={`${Style.table__courses_list} ${Style[getCourseCellStyle(course)]} ${Style[courseStyle(course.UUID)]}`}
                        >{`${course.ID} ${course.Number}`}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))
              )}
            </tr>
          </tbody>
        </table>
      </div>
      {coursesToUpdate.length === 2 && (
        <div className={Style.table__bottom_buttons_container}>
          <Button
            style="my_table__apply_changes_bottun"
            value="Swap !"
            onClick={onSwapCoursesClickHandler}
          />
          <Button
            style="my_table__cancel_changes_bottun"
            value="Cancel"
            onClick={onCancelClickHandler}
          />
        </div>
      )}
      {coursesToUpdate.length === 1 && (
        <div className={Style.table__bottom_buttons_container}>
          <Button
            style="my_table__cancel_changes_bottun"
            value="Delete"
            onClick={onDeletelClickHandler}
          />
          <Button
            style="my_table__cancel_changes_bottun"
            value="Cancel"
            onClick={onCancelClickHandler}
          />
        </div>
      )}
      {temporaryChanges.length > 0 && <div className={Style.table__bottom_buttons_container}>
        <Button
          style="my_table__save_all_changes_bottun"
          value="Save All Changes"
          onClick={onSaveAllClickHandler}
        />
        <Button
          style="my_table__cancel_all_changes_bottun"
          value="Cancel All Changes"
          onClick={onCancelAllClickHandler}
        />
      </div>}
    </div>
  );
}

export default MyCoursesTable;
