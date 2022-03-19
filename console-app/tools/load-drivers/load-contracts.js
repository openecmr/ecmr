var AWS = require('aws-sdk');
var uuid = require('uuid');
var faker = require('faker');

AWS.config.update({region:'eu-central-1'});

async function add() {
    let dynamodb = new AWS.DynamoDB();
    for (let step = 0; step < 500; step++) {
        await dynamodb.putItem({
            TableName: "Contract-hnaljydbkvhxxmqe3c36uqlq74-develop",
            Item: {
                "id": {
                    "S": uuid.v4()
                },
                "shipper": {
                    "M": {
                        "name": {
                            "S": "Ladaree"
                        }
                    }
                },
                "pickup": {
                    "M": {
                        "name": {
                            "S": " Hooi & Zn "
                        },
                        "country": {
                            "S": "Nederland"
                        },
                        "address": {
                            "S": "van der Venring 3a"
                        },
                        "city": {
                            "S": "Wintelre"
                        },
                        "postalCode": {
                            "S": "1277 BC"
                        }
                    }
                },
                "status": {
                    "S": "CREATED"
                },
                "carrierContactId": {
                    "S": "f2236e71-3cea-447d-acbe-e1524e7297a0"
                },
                "orderDate": {
                    "S": "2021-05-16T11:25:12.439Z"
                },
                "orderCarrier": {
                    "S": "bob57"
                },
                "owner": {
                    "S": "bob57"
                },
                "orderOwner": {
                    "S": "klant57"
                },
                "__typename": {
                    "S": "Contract"
                },
                "deliveryDate": {
                    "S": "2021-05-16"
                },
                "carrierUsername": {
                    "S": "bobdriver1"
                },
                "arrivalTime": {
                    "M": {
                        "start": {
                            "S": "10:01"
                        },
                        "end": {
                            "S": "10:10"
                        }
                    }
                },
                "creator": {
                    "M": {
                        "name": {
                            "S": "Ladaree"
                        }
                    }
                },
                "orderStatus": {
                    "S": "PLANNED"
                },
                "createdAt": {
                    "S": "2021-05-16T11:25:12.439Z"
                },
                "creatorCompanyId": {
                    "S": "339dd37b-d6ba-4088-a28d-be61f39af73b"
                },
                "driver": {
                    "M": {
                        "name": {
                            "S": "Bob Driver 1"
                        },
                        "username": {
                            "S": "bobdriver1"
                        }
                    }
                },
                "delivery": {
                    "M": {
                        "name": {
                            "S": " Koning Knol "
                        },
                        "country": {
                            "S": "Nederland"
                        },
                        "address": {
                            "S": "de Pruyssenaere de la Woestijneweg 11"
                        },
                        "city": {
                            "S": "Beinsdorp"
                        },
                        "postalCode": {
                            "S": "3415 PV"
                        }
                    }
                },
                "driverDriverId": {
                    "S": "9c255884-76cc-4763-b98e-c9dde29b624c"
                },
                "truck": {
                    "S": "42-TNN-2"
                },
                "events": {
                    "L": [
                        {
                            "M": {
                                "signatoryObservation": {
                                    "NULL": true
                                },
                                "attachments": {
                                    "NULL": true
                                },
                                "signature": {
                                    "NULL": true
                                },
                                "author": {
                                    "M": {
                                        "username": {
                                            "S": "bob57"
                                        }
                                    }
                                },
                                "latitude": {
                                    "NULL": true
                                },
                                "newLoads": {
                                    "NULL": true
                                },
                                "type": {
                                    "S": "AssignDriver"
                                },
                                "oldLoads": {
                                    "NULL": true
                                },
                                "assignedDriver": {
                                    "M": {
                                        "name": {
                                            "S": "Bob Driver 1"
                                        },
                                        "username": {
                                            "S": "bobdriver1"
                                        }
                                    }
                                },
                                "photos": {
                                    "NULL": true
                                },
                                "driverObservation": {
                                    "NULL": true
                                },
                                "sendCopy": {
                                    "NULL": true
                                },
                                "createdAt": {
                                    "S": "2021-05-16T11:57:19.948Z"
                                },
                                "site": {
                                    "NULL": true
                                },
                                "longitude": {
                                    "NULL": true
                                },
                                "deletesAttachments": {
                                    "NULL": true
                                }
                            }
                        }
                    ]
                },
                "loads": {
                    "L": [
                        {
                            "M": {
                                "description": {
                                    "S": "zakken spack 1LTR 392 SKU 423423212"
                                },
                                "netWeight": {
                                    "N": "5000"
                                },
                                "quantity": {
                                    "N": "5"
                                },
                                "category": {
                                    "S": "pallets"
                                }
                            }
                        }
                    ]
                },
                "updatedAt": {
                    "S": "2021-05-16T12:12:31.293Z"
                },
                "openecmrId": {
                    "N": "142557"
                },
                "carrier": {
                    "M": {
                        "name": {
                            "S": "Bob57 Shipments"
                        },
                        "country": {
                            "NULL": true
                        },
                        "address": {
                            "NULL": true
                        },
                        "city": {
                            "NULL": true
                        },
                        "postalCode": {
                            "NULL": true
                        }
                    }
                },
                "arrivalDate": {
                    "S": "2021-05-16"
                },
                "truckVehicleId": {
                    "S": "75efc2d8-dda3-4637-b566-28a14cbba9a1"
                }
            }
        }).promise();
    }
}
add().then(function() {
    console.log("done");
}).catch(function(e) {
    console.log("error: " + e);
})