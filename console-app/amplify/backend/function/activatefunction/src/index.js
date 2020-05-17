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

exports.handler = async (event, context) => { //eslint-disable-line
  try {
    const driver = await getDriver(event.arguments.activationCode);
    if (!driver) {
      return "invalid code";
    }
    driver.carrier = getUsername(event, context);
    driver.associationSecret = null;
    console.log(`assigning ${driver.id} to ${driver.carrier}`);
    await updateDriver(driver);
    return "success";
  } catch (ex) {
    console.log(`error activating driver: ${ex}`)
    return "error";
  }
};

const getUsername = (event, context) => {
  return event.identity.username;
};

// https://aws-amplify.github.io/docs/cli-toolchain/quickstart#graphql-from-lambda
const getDriver = async (activationCode) => {
  const body = JSON.stringify({
    query: graphqlQuery,
    variables: {
      associationSecret: activationCode
    }
  });

  const data = await sendRequest(body);
  if (data.length === 0) {
    console.log(`no results found for ${activationCode}`);
    return null;
  }

  return data.data.driverByAssociationSecret.items[0];
};

const updateDriver = async (driver) => {
  const body = JSON.stringify({
    query: graphqlMutation,
    operationName: "updateDriver",
    variables: {
      input: driver
    }
  });

  const result = await sendRequest(body);
  console.log(result);
};

const sendRequest = async (body) => {
  const req = new AWS.HttpRequest(appsyncUrl, region);

  req.method = "POST";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = body;

  if (apiKey) {
    req.headers["x-api-key"] = apiKey;
  } else {
    const signer = new AWS.Signers.V4(req, "appsync", true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
  }

  return await new Promise((resolve, reject) => {
    const httpRequest = https.request({...req, host: endpoint}, (result) => {
      result.on('data', (data) => {
        resolve(JSON.parse(data.toString()));
      });
    });

    httpRequest.write(req.body);
    httpRequest.end();
  });
};