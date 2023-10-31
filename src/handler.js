'use strict';
const S3 = require('./s3')
const { statusCode } = require('./statusCode');


module.exports.upload = async (event) => {
  const imageFile = Buffer.from(event.body, 'base64');

  try {
    const response = await S3.put(imageFile);
    return statusCode(201, response)
  } catch (error) {
    return statusCode(500, error.message)
  }

};
