import https from "https";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import express from "express";
import cors from "cors";

import { addJobService, removeJobService, updateJobService } from "./jobs.js";

// dotenv.config({ path: "./BullMQ/.env" });
dotenv.config();

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
const app = express();
const port = parseInt(process.env.PORT);

app.use(express.json());
app.use(
  cors({
    origin: `${process.env.BACKEND_URL}`,
    credentials: true,
  })
);

app.get("/", async (req, res) => {
  res.sendStatus(200);
});

app.post("/api/schedule", async (req, res) => {
  try {
    const { username, imageUrl, caption, timestamp } = req.body;
    await addJobService(username, imageUrl, caption, timestamp);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.send(500).json({ message: "BullMQ server error" });
  }
});

app.post("/api/scheduled/update", async (req, res) => {
  try {
    const { jobid, username, imageUrl, caption, timestamp } = req.body;
    await removeJobService(jobid);
    await updateJobService(jobid, username, imageUrl, caption, timestamp);
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

app.post("/api/scheduled/delete", async (req, res) => {
  try {
    const { jobid } = req.body;
    await removeJobService(jobid);
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
