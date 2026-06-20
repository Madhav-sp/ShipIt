const path = require("path");

const uploadFolder =
  require("./uploader");

async function main() {

  const projectId =
    "test-project";

  const folderPath =
    path.join(
      __dirname,
      "../output/cf3e0d89-83e1-471b-bb27-5e366d75c53f"
    );

  await uploadFolder(
    folderPath,
    folderPath,
    projectId
  );

  console.log(
    "Upload Complete"
  );
}

main();