import { insertPostIntoDB, updatePostIntoDB } from "./postgres.js";
import { addJob, removeJob } from "./producer.js";

export const addJobService = async (username, imageUrl, caption, timestamp) => {
  const inputDateTime = new Date(timestamp);
  const currentDateTime = new Date();
  const delay = inputDateTime - currentDateTime - 13000;
  console.table({ username, imageUrl, caption, timestamp, delay });
  const job = await addJob(username, imageUrl, caption, delay);
  insertPostIntoDB(job.id, username, imageUrl, caption, timestamp);
};

export const updateJobService = async (
  jobid,
  username,
  imageUrl,
  caption,
  timestamp
) => {
  const inputDateTime = new Date(timestamp);
  const currentDateTime = new Date();
  const delay = inputDateTime - currentDateTime - 13000;
  console.table({ username, imageUrl, caption, timestamp, delay });
  const job = await addJob(username, imageUrl, caption, delay);
  updatePostIntoDB(jobid, job.id);
};

export const removeJobService = async (jobid) => {
  const job = await removeJob(jobid);
};
