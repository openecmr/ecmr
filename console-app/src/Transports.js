import {Component} from "react";
import React from "react";
import {Button, Container, Icon, Table} from "semantic-ui-react";
import {Link} from "react-router-dom";
import * as queries from "./graphql/queries";
import { API, graphqlOperation } from 'aws-amplify';
import moment from 'moment';

var MOCK_DATA_SOURCE = false;

class AddressCell extends Component {
    render() {
        const address = this.props.address || {};

        return (
            <Table.Cell verticalAlign="top" width="1">
                <div className="no-wrap">{address.name}</div>
                <div className="no-wrap">{address.postalCode} {address.city}</div>
            </Table.Cell>
        )
    }
}

class ConsignmentCell extends Component {
    render() {
        return (
            <Table.Cell verticalAlign="top" width="5">
                {this.props.loads.map((e) => [e.quantity, e.category, e.description].join(" ")).join(" ")}
            </Table.Cell>
        )
    }
}

class TextCell extends Component {
    render() {
        return (
            <Table.Cell width="1" verticalAlign="top">{this.props.text}</Table.Cell>
        )
    }
}

class IdCell extends Component {
    render() {
        const text = this.props.id.substring(0, 8);
        return (
            <Table.Cell width="1" verticalAlign="top">
                <Link to={`/transports/${this.props.id}`}>{text}</Link>
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
                            <Table.HeaderCell colSpan='12'>
                                <Link to={"/transports-new"}>
                                    <Button floated='right' icon labelPosition='left' primary size='small'>
                                        <Icon name='plus' /> New transport
                                    </Button>
                                </Link>
                            </Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell>Updated</Table.HeaderCell>
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

    renderConsignmentNotes() {
        return (
            this.state.notes.map((e) =>
                <Table.Row key={e.id}>
                    <TextCell text={moment(e.updatedAt).format("ll")}/>
                    <IdCell id={e.id}/>
                    <TextCell text={e.references ? e.references.carrier : null}/>
                    <TextCell text={e.status}/>
                    <AddressCell address={e.pickup}/>
                    <TextCell text={e.pickup ? e.pickup.arrivalDate : null}/>
                    <AddressCell address={e.delivery}/>
                    <TextCell text={e.delivery ? e.delivery.arrivalDate : null}/>
                    <AddressCell address={e.shipper}/>
                    <TextCell text={e.driver ? e.driver.name : null}/>
                    <TextCell text={''}/>
                    <ConsignmentCell loads={e.loads}/>
                </Table.Row>
            )
        )
    }

    componentDidMount() {
        if (MOCK_DATA_SOURCE) {
            this.retrieveMock();
        } else {
            this.retrieveAppSync();
        }
    }

    async retrieveAppSync() {
        const response = await API.graphql(graphqlOperation(queries.listContracts));
        const contracts = response.data.listContracts.items.sort((a, b) => a.updatedAt < b.updatedAt ? 1 : -1);

        this.setState({
            notes: contracts
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