import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Icon, List, Table, Card, Container, Header} from 'semantic-ui-react'

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notes: []
        };
    }

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
            this.state.notes.map((e) =>
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

    componentDidMount() {
        fetch("http://localhost:8080/contracts")
            .then(res => res.json())
            .then((result) => {
                console.log(result);
                this.setState({
                    notes: result
                });
            });
    }
}

export default App;