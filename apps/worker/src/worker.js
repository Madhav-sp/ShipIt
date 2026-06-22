require("dotenv").config();

const { Worker } = require("bullmq");
const deploy = require("./deploy");
const path = require("path");
const uploadFolder = require("./uploader");
const prisma = require("./prisma");

async function appendLog(
  projectId,
  message
) {
  const deployment =
    await prisma.deployment.findUnique({
      where: {
        id: projectId,
      },
    });

  await prisma.deployment.update({
    where: {
      id: projectId,
    },
    data: {
      logs:
        (deployment.logs || "") +
        message +
        "\n",
    },
  });
}

console.log(
  "CloudFront:",
  process.env.CLOUDFRONT_URL
);

const worker = new Worker(
  "deployment-queue",

  async (job) => {
    const {
      repoUrl,
      projectId,
    } = job.data;

    try {
      console.log(
        "Starting Build:",
        projectId
      );

      await appendLog(
        projectId,
        "Starting Build"
      );

      await prisma.deployment.update({
        where: {
          id: projectId,
        },
        data: {
          status: "BUILDING",
        },
      });

      await appendLog(
        projectId,
        "Cloning Repository"
      );

      await deploy(
        repoUrl,
        projectId
      );

      console.log(
        "Build Finished:",
        projectId
      );

      await appendLog(
        projectId,
        "Build Complete"
      );

      const outputPath = path.join(
        __dirname,
        "../output",
        projectId
      );

      console.log(
        "Uploading To S3..."
      );

      await appendLog(
        projectId,
        "Uploading To S3"
      );

      await uploadFolder(
        outputPath,
        outputPath,
        projectId
      );

      console.log(
        "S3 Upload Complete"
      );

      await appendLog(
        projectId,
        "S3 Upload Complete"
      );

      const deploymentUrl =
        `${process.env.CLOUDFRONT_URL}/${projectId}/index.html`;

      console.log(
        "Deployment URL:",
        deploymentUrl
      );

      await appendLog(
        projectId,
        "Deployment Successful"
      );

      await prisma.deployment.update({
        where: {
          id: projectId,
        },
        data: {
          status: "SUCCESS",
          deploymentUrl,
        },
      });

      console.log(
        "Deployment Saved To DB"
      );

    } catch (err) {

      await appendLog(
        projectId,
        `FAILED: ${err.message}`
      );

      console.log(
        "Build Failed:",
        projectId
      );

      await prisma.deployment.update({
        where: {
          id: projectId,
        },
        data: {
          status: "FAILED",
        },
      });

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

console.log(
  "Worker Listening..."
);