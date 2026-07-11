const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const deploymentQueue = require(
  "../../worker/src/queue"
);

const redis = require(
  "../../worker/src/redis"
);
require("dotenv").config();

const session = require("express-session");

const passport =require("./githubAuth");

const prisma = require("./prisma");

const requireAuth =require("./authMiddleware");
const { v4: uuidv4 } = require("uuid");
const s3 = require("./s3");
const { ListObjectsV2Command, DeleteObjectsCommand } = require("@aws-sdk/client-s3");

const app = express();

app.use(helmet());

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "deployr-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
);

const deployLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: "Too many deployment requests, please try again later." },
});

app.use(
  passport.initialize()
);

app.use(
  passport.session()
);

app.get("/", (req, res) => {
  res.json({
    message: "API Running"
  });
});

app.post("/deploy", requireAuth, deployLimiter, async (req, res) => {
  try {

    const { repoUrl } = req.body;

    if (!repoUrl || typeof repoUrl !== "string" || !repoUrl.trim().startsWith("https://github.com/")) {
      return res.status(400).json({
        success: false,
        message: "Valid GitHub repository URL required (must start with https://github.com/)"
      });
    }

    const projectId = uuidv4();

    await prisma.deployment.create({
  data: {
    id: projectId,
    repoUrl,
    status: "QUEUED",
    userId: req.user.id
  }
});

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

    const deployment =
  await prisma.deployment.findUnique({
    where: {
      id: projectId
    }
  });

if (!deployment) {
  return res.status(404).json({
    message:
      "Deployment not found"
  });
}

return res.json(
  deployment
);

  }
);


app.get(
  "/deployments",
  requireAuth,
  async (req, res) => {

    const deployments =
      await prisma.deployment.findMany({
        orderBy: {
          createdAt: "desc"
        }
      });

    res.json(
      deployments
    );

  }
);


app.get(
  "/deployment/:id",
  requireAuth,
  async (req, res) => {

    try {

      const deployment =
        await prisma.deployment.findUnique({
          where: {
            id: req.params.id
          }
        });


      if (!deployment) {
        return res
          .status(404)
          .json({
            message:
              "Deployment not found"
          });
      }
      if (
        deployment.userId &&
        deployment.userId !== req.user.id
      ) {
        return res
          .status(403)
          .json({
            message: "Forbidden"
          });
      }

      return res.json(
        deployment
      );

    } catch (err) {

      return res
        .status(500)
        .json({
          error:
            err.message
        });

    }
  }
);

app.get(
  "/auth/github",
  passport.authenticate(
    "github",
    { scope: ["user:email"] }
  )
);

app.get(
  "/auth/github/callback",

  passport.authenticate(
    "github",
    {
      failureRedirect:
        "/login",
    }
  ),

  (req, res) => {

    res.redirect(
      FRONTEND_URL
    );

  }
);

app.get(
  "/me",
  requireAuth,
  (req, res) => {

    if (!req.user) {
      return res
        .status(401)
        .json({
          message:
            "Not logged in",
        });
    }

    res.json(
      req.user
    );
  }
);

app.get(
  "/logout",
  (req, res) => {

    req.logout((err) => {

      if (err) {
        return res
          .status(500)
          .json({
            error: err.message
          });
      }

      req.session.destroy(() => {

        res.clearCookie(
          "connect.sid"
        );

        res.json({
          success: true
        });

      });

    });

  }
);

async function deleteS3Folder(projectId) {
  if (!process.env.S3_BUCKET_NAME) return;
  try {
    let isTruncated = true;
    let continuationToken = undefined;

    while (isTruncated) {
      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME,
        Prefix: `${projectId}/`,
        ContinuationToken: continuationToken,
      });

      const listedObjects = await s3.send(listCommand);

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        break;
      }

      const deleteCommand = new DeleteObjectsCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Delete: {
          Objects: listedObjects.Contents.map((obj) => ({ Key: obj.Key })),
          Quiet: true,
        },
      });

      await s3.send(deleteCommand);

      isTruncated = listedObjects.IsTruncated;
      continuationToken = listedObjects.NextContinuationToken;
    }
    console.log(`Successfully deleted S3 folder: ${projectId}/`);
  } catch (err) {
    console.error(`Error deleting S3 folder for ${projectId}:`, err.message);
  }
}

app.delete(
  ["/deployment/:projectId", "/deployment/:id"],
  requireAuth,
  async (req, res) => {
    try {
      const projectId = (req.params.projectId || req.params.id || "").trim();
      if (!projectId) {
        return res.status(400).json({ message: "Deployment ID required" });
      }

      const deployment = await prisma.deployment.findFirst({
        where: { id: projectId }
      });

      if (!deployment) {
        return res.status(404).json({
          message: "Deployment not found"
        });
      }

      if (deployment.userId && deployment.userId !== req.user.id) {
        return res.status(403).json({
          message: "Forbidden"
        });
      }

      await deleteS3Folder(deployment.id);

      await prisma.deployment.delete({
        where: { id: deployment.id }
      });

      return res.json({
        success: true
      });
    } catch (err) {
      return res.status(500).json({
        error: err.message
      });
    }
  }
);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(
    `API running on port ${PORT}`
  );
});