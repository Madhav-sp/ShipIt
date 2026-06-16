const { execSync } = require("child_process");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function deploy(repoUrl) {
  try {
    const projectId = uuidv4();

    console.log("================================");
    console.log("Starting Deployment");
    console.log("Project ID:", projectId);
    console.log("================================");

    const outputPath = path.resolve(
      __dirname,
      "../output"
    );

    const command = `docker run -v "${outputPath}:/output" -e REPO_URL=${repoUrl} -e PROJECT_ID=${projectId} builder-image`;

    execSync(command, {
      stdio: "inherit",
    });

    console.log("Deployment Complete");

    return projectId;

  } catch (err) {
    console.error("Deployment Failed");

    throw err;
  }
}

module.exports = deploy;