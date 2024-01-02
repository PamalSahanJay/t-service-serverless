require('dotenv').config();
const { PutObjectCommand, S3Client, DeleteObjectCommand, CopyObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const client = new S3Client({});
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

const del = async (bucket, key) => {
    try {
        let params = {
            Bucket: bucket,
            Key: key
        };

        const command = new DeleteObjectCommand(params);
        return await client.send(command)

    } catch (error) {
        throw error
    }
}

const copy = async (bucket, key) => {
    try {
        let params = {
            Bucket: process.env.DESTINATION_BUCKET,
            CopySource: encodeURI('/' + bucket + '/' + key),
            Key: key
        };

        const command = new CopyObjectCommand(params);
        return await client.send(command)

    } catch (error) {
        throw error
    }
}

const get = async (bucket, key) => {
    let params = {
        Bucket: bucket,
        Key: key,
    }

    const command = new GetObjectCommand(params);
    try {
        const response = await client.send(command);
        return await response.Body.transformToString();
    } catch (err) {
        console.error(err);
    }
}

const send = async (bucket, key, body) => {
    let params = {
        Bucket: bucket,
        Key: key,
        Body: body
    }
    const command = new PutObjectCommand(params)
    return await client.send(command)
}

module.exports = {
    put,
    del,
    copy,
    get,
    send
}