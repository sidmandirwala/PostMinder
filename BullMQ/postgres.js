import dotenv from "dotenv";
import pkg from "pg";

// dotenv.config({ path: "./BullMQ/.env" });
dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT),
});

export const insertPostIntoDB = async (
  jobid,
  username,
  imageUrl,
  caption,
  timestamp
) => {
  try {
    const dateTime = new Date(timestamp);
    const insertPost = `INSERT INTO scheduled_posts VALUES ($1, $2, $3, $4, $5)`;
    const result = await pool.query(insertPost, [
      jobid,
      username,
      imageUrl,
      caption,
      dateTime,
    ]);
  } catch (error) {
    console.error(error);
  }
};

export const updatePostIntoDB = async (oldJobid, newJobId) => {
  try {
    const updateJobQuery = `update scheduled_posts SET jobid = $1 WHERE jobid = $2;`;
    const result = await pool.query(updateJobQuery, [newJobId, oldJobid]);
  } catch (error) {
    console.error(error);
  }
};

export const updateStatusDB = async (newValue, jobid) => {
  try {
    const updateJobQuery = `update scheduled_posts SET is_posted = $1 WHERE jobid = $2;`;
    const result = await pool.query(updateJobQuery, [newValue, jobid]);
  } catch (error) {
    console.error(error);
  }
};
