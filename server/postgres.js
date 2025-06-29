import pkg from "pg";
import bcrypt from "bcrypt";
import axios from "axios";
import https from "https";
import dotenv from "dotenv";

// dotenv.config({ path: "./server/.env" });
dotenv.config();

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "./helpers/jwt_helper.js";

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT),
});

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Allow self-signed certificates
  }),
});

async function existsUserEmail(username, email) {
  const existQuery = `SELECT * FROM users WHERE username = $1`;
  const existuser = await pool.query(existQuery, [username]);
  if (existuser.rows.length > 0) return "username";

  const existQueryem = `SELECT email FROM users WHERE email = $1`;
  const existuserem = await pool.query(existQueryem, [email]);
  if (existuserem.rows.length > 0) return "email";

  return false;
}

async function existsUser(username) {
  const existQuery = `SELECT * FROM users WHERE username = $1`;
  const existuser = await pool.query(existQuery, [username]);
  if (existuser.rows.length > 0) return existuser.rows[0].password;

  return false;
}

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: "Fields cannot be empty!" });

    const exists = await existsUserEmail(username, email);
    if (exists) {
      if (exists === "username")
        return res.status(409).json({ error: "User already exists!" });
      else return res.status(409).json({ error: "Email already in use!" });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT)
    );
    const insertUser = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`;
    const user = await pool.query(insertUser, [
      username,
      email,
      hashedPassword,
    ]);

    if (user) return res.status(200).json({ message: "User Inserted" });
    else return res.status(500).json({ message: "Server Error" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: "Fields cannot be empty!" });

    const exists = await existsUser(username);
    if (!exists) return res.status(400).json({ error: "User does not exist!" });

    const storedPassword = exists;
    const match = await bcrypt.compare(password, storedPassword);
    if (match) {
      const userAccessToken = signAccessToken({
        username: username,
      });
      const userRefreshToken = signRefreshToken({ username: username });
      res.cookie("POSTMINDER_ACCESS_TOKEN", userAccessToken);
      res.cookie("POSTMINDER_REFRESH_TOKEN", userRefreshToken, {
        httpOnly: true,
      });
      res.sendStatus(200);
    } else res.sendStatus(400);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("POSTMINDER_REFRESH_TOKEN", { httpOnly: true });
    res.clearCookie("POSTMINDER_ACCESS_TOKEN");
    res.sendStatus(200);
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const logoutFB = async (req, res) => {
  try {
    const refreshToken = req.cookies["POSTMINDER_REFRESH_TOKEN"];
    const username = verifyRefreshToken(refreshToken);

    const deleteFBTokenQuery = `DELETE FROM accounts WHERE username=$1`;
    await pool.query(deleteFBTokenQuery, [username]);
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const isLoginFB = async (req, res) => {
  try {
    const refreshToken = req.cookies["POSTMINDER_REFRESH_TOKEN"];
    const username = verifyRefreshToken(refreshToken);
    const fbAccessToken = await getToken(username);
    if (fbAccessToken) {
      res.sendStatus(200);
    } else {
      res.sendStatus(202);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const addToken = async (username, token) => {
  const addTokenQuery = `INSERT INTO accounts (username, access_token) VALUES ($1, $2)`;
  await pool.query(addTokenQuery, [username, token]);
};

export const getToken = async (username) => {
  try {
    const getTokenQuery = `SELECT access_token from accounts WHERE username=$1`;
    const token = await pool.query(getTokenQuery, [username]);
    if (token) return token.rows[0].access_token;
    else return null;
  } catch (err) {
    return null;
  }
};

export const getEmail = async (username) => {
  const getEmailQuery = `SELECT email from users WHERE username=$1`;
  const email = await pool.query(getEmailQuery, [username]);
  return email.rows[0].email;
};

export const getScheduledPosts = async (req, res) => {
  try {
    const refreshToken = req.cookies["POSTMINDER_REFRESH_TOKEN"];
    const username = verifyRefreshToken(refreshToken);
    if (username) {
      const getPostsQuery = `SELECT * from scheduled_posts WHERE username=$1 ORDER BY time`;
      const result = await pool.query(getPostsQuery, [username]);

      if (result.rows.length > 0) return res.send(result.rows);
    } else throw res.sendStatus(401);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const reSchedulePost = async (req, res) => {
  const refreshToken = req.cookies["POSTMINDER_REFRESH_TOKEN"];
  const username = verifyRefreshToken(refreshToken);
  const { jobid, imageurl, caption, time } = req.body;
  console.table({
    jobid,
    username,
    imageurl,
    caption,
    time,
  });

  const dateTime = new Date(time);
  const updatePostQuery = `update scheduled_posts SET caption = $1, time = $2 WHERE jobid = $3;`;
  await pool.query(updatePostQuery, [caption, dateTime, jobid]);

  await axiosInstance.post(`${process.env.BULLMQ_URL}/api/scheduled/update`, {
    jobid: jobid,
    username: username,
    imageUrl: imageurl,
    caption: caption,
    timestamp: time,
  });
  return res.sendStatus(200);
};

export const deleteSchedulePost = async (req, res) => {
  try {
    const refreshToken = req.cookies["POSTMINDER_REFRESH_TOKEN"];
    const username = verifyRefreshToken(refreshToken);
    if (username) {
      const { jobid } = req.body;
      const deletePostQuery = `DELETE FROM scheduled_posts WHERE jobid=$1;`;
      await pool.query(deletePostQuery, [jobid]);
      await axiosInstance.post(
        `${process.env.BULLMQ_URL}/api/scheduled/delete`,
        {
          jobid: jobid,
        }
      );
    } else throw res.sendStatus(401);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
