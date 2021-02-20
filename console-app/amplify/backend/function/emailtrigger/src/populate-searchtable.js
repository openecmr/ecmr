const update = require('./lib');
const AWS = require('aws-sdk');

const region = 'eu-central-1';
AWS.config.update({
    region: region
});

const dynamodb = new AWS.DynamoDB();

console.log(process.argv);

if (process.argv.length !== 4) {
    console.error("usage: scripts.js contract-table search-table");
    process.exit(1);
}
const contractsTable = process.argv[2];
const searchTable = process.argv[3];

async function populate() {
    let lastKey;
    do {
        const results = await dynamodb.scan({
            TableName: contractsTable
        }).promise();
        for (const item of results.Items) {
            const contract = AWS.DynamoDB.Converter.unmarshall(item);
            if (contract.__typename !== "Contract") {
                continue;
            }
            try {
                await update.addSearchRecords(dynamodb, contract, searchTable);
            } catch(ex) {
                console.error('cannot process item:', item, ex);
                throw ex
            }
        }
        lastKey = results.LastEvaluatedKey;
    } while (lastKey);
}

populate().finally(() => console.log("done"));