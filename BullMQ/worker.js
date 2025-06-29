import axios from "axios";
import https from "https";
import dotenv from "dotenv";

import { Queue } from "bullmq";
import { Worker } from "bullmq";

import { redisConfig } from "./config.js";
import { updateStatusDB } from "./postgres.js";

dotenv.config();

const queueName = "schedule";
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Allow self-signed certificates
  }),
});

export const queue = new Queue(queueName, { connection: redisConfig });

new Worker(
  queueName,
  async (job) => {
    const { username, imageUrl, caption } = job.data;
    try {
      await axiosInstance.post(`${process.env.BACKEND_URL}/api/insta/post`, {
        username: username,
        imageUrl: imageUrl,
        caption: caption,
      });
      console.log(`${job.id} : Job Done`);
      await updateStatusDB(true, job.id);
      return "yes";
    } catch (error) {
      console.error(error);
    }
  },
  { connection: redisConfig, autorun: true }
);
