const { execSync } = require("child_process");
const path = require("path");

async function deploy(repoUrl, projectId) {
  try {
    console.log("================================");
    console.log("Starting Deployment");
    console.log("Project ID:", projectId);
    console.log("================================");

    const outputPath = path.resolve(__dirname, "../output");

    const uid = execSync("id -u").toString().trim();
    const gid = execSync("id -g").toString().trim();

    const command = `
      docker run --rm \
      --user ${uid}:${gid} \
      -v "${outputPath}:/output" \
      -e REPO_URL=${repoUrl} \
      -e PROJECT_ID=${projectId} \
      builder-image
    `;

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