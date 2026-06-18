const { Queue } = require("bullmq");

const deploymentQueue = new Queue(
  "deployment-queue",
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

module.exports = deploymentQueue;