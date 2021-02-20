/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiOpenecmrGraphQLAPIIdOutput = process.env.API_OPENECMR_GRAPHQLAPIIDOUTPUT
var apiOpenecmrGraphQLAPIEndpointOutput = process.env.API_OPENECMR_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk'),
    handlebars = require('handlebars'),
    fs = require('fs'),
    path = require('path'),
    {addSearchRecords, deleteSearchRecords} = require("./lib"),
    https = require('https'),
    urlParse = require("url").URL,
    nodemailer = require('nodemailer'),
    apiKey = process.env.API_KEY,
    appsyncUrl = process.env.API_OPENECMR_GRAPHQLAPIENDPOINTOUTPUT,
    apiOpenEcmrGraphqlEndpoint = new urlParse(appsyncUrl).hostname.toString(),
    searchTable = "Search" + "-" + process.env.API_OPENECMR_GRAPHQLAPIIDOUTPUT + "-" + process.env.ENV;

const region = 'eu-central-1';
AWS.config.update({
  region: region
});

const ses = new AWS.SES();
const dynamodb = new AWS.DynamoDB();

exports.handler = async function(event, context) {
  try {
    //eslint-disable-line
    if (!event.Records) {
      event = JSON.parse(event);
    }
    for (const record of event.Records) {
      await processEmail(record);
      await processSearch(record);
    }
    context.done(null, 'Successfully processed DynamoDB record');
  } catch (ex) {
    console.log(ex);
    context.fail(ex);
  }
};

const processEmail = async (record) => {
  if (record.eventName !== 'MODIFY') {
    return;
  }

  const oldImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage);
  if (oldImage.__typename !== "Contract") {
    return;
  }
  const newImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);

  let allowedSendingResult = await allowedSending(newImage.owner);
  if (!allowedSendingResult) {
    console.log('owner %s not allowed to send', newImage.owner);
    return;
  }

  const addedEvents = calculateAddedEvents(oldImage, newImage);
  const loadingEvents = addedEvents
      .filter(e => e.type === 'LoadingComplete' || e.type === 'UnloadingComplete')
      .filter(e => e.signature && e.signature.signatoryEmail && e.sendCopy);

  if (loadingEvents.length > 0) {
    try {
      const pdf = await fetchPdf(newImage.id);
      for (const loadingEvent of loadingEvents) {
        const htmlEmail = generateHtmlEmail(loadingEvent, newImage);
        await sendEmail(newImage.id, loadingEvent.signature.signatoryEmail, htmlEmail,
            "cn_" + newImage.id.substring(0, 8) + ".pdf", pdf);
      }
    } catch (ex) {
      console.warn("cannot send email:", ex)
    }
  }
}

const processSearch = async(record) => {
  const image = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage || record.dynamodb.OldImage);
  if (image.__typename !== "Contract") {
    return;
  }

  if (record.eventName !== 'INSERT') {
    const deleteImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage);
    await deleteSearchRecords(dynamodb, deleteImage, searchTable);
  }

  if (record.eventName !== 'REMOVE') {
    await addSearchRecords(dynamodb, image, searchTable);
  }
}

const allowedSending = async (owner) => {
  let params = {
    TableName: "Company" + "-" + process.env.API_OPENECMR_GRAPHQLAPIIDOUTPUT + "-" + process.env.ENV,
    IndexName: "OwnerName",
    KeyConditionExpression: "#o = :v_owner",
    ExpressionAttributeNames: {
      "#o": "owner"
    },
    ExpressionAttributeValues: {
      ":v_owner": {
        "S": owner
      }
    }
  };
  let company = await dynamodb.query(params).promise();

  return company.Items.length === 0 ||
      !company.Items[0].allowedSendingEmail ||
      company.Items[0].allowedSendingEmail.BOOL
}

const fetchPdf = async (id) => {
  const pdfexport = /* GraphQL */ `
    query Pdfexport($id: String) {
      pdfexport(id: $id)
    }
  `;
  const body = JSON.stringify({
    query: pdfexport,
    variables: {
      id: id
    }
  });

  const data = await sendRequest(body);
  if (!data) {
    console.log('no results found');
    return null;
  }

  return data.data.pdfexport;
}

const generateHtmlEmail = (loadingEvent, document) => {
  const source = fs.readFileSync(path.join(__dirname, './templates/signed.html'), 'utf8');
  const template = handlebars.compile(source);
  return template({
    signatoryName: loadingEvent.signature.signatoryName,
    transportId: document.id.substring(0, 8),
    loadingAddress: document.pickup.address + ", " + document.pickup.city,
    deliveryAddress: document.delivery.address + ", " + document.delivery.city,
    currentStatus: document.status.toLowerCase(),
    carrierName: document.carrier.name,
    shipperName: document.shipper.name,
    creatorName: document.creator.name
  })
}

const calculateAddedEvents = (oldImage, newImage) => {
  if (!oldImage.events) {
    return newImage.events || [];
  } else {
    return newImage.events.slice(oldImage.events.length)
  }
}

const sendEmail = async (documentId, signatoryEmail, htmlEmail, pdfFileName, pdf) => {
  let transporter = nodemailer.createTransport({
    SES: ses
  });

  const params = {
    to: signatoryEmail,
    from: "notifications@openecmr.com",
    subject: "Digital copy of consignment note",
    html: htmlEmail,
    text: "Digital copy of consignment note, please enable html email to view the details",
    attachments: [
      {
        filename: pdfFileName,
        content: pdf,
        encoding: 'base64'
      }
    ],
    headers: [
      {
        key: 'X-SES-CONFIGURATION-SET',
        value: 'openecmr'
      }
    ]
  };
  console.log('sending email to %s', signatoryEmail)

  return await new Promise((resolve, reject) => {
    transporter.sendMail(params, (err, info) => {
      if (err) {
        console.warn(err);
        reject(err)
      } else {
        console.log("sent email to %s with message id %s for document %s", signatoryEmail, info.messageId, documentId);
        resolve(info);
      }
    })
  })
}

const sendRequest = async (body) => {
  const req = new AWS.HttpRequest(appsyncUrl, region);

  req.method = "POST";
  req.headers.host = apiOpenEcmrGraphqlEndpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = body;

  if (apiKey) {
    req.headers["x-api-key"] = apiKey;
  } else {
    const signer = new AWS.Signers.V4(req, "appsync", true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
  }

  return await new Promise((resolve, reject) => {
    let data = "";
    const httpRequest = https.request({...req, host: apiOpenEcmrGraphqlEndpoint}, (result) => {
      result.on('data', (chunk) => {
        data += chunk
      });
      result.on("error", (error) => {
        reject(error);
      })
      result.on("end", () => {
        resolve(JSON.parse(data.toString()));
      })
    });

    httpRequest.write(req.body);
    httpRequest.end();
  });
};