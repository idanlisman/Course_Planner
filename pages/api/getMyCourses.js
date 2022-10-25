import dbConnection from "../../components/db/dbConnection";

const connection = dbConnection();
const query = `SELECT * FROM ${process.env.MY_COURSES_TABLE}`;

async function handler(req, res) {
  try {
    const data = await connection.query(query);
    await connection.end();
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ err });
  }
}

export default handler;
