require("dotenv").config();
console.log("========== AWS CONFIG ==========");
console.log("Bucket:", process.env.S3_BUCKET_NAME);
console.log("Region:", process.env.AWS_REGION);
console.log("CloudFront:", process.env.CLOUDFRONT_URL);
console.log("Access Key Exists:", !!process.env.AWS_ACCESS_KEY_ID);
console.log("Secret Exists:", !!process.env.AWS_SECRET_ACCESS_KEY);
console.log("================================");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const {
  PutObjectCommand
} = require("@aws-sdk/client-s3");

const s3 = require("./s3");

async function uploadFolder(
  rootDir,
  currentDir,
  projectId
) {

  const files =
    fs.readdirSync(currentDir);

  for (const file of files) {

    const filePath =
      path.join(
        currentDir,
        file
      );

    const stat =
      fs.statSync(filePath);

    if (stat.isDirectory()) {

      await uploadFolder(
        rootDir,
        filePath,
        projectId
      );

    } else {

      const relativePath =
        path.relative(
          rootDir,
          filePath
        );

      const s3Key =
        `${projectId}/${relativePath}`
          .replace(/\\/g, "/");

      console.log(
        "Uploading:",
        s3Key
      );

      const contentType =
  mime.lookup(filePath) ||
  "application/octet-stream";

await s3.send(
  new PutObjectCommand({
    Bucket:
      process.env.S3_BUCKET_NAME,

    Key: s3Key,

    Body:
      fs.createReadStream(
        filePath
      ),

    ContentType:
      contentType
  })
);
    }
  }
}

module.exports = uploadFolder;