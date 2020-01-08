import {Component} from "react";
import React from "react";
import {Button, Container, Icon, Progress, Table} from "semantic-ui-react";
import {Link} from "react-router-dom";
import * as queries from "./graphql/queries";
import {API, graphqlOperation} from 'aws-amplify';
import moment from 'moment';

const AddressCell = ({address}) => {
    return (
        <Table.Cell verticalAlign="top" width="1">
            <div className="no-wrap">{address.name}</div>
            <div className="no-wrap">{address.postalCode} {address.city}</div>
        </Table.Cell>
    )
};

const ConsignmentCell = ({loads}) => {
    return (
        <Table.Cell verticalAlign="top" width="3">
            {loads.map((e) => [e.quantity, e.category, e.description].join(" ")).join(" ")}
        </Table.Cell>
    )
};

const TextCell = ({text}) => {
    return (
        <Table.Cell width="1" verticalAlign="top">{text}</Table.Cell>
    )
};

const IdCell = ({id}) => {
    const text = id.substring(0, 8);
    return (
        <Table.Cell width="1" verticalAlign="top">
            <Link to={`/transports/${id}`}>{text}</Link>
        </Table.Cell>
    )
};

const DateCell = ({date}) => (
    <Table.Cell width={"1"} verticalAlign={"top"} style={{whiteSpace: "nowrap"}}>
        {moment(date).format('ll')}
    </Table.Cell>
);

const StatusMappings = {
    DRAFT: {
        progress: 0,
        label: 'draft',
        color: 'grey'
    },
    CREATED: {
        progress: 33,
        label: 'ready',
        color: 'blue'
    },
    IN_PROGRESS: {
        progress: 66,
        label: 'ongoing',
        color: 'orange'
    },
    DONE: {
        progress: 100,
        label: 'completed',
        color: 'green'
    },
    ARCHIVED: {
        progress: 100,
        label: 'archived',
        color: 'grey'
    }
};

const Status = ({status, updatedAt}) => {
    const statusMapping = StatusMappings[status];
    return <Table.Cell width={1}>
        <Progress percent={statusMapping.progress} size='tiny' color={statusMapping.color}>
            {statusMapping.label}
        </Progress>
    </Table.Cell>
};

class Transports extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notes: []
        };
    }

    render() {
        return (

            <Table className="App-text-with-newlines" selectable compact='very'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='11'>
                            <Link to={"/transports-new"}>
                                <Button floated='right' icon labelPosition='left' primary size='small'>
                                    <Icon name='plus'/> New transport
                                </Button>
                            </Link>
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
                        <Table.HeaderCell>Loads</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.renderConsignmentNotes()}
                </Table.Body>
            </Table>
        );
    }

    renderConsignmentNotes() {
        return (
            this.state.notes.map((e) =>
                <Table.Row key={e.id}>
                    {/*<TextCell text={moment(e.updatedAt).format("ll")}/>*/}
                    <IdCell id={e.id}/>
                    <TextCell text={e.references ? e.references.carrier : null}/>
                    <Status status={e.status} lastUpdate={e.updatedAt}/>
                    <AddressCell address={e.pickup}/>
                    <DateCell date={e.arrivalDate}/>
                    <AddressCell address={e.delivery}/>
                    <DateCell date={e.deliveryDate}/>
                    <AddressCell address={e.shipper}/>
                    <TextCell text={e.driver ? e.driver.name : null}/>
                    <ConsignmentCell loads={e.loads}/>
                </Table.Row>
            )
        )
    }

    componentDidMount() {
        this.retrieveAppSync();
    }

    async retrieveAppSync() {
        let contracts = [];
        let nextToken;
        while (true) {
            const response = await API.graphql(graphqlOperation(queries.listContracts, {
                nextToken: nextToken,
                limit: 1000
            }));
            contracts = contracts.concat(response.data.listContracts.items);
            nextToken = response.data.listContracts.nextToken;
            if (!nextToken) {
                break;
            }
        }
        contracts = contracts.sort((a, b) => a.updatedAt < b.updatedAt ? 1 : -1);
        this.setState({
            notes: contracts
        });
    }
}

export default Transports;