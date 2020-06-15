import {Component} from "react";
import React from "react";
import {Button, Dimmer, Icon, Loader, Progress, Segment, Table} from "semantic-ui-react";
import {Link} from "react-router-dom";
import * as queries from "./graphql/queries";
import {API, Auth, graphqlOperation, I18n} from 'aws-amplify';
import moment from 'moment/min/moment-with-locales';

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
            {loads.map((e) => [e.quantity, I18n.get(e.category), e.description].join(" ")).join(" ")}
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

const StatusMappings = () => ({
    DRAFT: {
        progress: 0,
        label: I18n.get('draft'),
        color: 'grey'
    },
    CREATED: {
        progress: 33,
        label: I18n.get('created'),
        color: 'blue'
    },
    IN_PROGRESS: {
        progress: 66,
        label: I18n.get('ongoing'),
        color: 'orange'
    },
    DONE: {
        progress: 100,
        label: I18n.get('done'),
        color: 'green'
    },
    ARCHIVED: {
        progress: 100,
        label: I18n.get('archived'),
        color: 'grey'
    }
});

const Status = ({status, updatedAt}) => {
    const statusMapping = StatusMappings()[status];
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
            notes: [],
            loading: true
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
                                    <Icon name='plus'/> {I18n.get('New transport')}
                                </Button>
                            </Link>
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>{I18n.get('Number')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Carrier reference')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Status')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Pick-up address')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Pick-up date')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Delivery address')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Delivery date')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Shipper')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Driver')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Loads')}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>

                    {!this.state.loading && this.renderConsignmentNotes()}
                    {!this.state.loading && this.state.notes.length === 0 &&
                        <Table.Row>
                            <Table.Cell colSpan={'10'} textAlign={"center"} selectable={false}>
                                <div style={{padding: '50px', paddingTop: '200px', minHeight: '560px'}}>
                                    <p>
                                        {I18n.get('No transports found, please create one using the button above.')}
                                    </p>
                                    <Icon name={"shipping fast"} size={"massive"}/>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    }
                    {this.state.loading &&
                        <Table.Row>
                            <Table.Cell colSpan={'10'} textAlign={"center"} selectable={false}>
                                <Loader active={true} inline size={"large"}/>
                            </Table.Cell>
                        </Table.Row>
                    }
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
        const user = await Auth.currentAuthenticatedUser();
        const response = await API.graphql(graphqlOperation(queries.contractsByOwnerArrivalDate, {
            limit: 50,
            owner: user.getUsername(),
            sortDirection: "DESC"
        }));
        this.setState({
            notes: response.data.contractsByOwnerArrivalDate.items,
            loading: false
        });
    }
}

export default Transports;