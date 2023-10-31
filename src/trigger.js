const { statusCode } = require("./statusCode");
const { SFNClient, StartExecutionCommand } = require('@aws-sdk/client-sfn');
const client = new SFNClient();


module.exports.triggerStepFunc = async (event) => {

    let filesProcessed = event.Records.map( async (record) => {
        let params = {
            stateMachineArn: "arn:aws:states:us-east-1:583774065306:stateMachine:ImageProcessorPJ",
            input: JSON.stringify(record)
        }
        
        const command = new StartExecutionCommand(params)
        return await client.send(command)
    });

    await Promise.all(filesProcessed);

};
