const express = require("express");
const cors = require("cors");

const deploymentQueue = require(
  "../../worker/src/queue"
);

const redis = require(
  "../../worker/src/redis"
);
require("dotenv").config();

// const session = require("express-session");

// const passport =require("./githubAuth");

const prisma = require("./prisma");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());
// app.use(
//   session({
//     secret: "shipit-secret",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(
//   passport.initialize()
// );

// app.use(
//   passport.session()
// );

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

    await prisma.deployment.create({
  data: {
    id: projectId,
    repoUrl,
    status: "QUEUED"
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

// app.get(
//   "/auth/github",
//   passport.authenticate(
//     "github",
//     { scope: ["user:email"] }
//   )
// );

// app.get(
//   "/auth/github/callback",

//   passport.authenticate(
//     "github",
//     {
//       failureRedirect:
//         "/login",
//     }
//   ),

//   (req, res) => {

//     res.redirect(
//       "http://localhost:5173"
//     );

//   }
// );

// app.get(
//   "/me",
//   (req, res) => {

//     if (!req.user) {
//       return res
//         .status(401)
//         .json({
//           message:
//             "Not logged in",
//         });
//     }

//     res.json(
//       req.user
//     );
//   }
// );

app.listen(3000, () => {
  console.log(
    "API running on port 3000"
  );
});