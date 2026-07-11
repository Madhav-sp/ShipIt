const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});


const fs = require("fs");
const { Worker } = require("bullmq");
const deploy = require("./deploy");
const path = require("path");
const uploadFolder = require("./uploader");
const prisma = require("./prisma");
const detectFramework = require("./framework");

async function appendLog(projectId, message) {

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

      const outputPath = path.join(
        __dirname,
        "../output",
        projectId
      );

      const framework =
        detectFramework(outputPath);

      console.log(
        "Detected Framework:",
        framework
      );

      await appendLog(
        projectId,
        `Framework: ${framework}`
      );

      console.log(
        "Build Finished:",
        projectId
      );

      await appendLog(
        projectId,
        "Build Complete"
      );

      console.log(
        "Uploading To S3..."
      );

      await appendLog(
        projectId,
        "Uploading To S3"
      );

      const copiedPkgPath = path.join(outputPath, "package.json");
      if (fs.existsSync(copiedPkgPath)) {
        fs.unlinkSync(copiedPkgPath);
      }

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
          framework,
        },
      });

      console.log(
        "Deployment Saved To DB"
      );

      if (fs.existsSync(outputPath)) {
        fs.rmSync(outputPath, { recursive: true, force: true });
        console.log("Cleanup: Removed temporary build folder:", outputPath);
      }

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

      const failedOutputPath = path.join(__dirname, "../output", projectId);
      if (fs.existsSync(failedOutputPath)) {
        fs.rmSync(failedOutputPath, { recursive: true, force: true });
        console.log("Cleanup: Removed temporary build folder on failure:", failedOutputPath);
      }

      console.error(err);

      throw err;

    }

  },

  {
    connection: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  }
);

console.log(
  "Worker Listening..."
);