import ReactPDF from "@react-pdf/renderer";
import {CmrPdf} from './cmr-pdf.js';
import React from "react"
import fs from 'fs'

const imageLocations = {
    'signature-09e58912-ad9a-4ec2-8399-11dd7a9cec2a.png': '../signature-09e58912-ad9a-4ec2-8399-11dd7a9cec2a.png',
    'signature-7f702207-c9df-4992-ac27-4e000c399a12.png': '../signature-09e58912-ad9a-4ec2-8399-11dd7a9cec2a.png'
};
(async function() {
    const document = React.createElement(CmrPdf, {
        title: "Open eCMR pdf export",
        contract: JSON.parse(fs.readFileSync('./test-contract.json')),
        imageLocations: imageLocations
    });
    const output = await ReactPDF.renderToFile(document, "/tmp/rpdfexport-test.pdf");
})();