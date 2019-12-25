/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authOpenecmr83cee658UserPoolId = process.env.AUTH_OPENECMR83CEE658_USERPOOLID
var apiOpenecmrGraphQLAPIIdOutput = process.env.API_OPENECMR_GRAPHQLAPIIDOUTPUT
var apiOpenecmrGraphQLAPIEndpointOutput = process.env.API_OPENECMR_GRAPHQLAPIENDPOINTOUTPUT
var storageAttachmentsBucketName = process.env.STORAGE_ATTACHMENTS_BUCKETNAME

Amplify Params - DO NOT EDIT */

const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => { //eslint-disable-line
  let browser = null;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    });

    const page = await browser.newPage();

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {top: '1cm', right: '1cm', bottom: '1cm', left: '1cm'}
    });

    // 5. Return PDf as base64 string
    const response = {
      headers: {
        'Content-type': 'application/pdf',
        'content-disposition': 'attachment; filename=test.pdf'
      },
      statusCode: 200,
      body: pdf.toString('base64'),
      isBase64Encoded: true
    };
    context.succeed(response)
  } catch (error) {
    return context.fail(error)
  } finally {
    if (browser !== null) {
      await browser.close()
    }
  }
};
