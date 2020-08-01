## Open eCMR
A service for creating electronic consignment notes for the carriage of goods by road conforming to the eCMR protocol. 

It allows a shipper of goods to create consignment notes and share them with their carrier. The carrier can download the waybills using a smartphone app. Once downloaded the carrier can use the app to collect the necessary approvals and signatures. All data is shared on a central server so that all parties can access the data immediately. 

The focus of the service is both on reducing the amount of paperwork for shipments and improving communication between shippers, carriers and receivers of goods. For example a carrier can inform shipper and receiver on the estimated date of arrival to a shipping location.

### Name

The CMR convention is a United Nations convention for carriage of goods by road. It defines a legal framework for international shipments and makes cross border trade easier. Each shipment is accompanied by a consignment note that defines among other things for whom the goods are shipped and to where.

The UN updated the CMR contract to also allow electronic waybills, this is called the eCMR.

In most countries the CMR consignment note can also be used for domestic transports. Usually the local laws require similar information to be put on a domestic consignment note.
 
## Components

* EcmrApp: React Native app for carriers (currently only supports Android) 
* Console app: React web app for creating consignment notes and tracking their progress
* Backend: backend written using the AWS Amplify framework

## Usage
Open eCMR has a cloud offering which is available at https://www.openecmr.com. Usage is free for the first 100 consignment notes per month.

You can also op to self-host and create custom builds of the applications.

## Participate
Right now we are most interested in getting feedback from shippers and carriers. Please create an account at https://www.openecmr.com and try out the app. Create a Github issue if the app doesn't support your workflow, if you see a bug, if things are not user-friendly. Let's build Open eCMR together.

## License

MIT License

Copyright (c) 2020 Open e-CMR

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
