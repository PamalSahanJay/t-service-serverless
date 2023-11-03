const { statusCode } = require("./statusCode");
const { SFNClient, StartExecutionCommand } = require('@aws-sdk/client-sfn');
const client = new SFNClient();
const MACHINE = process.env.STATE_MACHINE_ARN


module.exports.triggerStepFunc = async (event) => {

    let filesProcessed = event.Records.map( async (record) => {
        let params = {
            stateMachineArn: MACHINE,
            input: JSON.stringify(record)
        }
        
        const command = new StartExecutionCommand(params)
        return await client.send(command)
    });

    await Promise.all(filesProcessed);

};
