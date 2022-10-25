import dbConnection from "../../components/db/dbConnection";

const connection = dbConnection();
const whereExpression = "(?, ?, ?, ?, ?)";

async function handler(req, res) {
  let baseQuery = `INSERT INTO ${process.env.MY_COURSES_TABLE} (ID, Number, Semester, Year, UUID) VALUES`;
  let paramsList = [];

  const { addCourses } = req.body;
  addCourses.forEach((course) => {
    baseQuery += whereExpression + ",";
    for (const key in course) {
      if (key != "isClicked" && key != "status") {
        paramsList.push(course[key]);
      }
    }
  });
  baseQuery = baseQuery.slice(0, -1);

  try {
    await connection.query(baseQuery, paramsList);
    await connection.end();
    return res.status(201).json();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }
}

export default handler;
