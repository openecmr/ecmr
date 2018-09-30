import React, { Component } from 'react';
import './App.css';
import {Table, Container, Header} from 'semantic-ui-react'

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
                <Table.Row key={e.contractId.id}>
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
}

export default App;