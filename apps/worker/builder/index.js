const simpleGit = require("simple-git");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

async function main() {
  try {
    // Get GitHub repository URL from Docker environment variable
    const repoUrl = process.env.REPO_URL;

    // Generate unique deployment/project id
    const projectId =process.env.PROJECT_ID;

    console.log("================================");
    console.log("Project ID:", projectId);
    console.log("Repo URL:", repoUrl);
    console.log("================================");

    // Validate repo url
    if (!repoUrl) {
      throw new Error("REPO_URL not provided");
    }

    // Folder inside container where repo will be cloned
    const projectPath = "/app/project";

    console.log("Cloning Repository...");

    // Clone GitHub repository
    await simpleGit().clone(
      repoUrl,
      projectPath
    );

    console.log("Repository Cloned Successfully");

    // Install dependencies
    console.log("Installing Dependencies...");

    execSync(
      "npm install --legacy-peer-deps",
      {
        cwd: projectPath,
        stdio: "inherit",
      }
    );

    console.log("Dependencies Installed");

    // Build project
    console.log("Building Project...");

    execSync(
      "npm run build",
      {
        cwd: projectPath,
        stdio: "inherit",
      }
    );

    console.log("Build Complete");

    // Build output folder
    const distPath = path.join(
      projectPath,
      "dist"
    );

    // Check if dist exists
    if (!fs.existsSync(distPath)) {
      throw new Error(
        "dist folder not found"
      );
    }

    console.log("Dist Folder Found");

    // Output folder shared with host machine
    const targetPath = path.join(
      "/output",
      projectId
    );

    // Create output directory
    fs.mkdirSync(
      targetPath,
      {
        recursive: true,
      }
    );

    console.log(
      "Copying Build Files..."
    );

    // Copy dist files to mounted volume
    fs.cpSync(
      distPath,
      targetPath,
      {
        recursive: true,
      }
    );

    // const pkgPath = path.join(projectPath, "package.json");
    // if (fs.existsSync(pkgPath)) {
    //   fs.copyFileSync(pkgPath, path.join(targetPath, "package.json"));
    // }

    console.log(
      "Build Files Copied Successfully"
    );

    console.log("================================");
    console.log(
      "DEPLOYMENT BUILD SUCCESS"
    );
    console.log("================================");

  } catch (err) {

    console.log("================================");
    console.log(
      "DEPLOYMENT BUILD FAILED"
    );
    console.log("================================");

    console.error(err.message);

    process.exit(1);
  }
}

main();