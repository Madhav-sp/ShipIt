const express = require("express");
const cors = require("cors");

const deploymentQueue = require(
  "../../worker/src/queue"
);

const redis = require(
  "../../worker/src/redis"
);

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Running"
  });
});

app.post("/deploy", async (req, res) => {
  try {

    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({
        success: false,
        message: "Repo URL required"
      });
    }

    const projectId = uuidv4();

    await redis.set(
      `status:${projectId}`,
      "QUEUED"
    );

    await deploymentQueue.add(
      "deploy",
      {
        repoUrl,
        projectId
      }
    );

    return res.json({
      success: true,
      projectId,
      status: "QUEUED"
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

app.get(
  "/status/:projectId",
  async (req, res) => {

    const { projectId } =
      req.params;

    const status =
      await redis.get(
        `status:${projectId}`
      );

    if (!status) {
      return res.status(404).json({
        message:
          "Deployment not found"
      });
    }

    return res.json({
      projectId,
      status
    });

  }
);

app.listen(3000, () => {
  console.log(
    "API running on port 3000"
  );
});