import {Component, useState} from "react";
import React from "react";
import {
    Button,
    Container,
    Grid,
    Header,
    Icon,
    Step,
    List, Label, Segment, Comment, Loader, Modal, Form, Message, Card
} from "semantic-ui-react";
import {API, graphqlOperation, Auth, I18n} from 'aws-amplify';
import moment from 'moment';
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import {S3Image} from "aws-amplify-react";
import {DriverPicker} from "./NewTransport";


const Address = ({address, label, icon}) => (
    <Container>
        {label &&
        <Header as={'h5'}>
            <Icon name={icon}/>
            <Header.Content>{label}</Header.Content>
        </Header>
        }
        <List>
            <List.Item>
                <List.Content><strong>{address.name}</strong></List.Content>
            </List.Item>
            <List.Item>
                <List.Content>{address.address}</List.Content>
            </List.Item>
            <List.Item>
                <List.Content>{[address.postalCode, address.city, address.country].filter(Boolean).join(', ')}</List.Content>
            </List.Item>
        </List>
    </Container>);

const eventText = (event) => {
    switch (event.type) {
        case 'ArrivalOnSite':
            return I18n.get('arrived on {site}.')
                .replace('{site}',
                    event.site === 'pickup' ? I18n.get('pickup site') : I18n.get('delivery site'));
        case 'LoadingComplete':
            return I18n.get('completed the loading.');
        case 'UnloadingComplete':
            return I18n.get('completed the unloading.');
        case "AssignDriver":
            return I18n.get('assigned transport to driver {driver}.')
                .replace('{driver}', event.assignedDriver ? event.assignedDriver.name : "unknown");
        case "Acknowledge":
            return I18n.get('acknowledged the transport');
        default:
            return I18n.get('completed {eventType}').replace('{eventType}', event.type);
    }
};

const ViewPhoto = ({photo, open, close}) => (<Modal open={open} onClose={close} closeIcon>
    <Header icon={'archive'} content={`Photo ${photo && photo.key}`} />
    <Modal.Content>
        {photo && <S3Image
            // theme={{photoImg: {width: '100px', height: '100px', marginRight: 5}}}
            resizeMode={'center'}
            level={"public"}
            imgKey={photo.key}/>}
    </Modal.Content>
</Modal>);

const Events = ({names, events}) => {
    const [photo, setPhoto] = useState(null);

    return (
        <Container>
            <ViewPhoto open={!!photo} photo={photo} close={() => setPhoto(null)}/>
            <Comment.Group >
                <Header as={'h4'}>{I18n.get('Events')}</Header>
                {
                    events.map(event => (
                        <Comment>

                            <Comment.Content>
                                <Comment.Author as={'a'}>{names[event.author.username] || event.author.username}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{moment(event.createdAt).format('llll')}</div>
                                </Comment.Metadata>
                                <Comment.Text>
                                    {eventText(event)}
                                    {
                                        (event.type === 'UnloadingComplete' || event.type === 'LoadingComplete') &&
                                            <SignatureEvent event={event} showPhoto={setPhoto}/>
                                    }
                                </Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))
                }
            </Comment.Group>
        </Container>
    );
};

const SignatureEvent = ({event: { signature, signatoryObservation, driverObservation, photos }, showPhoto}) =>
    <div>
        {
            <List style={{paddingTop: "10px", marginLeft: "20px"}}>
                {
                    signature.signatoryName &&
                    <List.Item>
                        <List.Icon name='user' verticalAlign={"middle"}/>
                        <List.Content>
                            <List.Header>{I18n.get('Signed by')}</List.Header>
                            <List.Description>{signature.signatoryName} {signature.signatoryEmail && `(${signature.signatoryEmail})`}</List.Description>
                        </List.Content>
                    </List.Item>
                }
                {
                    signatoryObservation &&
                    <List.Item>
                        <List.Icon name='warning sign' verticalAlign={"middle"} />
                        <List.Content>
                            <List.Header>{I18n.get('Signatory observation')}</List.Header>
                            <List.Description>{signatoryObservation}</List.Description>
                        </List.Content>
                    </List.Item>
                }
                {
                    <List.Item>
                        <List.Icon name={'pencil'} verticalAlign={"middle"}/>
                        <List.Content>
                            <S3Image
                                theme={{photoImg: {width: '100px', height: '100px'}}}
                                resizeMode={'center'}
                                level={"public"}
                                imgKey={signature.signatureImageSignatory.key}/>
                        </List.Content>
                    </List.Item>
                }

                    <div style={{display: "flex", flexDirection: "row"}}>
                    {
                        (photos || []).map(photo =>
                            <S3Image
                                onClick={() => showPhoto(photo)}
                                theme={{photoImg: {width: '100px', height: '100px', marginRight: 5}}}
                                resizeMode={'center'}
                                level={"public"}
                                imgKey={photo.key}/>)
                    }
                    </div>
            </List>
        }
    </div>;

class AssignDriverModal extends Component {
    constructor(props) {
        super(props);

        this.onDriverSelected = this.onDriverSelected.bind(this);
        this.save = this.save.bind(this);
        this.state = {
            driver: {
                id: props.driverId
            }
        };
    }

    render() {
        return (<Modal key={"showLoad"} open={this.props.show} size='small'>
            <Header icon={"truck"} content={I18n.get('Assign driver')}/>
            <Modal.Content>
                <Form id={"item"}>
                    <DriverPicker driverId={this.state.driver && this.state.driver.id} driverSelected={this.onDriverSelected}/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' inverted onClick={() => this.props.hide()}>
                    <Icon name='remove'/> {I18n.get('Cancel')}
                </Button>
                <Button color='green' inverted onClick={this.save}>
                    <Icon name='checkmark'/> {I18n.get('Assign')}
                </Button>
            </Modal.Actions>
        </Modal>)
    }

    onDriverSelected(driver) {
        this.setState({
            driver
        });
    }

    save() {
        this.props.onSave(this.state.driver);
    }
}

const Driver = ({contract}) =>
    <List>
        <List.Item>
            <List.Icon name={"user"}/>
            <List.Content>{contract.driver && contract.driver.name}
                {contract.needAcknowledge && <Label color='yellow' size={'small'}>{I18n.get('not acknowledged yet')}</Label>}
            </List.Content>
        </List.Item>
        <List.Item>
            <List.Icon name={"truck"}/>
            <List.Content>{contract.truck}</List.Content>
        </List.Item>
        <List.Item>
            <List.Icon name={"truck"}/>
            <List.Content>{contract.trailer}</List.Content>
        </List.Item>
    </List>;

class Transport extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    async componentDidMount() {
        const response = await API.graphql(graphqlOperation(queries.getContract, {
            "id": this.props.match.params.id
        }));
        const contract = response.data.getContract;

        this.setState({
            contract: contract
        });
    }

    names(contract) {
        const result = contract.events
            .filter(e => e.type === 'AssignDriver' && e.assignedDriver)
            .reduce((map, obj) => {
                map[obj.assignedDriver.username] = obj.assignedDriver.name;
                return map;
            }, {});
        if (contract.creator) {
            result[contract.owner] = contract.creator.name;
        }
        return result;
    }

    render() {
        const {contract} = this.state;

        if (!contract) {
            return (<div>loading</div>);
        }

        const goods =
            <List>
                {contract.loads.map((load) =>
                    <List.Item>
                        {load.quantity} {load.category}
                        {load.description && `, ${load.description}`}
                        {load.volume && `, ${load.volume} ${I18n.get('m³')}`}
                        {load.netWeight && `, ${load.netWeight} ${I18n.get('kg')}`}
                        {load.loadMeters && `, ${load.loadMeters} ${I18n.get('m')}`}
                    </List.Item>
                )}
            </List>;

        const loadingComplete = contract.events.find(e => e.type === 'LoadingComplete');
        const unloadingComplete = contract.events.find(e => e.type === 'UnloadingComplete');
        const names = this.names(contract);

        return (
            <div>
                {
                    contract.driverDriverId && contract.carrierUsername === "-" &&
                        <Message warning>
                            <Message.Header>{I18n.get('Transport assigned to a driver that is not yet linked')}</Message.Header>
                            <p>{I18n.get('The driver needs to enter the association code in the app, please see the drivers page.')}</p>
                        </Message>
                }
                <Button.Group floated='right'>
                    <Button onClick={() => this.showAssignDriver()}>
                        <Icon name='truck'/>
                        {I18n.get('Assign driver')}
                    </Button>
                    <Button onClick={() => this.delete()}>
                        <Icon name='delete'/>
                        {I18n.get('Delete')}
                    </Button>
                    <Button onClick={() => this.copy()}>
                        <Icon name='copy'/>
                        {I18n.get('Copy')}
                    </Button>
                </Button.Group>
                <Header as={'h1'}>
                    <Header.Content>{I18n.get('Transport {number}').replace('{number}', contract.id.substring(0, 8))}</Header.Content>
                    <Header.Subheader>
                        {I18n.get('Created by {creator} on {date}')
                            .replace('{creator}', contract.creator ? contract.creator.name : contract.owner)
                            .replace('{date}', moment(contract.createdAt).format("LLLL"))}
                    </Header.Subheader>
                </Header>

                <Step.Group fluid size={"mini"}>
                    <Step content={I18n.get('Created')} active={contract.status === 'CREATED' || contract.status === 'DRAFT'}/>
                    <Step content={I18n.get('Ongoing')} active={contract.status === 'IN_PROGRESS'}/>
                    <Step content={I18n.get('Done')} active={contract.status === 'DONE'}/>
                    <Step content={I18n.get('Archived')} active={contract.status === 'ARCHIVED'}/>
                </Step.Group>
                <Segment>

                    <Grid columns={3}>
                        <Grid.Row>
                            <Grid.Column>
                                <Address address={contract.shipper} icon={'building'} label={I18n.get('Shipper')}/>
                            </Grid.Column>
                            <Grid.Column>
                                <Address address={contract.carrier} icon={'truck'} label={I18n.get('Carrier')}/>
                            </Grid.Column>
                            <Grid.Column>
                                {/*Transport code*/}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Segment>
                    <Grid columns={5} divided>
                        <Grid.Row divided>
                            <Grid.Column><Header as={'h5'}>{I18n.get('Activity')}</Header></Grid.Column>
                            <Grid.Column><Header as={'h5'}>{I18n.get('Address')}</Header></Grid.Column>
                            <Grid.Column><Header as={'h5'}>{I18n.get('Loads')}</Header></Grid.Column>
                            <Grid.Column><Header as={'h5'}>{I18n.get('Arrival')}</Header></Grid.Column>
                            <Grid.Column><Header as={'h5'}>{I18n.get('Driver')}</Header></Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Label circular={true}>1</Label>{I18n.get('Pickup')}
                            </Grid.Column>
                            <Grid.Column>
                                <Address address={contract.pickup}/>
                            </Grid.Column>
                            <Grid.Column>
                                {goods}
                            </Grid.Column>
                            <Grid.Column>
                                <Header sub>{I18n.get('Planned')}</Header>
                                {I18n.get('On {date}').replace('{date}', moment(contract.arrivalDate).format('ll'))}<br/>
                                {contract.arrivalTime &&
                                <div>{I18n.get('From {start} to {end}')
                                    .replace('{start}', contract.arrivalTime.start)
                                    .replace('{end}', contract.arrivalTime.end)}</div>}

                                {loadingComplete &&
                                    <div style={{paddingTop: "10px"}}>
                                        <Header sub>{I18n.get('Actual')}</Header>
                                        {moment(loadingComplete.createdAt).format('llll')}
                                    </div>
                                }
                            </Grid.Column>
                            <Grid.Column>
                                <Driver contract={contract}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Label circular={true}>2</Label>{I18n.get('Delivery')}
                            </Grid.Column>
                            <Grid.Column>
                                <Address address={contract.delivery}/>
                            </Grid.Column>
                            <Grid.Column>
                                {goods}
                            </Grid.Column>
                            <Grid.Column>
                                <Header sub>{I18n.get('Planned')}</Header>
                                {I18n.get('On {date}').replace('{date}', moment(contract.deliveryDate).format('ll'))}<br/>
                                {contract.deliveryTime &&
                                <div>{I18n.get('From {start} to {end}')
                                    .replace('{start}', contract.deliveryTime.start)
                                    .replace('{end}', contract.deliveryTime.end)}</div>}

                                {unloadingComplete &&
                                <div style={{paddingTop: "10px"}}>
                                    <Header sub>{I18n.get('Actual')}</Header>
                                    {moment(unloadingComplete.createdAt).format('llll')}
                                </div>
                                }
                            </Grid.Column>
                            <Grid.Column>
                                <Driver contract={contract}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment>
                                <Header as={'h4'}>{I18n.get('Documents and photos')}</Header>
                                <Grid columns={2} divided>
                                    <Grid.Row divided>
                                        <Grid.Column><Header as={'h5'}>{I18n.get('Type')}</Header></Grid.Column>
                                        <Grid.Column><Header as={'h5'}>{I18n.get('Name')}</Header></Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Icon name='file'/> {I18n.get('Consignment note')}
                                        </Grid.Column>
                                        <Grid.Column>
                                            <a onClick={() => this.downloadPdf()}
                                               href={'#'}>{`cmr-${this.state.contract.id.substring(0, 8)}.pdf`}</a>&nbsp;
                                            <Loader size='mini' active={this.state.downloadingPdf} inline/>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment>
                                <Events events={contract.events} names={names}/>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <AssignDriverModal show={this.state.assignDriver}
                                   hide={() => this.hideAssignDriver()}
                                   driverId={this.state.contract.driverDriverId}
                                   onSave={(driver) => this.assignDriver(driver)}
                />
            </div>

        );
    }

    copy() {
        const {history} = this.props;
        history.push('/transports-new/' + this.state.contract.id);
    }

    showAssignDriver() {
        this.setState({
            assignDriver: true
        });
    }

    hideAssignDriver() {
        this.setState({
            assignDriver: false
        });
    }

    async assignDriver(driver) {
        const {contract} = this.state;
        const now = moment().toISOString();
        contract.driverDriverId = driver.id;
        contract.driver = {
            name: driver.name,
            username: driver.carrier
        };
        contract.carrierUsername = driver.carrier ? driver.carrier : "-";
        if (!contract.events) {
            contract.events = [];
        }
        contract.events.push({
            author: {
                username: (await Auth.currentAuthenticatedUser()).getUsername()
            },
            type: 'AssignDriver',
            createdAt: now,
            assignedDriver: {
                name: driver.name,
                username: driver.carrier
            }
        });
        this.setState({
            contract
        });
        this.hideAssignDriver();
        await API.graphql(graphqlOperation(mutations.updateContract, {
            "input": contract
        }));
    }

    async delete() {
        const {history} = this.props;
        await API.graphql(graphqlOperation(mutations.deleteContract, {
            "input": {
                "id": this.props.match.params.id
            }
        }));

        history.push('/transports');
    }

    async downloadPdf() {
        if (this.state.downloadingPdf) {
            return;
        }
        this.setState({
            downloadingPdf: true
        });
        const response = await API.graphql(graphqlOperation(queries.pdfexport, {
            "id": this.props.match.params.id
        }));
        this.setState({
            downloadingPdf: false
        });

        const linkSource = `data:application/pdf;base64,${response.data.pdfexport}`;
        const downloadLink = document.createElement("a");
        const fileName = `cmr-${this.state.contract.id.substring(0, 8)}.pdf`;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }
}

export default Transport;