import {Component} from "react";
import React from "react";
import {Button, Container, Header, Icon, Table} from "semantic-ui-react";

var MOCK_DATA_SOURCE = true;

class AddressCell extends Component {
    render() {
        return (
            <Table.Cell verticalAlign="top" width="1">
                <div className="no-wrap">{this.props.address.name}</div>
                <div className="no-wrap">{this.props.address.postalCode} {this.props.address.city}</div>
            </Table.Cell>
        )
    }
}

class Transports extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notes: []
        };
    }

    render() {
        return (
            <Container>
                <Table className="App-text-with-newlines" selectable compact='very'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan='11'>
                                <Button floated='right' icon labelPosition='left' primary size='small'>
                                    <Icon name='plus' /> New transport
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell>Number</Table.HeaderCell>
                            <Table.HeaderCell>Carrier reference</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Pick-up address</Table.HeaderCell>
                            <Table.HeaderCell>Pick-up date</Table.HeaderCell>
                            <Table.HeaderCell>Delivery address</Table.HeaderCell>
                            <Table.HeaderCell>Delivery date</Table.HeaderCell>
                            <Table.HeaderCell>Shipper</Table.HeaderCell>
                            <Table.HeaderCell>Driver</Table.HeaderCell>
                            <Table.HeaderCell>CMR</Table.HeaderCell>
                            <Table.HeaderCell>Loads</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderConsignmentNotes()}
                    </Table.Body>
                </Table>
            </Container>
        );
    }

    renderConsignment(loads) {
        return (
            <Table.Cell verticalAlign="top" width="5">
                {loads.map((e) => [e.quantity, e.category, e.description].join(" ")).join(" ")}
            </Table.Cell>
        )
    }

    renderConsignmentNotes() {
        return (
            this.state.notes.map((e) =>
                <Table.Row key={e.contractId.id}>
                    <Table.Cell width="1" verticalAlign="top">{e.sequentialId.id}</Table.Cell>
                    <Table.Cell width="1" verticalAlign="top">{e.references.carrier}</Table.Cell>
                    <Table.Cell width="1" verticalAlign="top">{e.status}</Table.Cell>
                    <AddressCell address={e.pickup.address}/>
                    <Table.Cell width="1" verticalAlign="top">{e.pickup.arrivalDate}</Table.Cell>
                    <AddressCell address={e.delivery.address}/>
                    <Table.Cell width="1" verticalAlign="top">{e.delivery.arrivalDate}</Table.Cell>
                    <AddressCell address={e.shipper.address}/>
                    <Table.Cell width="1" verticalAlign="top"><div className="no-wrap">{e.driver.name}</div></Table.Cell>
                    <Table.Cell width="1" verticalAlign="top">&nbsp;</Table.Cell>
                    {this.renderConsignment(e.loads)}
                </Table.Row>
            )
        )
    }

    componentDidMount() {
        if (MOCK_DATA_SOURCE) {
            this.retrieveMock();
        } else {
            this.retrieveReal();
        }
    }

    retrieveReal() {
        var headers = new Headers();
        headers.append("Accept", "application/vnd.ecmr-contract.v1+json");
        fetch("http://localhost:9876/contracts", {
            headers: headers
        })
            .then(res => res.json())
            .then((result) => {
                this.setState({
                    notes: result.results
                });
            });
    }

    retrieveMock() {
        this.setState({
            notes: MOCK_NOTES.results
        })
    }
}


let MOCK_NOTES = {
    results: [
        {
            "contractId": {
                "id": "725bbbf7-cecc-400a-bfd1-095bf48b76e9"
            },
            "sequentialId": {
                "id": "15532"
            },
            "status": "pickup",
            "shipper": {
                "address": {
                    "name": "C. Consignor",
                    "postalCode": "1234 AA",
                    "address": "Industriestraat 5",
                    "city": "Vlaardingen",
                    "country": "NL"
                }
            },
            "carrier": {
                "address": {
                    "name": "C. Carrier",
                    "postalCode": "1234 AA",
                    "address": "van der Takstraat 5",
                    "city": "Rotterdam",
                    "country": "NL"
                }
            },
            "delivery": {
                "address": {
                    "name": "Delivery location",
                    "postalCode": "4422 AA",
                    "address": "Industriestraat 5",
                    "city": "Vlaardingen",
                    "country": "NL"
                },
                "arrivalDate": "2018-12-12"
            },
            "pickup": {
                "address": {
                    "name": "Pickup location",
                    "postalCode": "2222 AA",
                    "address": "Industriestraat 5",
                    "city": "Vlaardingen",
                    "country": "NL"
                },
                "arrivalDate": "2018-12-12"
            },
            "loads": [
                {
                    "category": "pallets",
                    "quantity": 10,
                    "description": "Philips Arkona 55 SMD"
                },
                {
                    "category": "pallets",
                    "quantity": 53,
                    "description": "Bremel Toolset"
                }
            ],
            "driver": {
                "name": "D. Driver"
            },
            "references": {
                "carrier": "Ref 1234"
            }
        }
    ]
};

export default Transports;