import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Icon, List, Table, Card, Container, Header} from 'semantic-ui-react'


let notes = [
    {
        'contractId': {
            'id': '31231312'
        },
        'consignor': {
            'name': 'C. Consignor'
        },
        'consignee': {
            'name': 'C. Consignee'
        },
        'carrier': {
            'name': 'C. Carrier'
        },
        'despatchLocation': {
            'address': 'Van Straten\nHoogstraat 1\n1234 AA Vlaardingen'
        },
        'deliveryLocation': {
            'address': 'De Hoog\nVierstraat 5\n4321 AA Houten'
        },
        'consignment': {
            'description': '40 stacks of hay\n20 pallets of rice\n40 stacks of hay\n20 pallets of rice\n40 stacks of hay\n20 pallets of rice'
        }
    },
    {
        'contractId': {
            'id': '31231313'
        },
        'consignor': {
            'name': 'C. Consignor'
        },
        'consignee': {
            'name': 'C. Consignee'
        },
        'carrier': {
            'name': 'C. Carrier'
        },
        'despatchLocation': {
            'address': 'Van Straten\nHoogstraat 1\n1234 AA Vlaardingen'
        },
        'deliveryLocation': {
            'address': 'Van Straten\nHoogstraat 1\n1234 AA Vlaardingen'
        },
        'consignment': {
            'description': '40 stacks of hay\n20 pallets of rice'
        }
    }
];
class App extends Component {
  render() {
    return (
        <Container>
            <Header as='h2'>Consignment notes</Header>
            <Table className="App-text-with-newlines" selectable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Consignor</Table.HeaderCell>
                        <Table.HeaderCell>Carrier</Table.HeaderCell>
                        <Table.HeaderCell>Consignee</Table.HeaderCell>
                        <Table.HeaderCell>Pick-up place</Table.HeaderCell>
                        <Table.HeaderCell>Place of positioning</Table.HeaderCell>
                        <Table.HeaderCell>Consignment</Table.HeaderCell>
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
            notes.map((e) =>
                <Table.Row key={e.contractId}>
                    <Table.Cell verticalAlign="top">{e.consignor.name}</Table.Cell>
                    <Table.Cell verticalAlign="top">{e.carrier.name}</Table.Cell>
                    <Table.Cell verticalAlign="top">{e.consignee.name}</Table.Cell>
                    <Table.Cell verticalAlign="top">{e.despatchLocation.address}</Table.Cell>
                    <Table.Cell verticalAlign="top">{e.deliveryLocation.address}</Table.Cell>
                    <Table.Cell verticalAlign="top">
                        <div>{e.consignment.description}</div>
                    </Table.Cell>
                </Table.Row>
            )
        )
    }
}

export default App;