import { queue } from "./worker.js";

const queueName = "schedule";

export const addJob = async (username, imageUrl, caption, delay) => {
  console.log("job added");
  return await queue.add(queueName, { username, imageUrl, caption }, { delay });
};

export const removeJob = async (jobid) => {
  const job = await queue.getJob(jobid);

  if (job) {
    await job.remove();
    console.log("Old Job deleted");
  } else {
    console.log("job non existant");
  }
};
