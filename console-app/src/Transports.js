import React from "react";
import {
    Button,
    Form,
    Icon,
    Loader,
    Menu,
    Progress,
    Segment,
    Table,
    Label
} from "semantic-ui-react";
import {Link} from "react-router-dom";
import * as queries from "./graphql/queries";
import {API, Auth, graphqlOperation} from 'aws-amplify';
import {I18n} from 'aws-amplify/utils';
import moment from 'moment/min/moment-with-locales';
import {ContactPicker} from "./NewTransport";
import {trackEvent} from "./ConsoleUtils";
import * as PropTypes from "prop-types";
import SortableTable from "./SortableTable";

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
        <Table.Cell verticalAlign="top" width="3" singleLine>
            {loads.map((e) => [e.quantity, I18n.get(e.category), e.description].join(" "))
                .map(e => <div title={e} style={{overflow: "hidden", textOverflow: "ellipsis"}}>{e}</div>)}
        </Table.Cell>
    )
};

const TextCell = ({text}) => {
    return (
        <Table.Cell width="1" verticalAlign="top">{text}</Table.Cell>
    )
};

const IdCell = ({contract, path}) => {
    const text = contract.openecmrId || contract.id.substring(0, 8);
    return (
        <Table.Cell width="1" verticalAlign="top">
            <Link to={`${path ? path : "/transports"}/${contract.id}`}>{text}</Link>
        </Table.Cell>
    )
};

const DateCell = ({date, showTime}) => (
    <Table.Cell width={"1"} verticalAlign={"top"} style={{whiteSpace: "nowrap"}} textAlign={'right'}>
        {moment(date).format('ll')}
        {showTime && <br/>}
        {showTime && moment(date).format('LTS')}
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
        <Progress percent={statusMapping.progress} size={'tiny'} color={statusMapping.color}>
        </Progress>
        <div style={{whiteSpace: "nowrap", marginTop: -30, textAlign: "center", fontWeight: "bold", fontSize: "x-small"}}>{statusMapping.label}</div>
    </Table.Cell>
};

const Driver = ({driver, needAcknowledge}) =>
    <Table.Cell width="1" verticalAlign="top">
        <div>{driver ? driver.name : I18n.get("Not assigned")}</div>
        {(driver && needAcknowledge) &&  <Label color='yellow' size={'tiny'}>{I18n.get('not acknowledged yet')}</Label>}
    </Table.Cell>

const Pagination = ({onFirst, onPrevious, onNext, onRefresh, currentPageToken, nextToken}) => {
    return <Menu pagination>
        <Menu.Item as='a' icon onClick={onFirst} disabled={!currentPageToken}>
            <Icon name='angle double left'/>
        </Menu.Item>
        <Menu.Item as='a' icon onClick={onPrevious} disabled={!currentPageToken}>
            <Icon name='chevron left'/>
        </Menu.Item>
        <Menu.Item as='a' icon onClick={onNext} disabled={!nextToken}>
            <Icon name='chevron right'/>
        </Menu.Item>
        <Menu.Item as='a' icon onClick={onRefresh}>
            <Icon name='refresh'/>
        </Menu.Item>
    </Menu>;
}

Pagination.propTypes = {
    onFirst: PropTypes.func,
    currentPageToken: PropTypes.any,
    onPrevious: PropTypes.func,
    onNext: PropTypes.func,
    nextToken: PropTypes.any,
    onRefresh: PropTypes.func
};

function Filter(props) {
    return <Segment padded compact size={"tiny"} color={"olive"}>
        <Form>
            <Form.Group>
                <Form.Input value={props.lastChangeFrom} disabled={props.filterPickup}
                            size={"mini"} label={I18n.get("Last changed from")}
                            onChange={props.onChange} name="lastChangeFrom"
                            type={"date"}/>
                <Form.Input value={props.lastChangeTo} disabled={props.filterPickup}
                            size={"mini"} label={I18n.get("Last changed to")}
                            onChange={props.onChange} name="lastChangeTo"
                            type={"date"}/>

                <Form.Input value={props.pickupFrom}
                            disabled={props.filterLastChange || props.filterContact}
                            size={"mini"} label={I18n.get("Pickup date from")}
                            onChange={props.onChange} name="pickupFrom" type={"date"}/>
                <Form.Input value={props.pickupTo}
                            disabled={props.filterLastChange || props.filterContact}
                            size={"mini"} label={I18n.get("Pickup date to")}
                            onChange={props.onChange} name="pickupTo" type={"date"}/>

                <Form.Field label={I18n.get("Address")} disabled={props.filterPickup}
                            pickerWidth={300} control={ContactPicker}
                            contactId={props.contactId}
                            contactSelected={props.contactSelected}/>
            </Form.Group>
            <Button floated={"right"} primary positive
                    onClick={props.onApply}>{I18n.get("Apply")}</Button>
            <Button floated={"right"} secondary
                    onClick={props.onClearFilters}>{I18n.get("Clear")}</Button>
        </Form>
    </Segment>;
}

Filter.propTypes = {
    lastChangeFrom: PropTypes.any,
    filterPickup: PropTypes.bool,
    onChange: PropTypes.func,
    lastChangeTo: PropTypes.any,
    pickupFrom: PropTypes.any,
    filterLastChange: PropTypes.bool,
    filterContact: PropTypes.bool,
    pickupTo: PropTypes.any,
    contactId: PropTypes.any,
    contactSelected: PropTypes.func,
    onApply: PropTypes.func,
    onClearFilters: PropTypes.func
};

class Transports extends SortableTable {
    constructor(props) {
        super(props, "transportsSort", "transportsSortOrder", "updatedAt");

        this.state = {
            ...this.state,
            notes: [],
            lastChangeFrom: "",
            lastChangeTo: "",
            pickupFrom: "",
            pickupTo: "",
            filters: localStorage.getItem("filters") === "true",
            ...props,
        };

        this.handleFiltersInput = this.handleFiltersInput.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.toggleFilters = this.toggleFilters.bind(this);
        this.filterContactSelected = this.filterContactSelected.bind(this);
    }

    handleFiltersInput(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    toggleFilters() {
        if (this.state.filters) {
            this.clearFilters();
        }
        let newState = !this.state.filters;
        this.setState({filters: newState});
        localStorage.setItem('filters', newState.toString());
    }

    componentWillUnmount() {
        this.props.setParentState(this.state);
    }

    render() {
        const cols = 10;
        const filterLastChange = !!(this.state.lastChangeFrom || this.state.lastChangeTo);
        const filterPickup = !!(this.state.pickupFrom || this.state.pickupTo);
        const filterContact = !!(this.state.contactId);
        return (

            <Table className="App-text-with-newlines" selectable compact='very' sortable columns={cols} fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{overflow: 'visible'}} colSpan={cols}>
                            <Link to={"/transports-new"}>
                                <Button floated='right' icon labelPosition='left' primary size='small'>
                                    <Icon name='plus'/> {I18n.get('New transport')}
                                </Button>
                            </Link>
                            <Button floated={'right'} active={this.state.filters} icon
                                    onClick={this.toggleFilters} color={"olive"} labelPosition={'left'} size={'small'}>
                                <Icon name='filter'/> {I18n.get('Filters')}
                            </Button>
                            <Pagination onFirst={this.onFirst} currentPageToken={this.state.currentPageToken}
                                        onPrevious={this.onPrev} onNext={this.onNext} nextToken={this.state.nextToken}
                                        onRefresh={this.refresh}/>
                            {this.state.filters && <Filter lastChangeFrom={this.state.lastChangeFrom} filterPickup={filterPickup}
                                                           onChange={this.handleFiltersInput}
                                                           lastChangeTo={this.state.lastChangeTo}
                                                           pickupFrom={this.state.pickupFrom}
                                                           filterLastChange={filterLastChange}
                                                           filterContact={filterContact} pickupTo={this.state.pickupTo}
                                                           contactId={this.state.contactId}
                                                           contactSelected={this.filterContactSelected}
                                                           onApply={this.applyFilters} onClearFilters={this.clearFilters}/>}
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>{I18n.get('Number')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Status')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Pick-up address')}</Table.HeaderCell>
                        <Table.HeaderCell className={"sort"} onClick={() => this.changeSort('pickupDate')}
                                          sorted={this.state.sort === 'pickupDate' && this.state.sortOrder}>{I18n.get('Pick-up date')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Delivery address')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Delivery date')}</Table.HeaderCell>
                        <Table.HeaderCell className={"sort"} onClick={() => this.changeSort('updatedAt')}
                                          sorted={this.state.sort === 'updatedAt' && this.state.sortOrder}>{I18n.get('Last change')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Shipper')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Driver')}</Table.HeaderCell>
                        <Table.HeaderCell>{I18n.get('Loads')}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>

                    {!this.state.loading && this.renderConsignmentNotes()}
                    {!this.state.loading && this.state.notes.length === 0 && !this.state.currentPageToken &&
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
                        <Table.Cell colSpan={cols} textAlign={"center"} selectable={false}>
                            <Loader active={true} inline size={"large"}/>
                        </Table.Cell>
                    </Table.Row>
                    }
                </Table.Body>
                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan={cols}>
                            <Menu floated='right' pagination>
                                <Menu.Item as='a' icon onClick={this.onPrev} disabled={!this.state.currentPageToken}>
                                    <Icon name='chevron left'/>
                                </Menu.Item>
                                <Menu.Item as='a' icon onClick={this.onNext} disabled={!this.state.nextToken}>
                                    <Icon name='chevron right'/>
                                </Menu.Item>
                            </Menu>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        );
    }

    renderConsignmentNotes() {
        return (
            this.state.notes.map((e) =>
                <Table.Row key={e.id}>
                    {/*<TextCell text={moment(e.updatedAt).format("ll")}/>*/}
                    <IdCell contract={e}/>
                    <Status status={e.status} lastUpdate={e.updatedAt}/>
                    <AddressCell address={e.pickup}/>
                    <DateCell date={e.arrivalDate}/>
                    <AddressCell address={e.delivery}/>
                    <DateCell date={e.deliveryDate}/>
                    <DateCell date={e.updatedAt} showTime/>
                    <AddressCell address={e.shipper}/>
                    <Driver driver={e.driver} needAcknowledge={e.needAcknowledge}/>
                    <ConsignmentCell loads={e.loads}/>
                </Table.Row>
            )
        )
    }

    clearFilters() {
        this.setState({
            pickupTo: "",
            pickupFrom: "",
            lastChangeTo: "",
            lastChangeFrom: "",
            contactId: null,
            previousTokens: [],
            currentPageToken: null
        });
        this.retrieveAppSync();
    }

    async retrieveAppSync(token) {
        const addFilterParams = (filterParam, name, lastChangeFrom, lastChangeTo) => {
            if (lastChangeFrom && lastChangeTo) {
                filterParam[name] = {
                    between: [lastChangeFrom, lastChangeTo]
                };
            } else if (lastChangeFrom) {
                filterParam[name] = {
                    ge: lastChangeFrom
                };
            } else if (lastChangeTo) {
                filterParam[name] = {
                    le: lastChangeTo
                };
            }
        }
        const {sort} = this.state;
        this.setState({
            loading: true
        });
        const user = await Auth.currentAuthenticatedUser();

        let key;
        let filterParam = {};
        const {lastChangeFrom, lastChangeTo, pickupFrom, pickupTo, contactId} = this.state;
        if (lastChangeFrom || lastChangeTo) {
            trackEvent({
                category: "transports",
                action: "filter",
                label: "filter_by_last_change"
            });
            key = contactId ? 'contractsByFilterCustom' : 'contractsByOwnerUpdatedAt';
            addFilterParams(filterParam,"updatedAt", lastChangeFrom, lastChangeTo);
            if (contactId) {
                filterParam.contactId = contactId;
            }
            this.setState({
                sort: 'updatedAt'
            })
        } else if (pickupFrom || pickupTo) {
            trackEvent({
                category: "transports",
                action: "filter",
                label: "filter_by_arrival_date"
            })
            key = 'contractsByOwnerArrivalDate';
            addFilterParams(filterParam,"arrivalDate", pickupFrom, pickupTo);
            this.setState({
                sort: 'pickupDate'
            })
        } else if (contactId) {
            key = 'contractsByFilterCustom'
            filterParam.contactId = contactId;
            filterParam.owner = (await Auth.currentAuthenticatedUser()).getUsername();
        } else {
            key = sort === 'pickupDate' ? 'contractsByOwnerArrivalDate' : 'contractsByOwnerUpdatedAt';
        }

        const response = await API.graphql(graphqlOperation(
            queries[key], {
                limit: 10,
                owner: user.getUsername(),
                sortDirection: this.state.sortOrder === 'descending' ? "DESC" : "ASC",
                ...token && {nextToken: token},
                ...filterParam
            }));

        const nextToken = response.data[key].nextToken;
        this.setState({
            nextToken: nextToken,
            notes: response.data[key].items,
            loading: false
        });
    }

    filterContactSelected(contact) {
        this.setState({
            contactId: contact
        });
    }
}
export {
    Pagination, IdCell, AddressCell, DateCell, ConsignmentCell
}

export default Transports;