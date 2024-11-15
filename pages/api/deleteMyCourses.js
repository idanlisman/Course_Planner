import dbConnection from "../../components/db/dbConnection";

const whereExpression = "UUID=?";

async function handler(req, res) {
  let baseQuery = `DELETE FROM ${process.env.MY_COURSES_TABLE} WHERE `;
  let paramsList = [];

  const { deleteCourses } = req.body;
  deleteCourses.forEach((course) => {
    baseQuery += whereExpression + " OR ";
    paramsList.push(course.UUID);
  });
  baseQuery = baseQuery.slice(0, -4);

  try {
    const connection = await dbConnection();
    await connection.query(baseQuery, paramsList);
    await connection.end();
    return res.status(201).json();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err });
  }
}

export default handler;
