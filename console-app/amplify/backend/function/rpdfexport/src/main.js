import ReactPDF from "@react-pdf/renderer";
import {CmrPdf} from './cmr-pdf';
import React from "react"
import AWS from "aws-sdk";
import * as crypto from "crypto";

const region = process.env.REGION ? process.env.REGION : 'eu-central-1';
AWS.config.update({region});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
import fs from 'fs'

function randomFileName() {
    return '/tmp/' + crypto.randomBytes(16).toString('base64').replace(/\//, '_');
}

export default async (event, context) => {
    const result = await dynamodb.get({
        TableName: process.env.API_OPENECMR_CONTRACTTABLE_NAME,
        Key: {
            "id": event.arguments.id
        }
    }).promise();

    if (!result || !result.Item) {
        return "unknown contract";
    }
    const item = result.Item;

    let imageLocations;
    if (item.events) {
        const values = item.events
            .filter(e => e?.signature?.signatureImageSignatory)
            .map(e => e.signature.signatureImageSignatory.key)
            .map(key => s3.getObject({
                Key: 'public/' + key,
                Bucket: process.env.STORAGE_ATTACHMENTS_BUCKETNAME
            }).promise().then(success => {
                const filename = randomFileName() + key.replace(/.*(\.\w+)$/, function(m, g1) {return g1});
                fs.writeFileSync(filename, success.Body);

                return [key, filename];
            }));
        imageLocations = Object.fromEntries(await Promise.all(values));
    } else {
        imageLocations = {}
    }

    const outputFile = randomFileName();
    await ReactPDF.renderToFile(React.createElement(CmrPdf, {
        contract: item,
        imageLocations
    }), outputFile);

    const outputFileString = fs.readFileSync(outputFile).toString('base64');
    Object.entries(imageLocations).forEach(([key, value]) => fs.unlinkSync(value));
    fs.unlinkSync(outputFile);
    return outputFileString;
};
