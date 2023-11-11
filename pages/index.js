import Head from "next/head";
import { uuidGenerator } from '../components/utils';
import { useState } from "react";
import MainDiv from "../components/layouts/mainDiv";
import MyCoursesTable from "../components/tables/myCoursesTable";
import InsertCourse from "../components/userInputArea/insertCourse";
import styles from "../styles/Home.module.css";
import ConclusionTable from "../components/tables/conclusionTable";

function Home({ myCoursesData }) {
  const clearInputs = {
    ID: "",
    Number: "",
    Semester: "",
    Year: ""
  };
  const [inputsValue, setInputsValue] = useState(clearInputs);
  const [emptyInput, setEmptyInput] = useState([]);

  // useState(myCoursesData)
  const [tableData, setTableData] = useState([]);
  const [lastAddedCourse, setLastAddedCourse] = useState(null);

  function getInputsValue(name, value) {
    setInputsValue({ ...inputsValue, [name]: value });
    setEmptyInput([]);
  }

  function onButtonClickHandler() {
    const nullValues = Object.keys(inputsValue).filter(
      (val) => inputsValue[val] === ""
    );
    if (nullValues.length === 0) {
      inputsValue.UUID = uuidGenerator(inputsValue);
      setTableData([...tableData, inputsValue]);
      setLastAddedCourse(inputsValue);
      setInputsValue(clearInputs);
    } else {
      setEmptyInput(nullValues);
    }
  }

  function reserLastAddedCourse() {
    setLastAddedCourse(null);
  }

  function updateIndexTableData(newData) {
    setTableData(newData);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Course Planner App</title>
        <meta name="description" content="Course planner app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <MainDiv>
          <InsertCourse
            getInputsValue={getInputsValue}
            inputsValue={inputsValue}
            emptyInput={emptyInput}
            onButtonClickHandler={onButtonClickHandler}
          />
        </MainDiv>
        <MainDiv>
          <MyCoursesTable
            tableData={tableData}
            lastAddedCourse={lastAddedCourse}
            resetLastAddedCourse={reserLastAddedCourse}
            updateIndexTableData={updateIndexTableData}
          />
        </MainDiv>
        <MainDiv>
            <ConclusionTable tableData={tableData}/>
        </MainDiv>
      </main>

      <footer className={styles.footer}>
        <p>Created by Idan Lisman</p>
      </footer>
    </div>
  );
}

// export async function getStaticProps() {
//   const res = await fetch(`${process.env.APP_HOST}/api/getMyCourses`);
//   if (res.status === 200) {
//     let { data } = await res.json();
    
//     return {
//       props: {
//         myCoursesData: data[0],
//       },
//     };
//   } else {
//     const { err } = await res.json();
//     throw err;
//   }
// }

export default Home;
