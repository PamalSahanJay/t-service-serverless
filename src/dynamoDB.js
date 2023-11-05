const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const DBClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(DBClient);

const put = async (object) => {
    try {
        let params = {
            TableName: process.env.TABLE_NAME,
            Item: {
                imageName: object.imageName,
                images: object.images,
            }
        }
        const command = new PutCommand(params);
        return await docClient.send(command);

    } catch (error) {
        throw error
    }
}

module.exports = {
    put
}