const handlebars = require('handlebars'),
    fs = require('fs'),
    path = require('path');

const supportedLanguages = ['en', 'nl'];
const subjects = {
  'en': 'Your activation code - Open e-CMR',
  'nl': 'Je activatiecode - Open e-CMR'
}

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
    }
    callback(null, event);
  } catch(ex) {
    console.log(ex)
    callback(ex)
  }
};

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