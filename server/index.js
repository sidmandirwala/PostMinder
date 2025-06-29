import https from "https";
import fs from "fs";
import path from "path";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import pkg from "pg";
const { Pool } = pkg;
import { Server } from "socket.io";

// dotenv.config({ path: "./server/.env" });
dotenv.config();

import { upload } from "./multer.js";
import {
  login,
  signup,
  logout,
  logoutFB,
  isLoginFB,
  getScheduledPosts,
  reSchedulePost,
  deleteSchedulePost,
} from "./postgres.js";
import {
  shareInstagramPost,
  longLivedToken,
  schedulePost,
} from "./facebook_insta.js";
import { validateRefreshAndAccessToken } from "./helpers/jwt_helper.js";

const app = express();
const port = parseInt(process.env.PORT);
const options = {
  key: fs.readFileSync(
    path
      .join(
        path.dirname(new URL(import.meta.url).pathname),
        "/certificates/cert.key"
      )
      .replace("\\", "")
  ),
  cert: fs.readFileSync(
    path
      .join(
        path.dirname(new URL(import.meta.url).pathname),
        "/certificates/cert.crt"
      )
      .replace("\\", "")
  ),
};
const server = https.createServer(options, app);

const allowedOrigins = [process.env.FRONTEND_URL, process.env.BULLMQ_URL];

app.use(cookieParser());
app.use(express.json());
app.use(express.static("./server/uploads"));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", async (req, res) => {
  res.sendStatus(200);
});

// API Calls
app.post("/api/login", login);
app.post("/api/signup", signup);
app.get("/api/logout", logout);

app.post("/api/fb/login", longLivedToken);
app.get("/api/fb/logout", logoutFB);
app.get("/api/fb/isLogin", isLoginFB);

app.post("/api/insta/schedule", upload.single("image"), schedulePost);
app.post("/api/insta/post", shareInstagramPost);
app.get("/api/insta/scheduled", getScheduledPosts);
app.post("/api/insta/scheduled/update", reSchedulePost);
app.post("/api/insta/scheduled/delete", deleteSchedulePost);

app.get("/api/validate-token", validateRefreshAndAccessToken);

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT),
});

async function waitForDatabase() {
  while (true) {
    try {
      await pool.connect();
      console.log("Connected to the database");
      break;
    } catch (error) {
      console.log("Database connection failed, retrying...");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
    }
  }
}

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, process.env.BULLMQ_URL],
    methods: ["GET", "POST"],
  },
});

waitForDatabase().then(() => {
  pool.connect((err, client) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return;
    }
    client.query("LISTEN scheduled_posts_change");
    console.log("Subscribed to notification channel");
    io.on("connection", (socket) => {
      client.on("notification", (notification) => {
        if (notification.payload) {
          let payload = JSON.parse(notification.payload);
          socket.emit("scheduled_posts_changes", payload);
        } else socket.emit("scheduled_posts_changes", {});
      });
    });
  });
});

server.listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
