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
  console.log(event);
  let browser = null;
  try {
    console.info("starting browser")
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    });

    console.info("loading page");
    const page = await browser.newPage();
    let url = 'https://app.openecmr.com/transports/' + event.arguments.id + '/pdf#' + process.env.API_KEY;
    console.info("visiting transport page: " + url);
    await page.goto(url);
    console.info("waiting for content");
    try {
      await page.waitForSelector('div.content', {timeout: 15000});
      await page.waitFor(1000);
    } catch(e) {
      console.log(e)
    }
    console.log("loading pdf");
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {top: '1cm', right: '1cm', bottom: '1cm', left: '1cm'}
    });


    return pdf.toString('base64');
  } catch (error) {
    return context.fail(error)
  } finally {
    if (browser !== null) {
      await browser.close()
    }
  }
};
