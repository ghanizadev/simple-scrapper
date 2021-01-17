import { Queue, QueueScheduler, Worker, Job } from "bullmq";
import Redis from "ioredis";
import scrapper from "../services/scrapper";
import csvConvert from "../utils/toCSV";
import writeCSV from "../utils/writeCSV";

const connection = new Redis(Number(process.env.REDIS_PORT), process.env.REDIS_HOST);
const client = new Redis(Number(process.env.REDIS_PORT), process.env.REDIS_HOST);

const tasks = new Queue("Scrapper", { connection, client });
const scheduler = new QueueScheduler("Scrapper", { connection, client });

const processTask = async (job: Job) => {
  const startedAt  = Date.now();

  console.info("Process started...");
  const data = await scrapper.execute();

  console.info("Saving to CSV...");
  const csv = await csvConvert.toCSV(data);

  console.info("Writing in disk...");
  await writeCSV.to(job.name, csv);
  
  console.info("Done! %s milliseconds", Date.now() - startedAt);
};

const worker = new Worker("Scrapper", processTask, { client, connection });

worker.on("completed", (job) => {
  console.log(`${job.name} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job.name} has failed with ${err.message}`);
});

worker.on("progress", (job, err) => {
  console.log(`${job.name} has progressed`);
});

export default {
    async push(){
        await scheduler.waitUntilReady();
        await tasks.waitUntilReady();
        await worker.waitUntilReady();

        const filename = "scrapped_" + Date.now()+ ".csv";

        await tasks.add(filename, null);
        return filename;
    }
}