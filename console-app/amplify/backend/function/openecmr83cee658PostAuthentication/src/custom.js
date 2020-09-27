const handlebars = require('handlebars'),
    fs = require('fs'),
    path = require('path');

const supportedLanguages = ['en', 'nl'];
const subjects = {
  'en': 'Your activation code - Open e-CMR',
  'nl': 'Je activatiecode - Open e-CMR'
}
const region = 'eu-central-1';

exports.handler = (event, context, callback) => {
  try {
    console.log("incoming %o", event)
    if (event.triggerSource === "CustomMessage_SignUp" || event.triggerSource === 'CustomMessage_ResendCode') {
      let language = event.request.clientMetadata && event.request.clientMetadata.language;
      if (!language || supportedLanguages.indexOf(language) === -1) {
        language = 'en';
      }
      event.response.emailSubject = subject(event, language);
      event.response.emailMessage = message(event, language);
    } else if (event.triggerSource.startsWith('TokenGeneration_')) {
      const groups = event.request.groupConfiguration.groupsToOverride;

      selectOwners(event.request.username)
          .then((owners) => {
            // add tenant to groups
            event.response = {
              claimsOverrideDetails: {
                groupOverrideDetails: {
                  groupsToOverride: [owners, ...groups],
                },
              },
            }
            callback(null, event);
          });
      return;
    }
    callback(null, event);
  } catch(ex) {
    console.log(ex)
    callback(ex)
  }
};

const selectOwners = async (username) => {
  if (false) {
    const AWS = require('aws-sdk');
    AWS.config.update({
      region: region
    });
    const dynamodb = new AWS.DynamoDB();
    let params = {
      TableName: "Drivers" + "-" + process.env.API_OPENECMR_GRAPHQLAPIIDOUTPUT + "-" + process.env.ENV,
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
    console.log(params);
    let company = await dynamodb.query(params).promise();

    console.log(company);

    return company.Items.length === 0 ||
        !company.Items[0].allowedSendingEmail ||
        company.Items[0].allowedSendingEmail.BOOL
  } else {
    return "bob57";
  }
}

const subject = (event, language) => {
  const template = handlebars.compile(subjects[language]);
  return template({
    codeParameter: event.request.codeParameter
  });
}

const message = (event, language) => {
  const source = fs.readFileSync(path.join(__dirname, `./templates/welcome_${language}.html`), 'utf8');
  const template = handlebars.compile(source);
  return template({
    codeParameter: event.request.codeParameter,
    username: event.userName
  })
}