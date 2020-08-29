var AWS = require('aws-sdk');
var uuid = require('uuid');
var faker = require('faker');

AWS.config.update({region:'eu-central-1'});

async function add() {
    let dynamodb = new AWS.DynamoDB();
    for (let step = 0; step < 500; step++) {
        await dynamodb.putItem({
            TableName: "",
            Item: {
                "id": {
                    "S": uuid.v4()
                },
                "name": {
                    "S": faker.name.lastName()
                },
                "__typename": {
                    "S": "Contract"
                },
                "updatedAt": {
                    "S": "2020-05-18T19:34:20.723Z"
                },
                "arrivalDate": {
                    "S": "2019-12-12"
                },

                "owner": {
                    "S": "theowner"
                },
                "createdAt": {
                    "S": "2020-05-18T19:34:20.723Z"
                }
            }
        }).promise();
    }
}
add().then(function() {
    console.log("done");
}).catch(function(e) {
    console.log("error: " + e);
})