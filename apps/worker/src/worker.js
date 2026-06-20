const { Worker } = require("bullmq");
const deploy = require("./deploy");
const redis = require("./redis");
const path = require("path");
const uploadFolder = require("./uploader");

const worker = new Worker(
  "deployment-queue",

  async (job) => {

    const {
      repoUrl,
      projectId
    } = job.data;

    try {

      console.log(
        "Starting Build:",
        projectId
      );

      await redis.set(
        `status:${projectId}`,
        "BUILDING"
      );

      await deploy(
  repoUrl,
  projectId
);

console.log(
  "Build Finished:",
  projectId
);

const outputPath =
  path.join(
    __dirname,
    "../output",
    projectId
  );

console.log(
  "Uploading To S3..."
);

await uploadFolder(
  outputPath,
  outputPath,
  projectId
);

console.log(
  "S3 Upload Complete"
);

await redis.set(
  `status:${projectId}`,
  "SUCCESS"
);

    } catch (err) {

      console.log(
        "Build Failed:",
        projectId
      );

      await redis.set(
        `status:${projectId}`,
        "FAILED"
      );

      console.error(err);

      throw err;
    }
  },

  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

console.log("Worker Listening...");