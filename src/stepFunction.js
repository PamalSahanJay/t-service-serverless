const S3 = require('./s3')
const Db = require('./dynamoDB')

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
  await S3.copy(event.s3.bucket.name, event.s3.object.key)
  return {
    region: 'us-east-1',
    bucket: process.env.DESTINATION_BUCKET,
    key: event.s3.object.key
  }
};

module.exports.resizeImage = async (event) => {
  const bucket = event.s3.bucket.name
  const key = event.s3.object.key

  const jpgBuffer = await S3.get(bucket, key)
  const pngBuffer = await imagemagick.convert({
    srcData: jpgBuffer,
    format: 'png'
  });

  const pngKey = key.replace('.jpg', '.png');

  const body = pngBuffer.toString('base64');

  await S3.send(bucket, key, body)

  return {
    region: 'us-east-1',
    bucket: process.env.BUCKET_NAME,
    key: pngKey
  }

};

module.exports.deleteFile = async (event) => {
  await S3.del(event.s3.bucket.name, event.s3.object.key)
  return {
    status: "Deleted from source bucket",
    sourceBucket: event.s3.bucket.name,
    destinationBucket: process.env.DESTINATION_BUCKET
  }
};

module.exports.writeToDynamoDB = async (event) => {
  Item = {
    imageName: event.results.images[0].original.key,
    images: event.results.images,
  }
  const done = await Db.put(Item);
  return {
    status: "Item saved successfully",
    details: done
  }
};