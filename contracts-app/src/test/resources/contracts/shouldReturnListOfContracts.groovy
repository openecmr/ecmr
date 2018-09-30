package contracts

import org.springframework.cloud.contract.spec.Contract

Contract.make {
    request {
        method 'GET'
        url '/contracts'
        headers {
            header("Accept", "application/vnd.ecmr-contract.v1+json")
        }
    }
    response {
        status 200
        body("""
        {
            "results": [
                {
                    "contractId": {
                        "id": "725bbbf7-cecc-400a-bfd1-095bf48b76e9"
                    },
                    "consignor": {
                        "name": "C. Consignor"
                    },
                    "consignee": {
                        "name": "C. Consignee"
                    },
                    "carrier": {
                        "name": "C. Carrier"
                    },
                    "despatchLocation": {
                        "address": "Van Straten\nHoogstraat 1\n1234 AA Vlaardingen"
                    },
                    "deliveryLocation": {
                        "address": "De Hoog\nVierstraat 5\n4321 AA\nHouten"
                    },
                    "consignment": {
                        "description": "40 stacks of hay\n20 pallets of rice\n40 stacks of hay\n20 pallets of rice\n40 stacks of hay\n20 pallets of rice"
                    }
                },
                {
                    "contractId": {
                        "id": "24572933-b9a2-480d-9d2a-c5ad2940e94d"
                    },
                    "consignor": {
                        "name": "C. Consignor 2"
                    },
                    "consignee": {
                        "name": "C. Consignee 2"
                    },
                    "carrier": {
                        "name": "C. Carrier 2"
                    },
                    "despatchLocation": {
                        "address": "Van Straten 2\nLaagstraat 1\n1234 AA Vlaardingen"
                    },
                    "deliveryLocation": {
                        "address": "De Hoog\nVierstraat 5\n4321 AA\nHouten"
                    },
                    "consignment": {
                        "description": "40 stacks of hay\n20 pallets of rice\n40 stacks of hay\n20 pallets of rice\n40 stacks of hay\n20 pallets of rice"
                    }
                }
            ],
            "total": 40
        }        
        """)
        headers {
            header("Content-Type", "application/vnd.ecmr-contract.v1+json")
            header("Access-Control-Allow-Origin", "*")
        }
    }
}