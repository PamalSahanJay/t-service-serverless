const { S3Client, CopyObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const client = new S3Client({});

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const DBClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(DBClient);

module.exports.getFileType = async (event) => {
  let fileName = event.s3.object.key;
  let index = fileName.lastIndexOf('.');

  if (index > 0) {
    return fileName.substring(index + 1);
  }
  else {
    return null;
  }
};

module.exports.copyFile = async (event) => {
  let params = {
    Bucket: process.env.DESTINATION_BUCKET,
    CopySource: encodeURI('/' + event.s3.bucket.name + '/' + event.s3.object.key),
    Key: event.s3.object.key
  };

  const command = new CopyObjectCommand(params);
  await client.send(command)

  return {
    region: 'us-east-1',
    bucket: process.env.DESTINATION_BUCKET,
    key: event.s3.object.key
  }
};

module.exports.resizeImage = async (event) => {
  return null
};

module.exports.deleteFile = async (event) => {
  let params = {
    Bucket: event.s3.bucket.name,
    Key: event.s3.object.key
  };

  const command = new DeleteObjectCommand(params);
  await client.send(command)

  return {
    status: "Deleted from source bucket",
    sourceBucket: event.s3.bucket.name,
    destinationBucket: process.env.DESTINATION_BUCKET
  }
};

module.exports.writeToDynamoDB = async (event) => {
  let params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      imageName: event.results.images[0].original.key,
      images: event.results.images,
    }
  }
  const command = new PutCommand(params);
  const done = await docClient.send(command);
  return {
    status: "Item saved successfully",
    details: done
  }
};