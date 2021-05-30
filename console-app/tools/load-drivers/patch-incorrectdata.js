const AWS = require('aws-sdk');

AWS.config.update({region:'eu-central-1'});

let dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = "Contract";
(async function() {
    let lastEvaluatedKey = null;
    let total = 0;
    do {
        const items = await dynamodb.scan({
            TableName: TABLE_NAME,
            FilterExpression: 'attribute_exists(orderOwner) AND attribute_not_exists(orderStatus)',
            ExclusiveStartKey: lastEvaluatedKey
        }).promise();

        total += items.Count

        for (let item of items.Items) {
            const newVar = await dynamodb.update({
                TableName: TABLE_NAME,
                UpdateExpression: "REMOVE orderOwner, orderCarrier",
                Key: {
                    "id": item.id
                }
            }).promise();
            console.log(newVar);
        }

        lastEvaluatedKey = items.LastEvaluatedKey
    } while (lastEvaluatedKey);

    console.log("total", total);
})();