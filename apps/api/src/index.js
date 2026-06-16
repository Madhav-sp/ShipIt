const express = require("express");
const cors = require("cors");

const deploy = require(
  "../../worker/src/deploy"
);

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

    const projectId =
      await deploy(repoUrl);

    return res.json({
      success: true,
      projectId
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

app.listen(3000, () => {
  console.log(
    "API running on port 3000"
  );
});