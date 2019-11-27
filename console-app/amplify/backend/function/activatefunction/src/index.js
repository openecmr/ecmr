/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiOpenecmrGraphQLAPIIdOutput = process.env.API_OPENECMR_GRAPHQLAPIIDOUTPUT
var apiOpenecmrGraphQLAPIEndpointOutput = process.env.API_OPENECMR_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */

const https = require('https');
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_OPENECMR_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const graphqlQuery = require('./query.js').listDrivers;
const graphqlMutation = require('./query.js').mutation;
const apiKey = process.env.API_KEY;


exports.handler = function (event, context) { //eslint-disable-line
  const req = new AWS.HttpRequest(appsyncUrl, region);
  const driver = getDriver(event.arguments.activationCode);
  driver.carrier = getUsername(event, context);
  console.log(`assigning ${driver.id} to ${driver.carrier}`);
  updateDriver(driver);
  return {
    statusCode: 200,
    body: "ok"
  };
};

const getUsername = (event, context) => {
  return event.identity.claims['cognito:username'];
};

// https://aws-amplify.github.io/docs/cli-toolchain/quickstart#graphql-from-lambda
const getDriver = async (activationCode) => {
  const req = new AWS.HttpRequest(appsyncUrl, region);

  req.method = "POST";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = JSON.stringify({
    query: graphqlQuery,
    variables: {
      filter: {
        associationSecret: {
          eq: activationCode
        }
      }
    }
  });

  if (apiKey) {
    req.headers["x-api-key"] = apiKey;
  } else {
    const signer = new AWS.Signers.V4(req, "appsync", true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
  }

  const data = await new Promise((resolve, reject) => {
    const httpRequest = https.request({...req, host: endpoint}, (result) => {
      result.on('data', (data) => {
        resolve(JSON.parse(data.toString()));
      });
    });

    httpRequest.write(req.body);
    httpRequest.end();
  });

  console.log(data);

  return data.data.listDrivers.items[0];
};

const updateDriver = (driver) => {
  const req = new AWS.HttpRequest(appsyncUrl, region);
  req.method = "POST";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = JSON.stringify({
    query: graphqlQuery,
    operationName: "updateDriver",
    variables: driver
  });

  if (apiKey) {
    req.headers["x-api-key"] = apiKey;
  } else {
    const signer = new AWS.Signers.V4(req, "appsync", true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
  }
};