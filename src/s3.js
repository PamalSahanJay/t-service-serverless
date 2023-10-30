require('dotenv').config();
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const client = new S3Client({});
require('dotenv').config();
const BUCKET = process.env.BUCKET_NAME

const put = async (imageFile) => {
    try {
        const imageKey = `${Date.now()}.jpg`;
        const param = {
            Bucket: BUCKET,
            Key: imageKey,
            Body: imageFile,
            ContentType: 'image/jpeg'
        }

        const command = new PutObjectCommand(param);
        return await client.send(command);

    } catch (error) {
        throw error
    }
}

module.exports = {
    put
}