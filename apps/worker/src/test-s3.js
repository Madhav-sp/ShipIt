require("dotenv").config();

const {
  ListBucketsCommand
} = require("@aws-sdk/client-s3");

const s3 = require("./s3");

async function main() {

  const data =
    await s3.send(
      new ListBucketsCommand({})
    );

  console.log(data.Buckets);
}

main();