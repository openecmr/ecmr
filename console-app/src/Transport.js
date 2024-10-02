import {Component, useEffect, useRef, useState} from "react";
import React from "react";
import {
    Button,
    Container,
    Grid,
    Header,
    Icon,
    Step,
    List, Label, Segment, Comment, Loader, Modal, Form, Message, Card, Confirm, Divider
} from "semantic-ui-react";
import { getCurrentUser } from 'aws-amplify/auth';
import {client} from "./ConsoleUtils";
import {I18n} from 'aws-amplify/utils';
import moment from 'moment/min/moment-with-locales';
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import {DriverPicker, VehiclePicker} from "./NewTransport";
import { v4 as uuidv4 } from 'uuid';
import {Link} from "react-router-dom";
import {doUpdateContract} from "./ConsoleUtils";
import {Wrapper} from "@googlemaps/react-wrapper";
import {MAPS_API_KEY} from "./secrets";
import {StorageImage} from "@aws-amplify/ui-react-storage";

const MAX_FILE_SIZE = 1024 * 1024;
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
        case "AddAttachment":
            return I18n.get('added attachment {filename}').replace('{filename}', event.attachments && event.attachments.length && event.attachments[0].filename);
        case "DeleteAttachment":
            return I18n.get('removed attachment');
        case "Acknowledge":
            return I18n.get('acknowledged the transport');
        case "Edited":
            return I18n.get('edited the transport');
        default:
            return I18n.get('completed {eventType}').replace('{eventType}', event.type);
    }
};

const ViewPhoto = ({photo, open, close}) => (<Modal open={open} onClose={close} closeIcon>
    <Header icon={'archive'} content={`Photo ${photo && photo.key}`} />
    <Modal.Content>
        <div style={{textAlign: "center"}}>
        {photo && <StorageImage
            // theme={{photoImg: {width: '100px', height: '100px', marginRight: 5}}}
            resizeMode={'center'}
            level={"public"}
            imgKey={photo.key}/>}
        </div>
    </Modal.Content>
</Modal>);

const Events = ({names, events}) => {
    const [photo, setPhoto] = useState(null);

    return (
        <Container>
            <ViewPhoto open={!!photo} photo={photo} close={() => setPhoto(null)}/>
            <Comment.Group >
                <Header as={'h4'}>{I18n.get('Events')}</Header>
                <div style={{maxHeight: '400px', overflowY: "scroll"}}>
                {
                    [...events].reverse().map(event => (
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
                </div>
            </Comment.Group>
        </Container>
    );
};

const SignatureEvent = ({event: { signature, signatoryObservation, driverObservation, photos }, showPhoto}) =>
    <div>
        {
            <div style={{paddingTop: "10px", marginLeft: "20px"}}>
                <List>
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
                            <List.Icon name='warning sign' verticalAlign={"middle"}/>
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
                                <StorageImage
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
                                <StorageImage
                                    onClick={() => showPhoto(photo)}
                                    theme={{
                                        photoImg: {
                                            width: '100px',
                                            height: '100px',
                                            marginRight: 5,
                                            cursor: "pointer"
                                        }
                                    }}
                                    resizeMode={'center'}
                                    level={"public"}
                                    imgKey={photo.key}/>)
                        }
                    </div>
                </List>
                {
                    signature.signatureImageDriver &&
                    <List>
                        <List.Item>
                            <List.Icon name='user' verticalAlign={"middle"}/>
                            <List.Content>
                                <List.Header>{I18n.get('Driver signature')}</List.Header>
                                <List.Description></List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name={'pencil'} verticalAlign={"middle"}/>
                            <List.Content>
                                <StorageImage
                                    theme={{photoImg: {width: '100px', height: '100px'}}}
                                    resizeMode={'center'}
                                    level={"public"}
                                    imgKey={signature.signatureImageDriver.key}/>
                            </List.Content>
                        </List.Item>
                    </List>
                }
            </div>
        }
    </div>;

const MyLink = ({onClick, children}) => <div title={children} onClick={onClick} style={{verticalAlign: "top", display: "inline-block", color: "#4183c4", cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%"}}>{children}</div>

class FormModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<Modal key={"showLoad"} open={this.props.show} size='small'>
            <Header icon={"truck"} content={I18n.get('Assign driver')}/>
            <Modal.Content>
                <Form id={"item"}>
                    {this.props.children}
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' inverted onClick={() => this.props.hide()}>
                    <Icon name='remove'/> {I18n.get('Cancel')}
                </Button>
                <Button color='green' inverted onClick={this.props.save}>
                    <Icon name='checkmark'/> {I18n.get('Assign')}
                </Button>
            </Modal.Actions>
        </Modal>)
    }
}

class AssignDriverModal extends Component {
    constructor(props) {
        super(props);

        this.onDriverSelected = this.onDriverSelected.bind(this);
        this.save = this.save.bind(this);
        this.onTrailerSelected = this.onTrailerSelected.bind(this);
        this.onTruckSelected = this.onTruckSelected.bind(this);
        this.state = {
            driver: {
                id: props.driverId
            },
            truck: {
                id: props.truckVehicleId
            },
            trailer: {
                id: props.trailerVehicleId
            }
        };
    }

    render() {
        return (<FormModal {...this.props} save={this.save}>

            <Form.Field label={I18n.get('Driver')}
                        control={DriverPicker}
                        driverId={this.state.driver && this.state.driver.id}
                        driverSelected={this.onDriverSelected}/>
            <Form.Field label={I18n.get('Truck')}
                        control={VehiclePicker}
                        type={"TRUCK"}
                        vehicleId={this.state.truck && this.state.truck.id}
                        vehicleSelected={this.onTruckSelected}
                        companyId={this.props.companyId}/>
            <Form.Field label={I18n.get('Trailer')}
                        control={VehiclePicker}
                        type={"TRAILER"}
                        vehicleId={this.state.trailer && this.state.trailer.id}
                        vehicleSelected={this.onTrailerSelected}
                        companyId={this.props.companyId}/>
            </FormModal>)
    }

    onDriverSelected(driver) {
        this.setState({
            driver
        });
    }

    onTruckSelected(truck) {
        this.setState({
            truck
        });
    }

    onTrailerSelected(trailer) {
        console.log(trailer);
        this.setState({
            trailer
        });
    }

    save() {
        this.props.onSave(this.state.driver, this.state.truck, this.state.trailer);
    }
}

const Driver = ({contract}) =>
    <List>
        <List.Item>
            <List.Icon name={"user"}/>
            {contract.driver && <List.Content>{contract.driver && contract.driver.name}
                {contract.needAcknowledge && <Label color='yellow' size={'small'}>{I18n.get('not acknowledged yet')}</Label>}
            </List.Content>}
            {!contract.driver && <List.Content>{I18n.get("No driver assigned")}</List.Content>}
        </List.Item>
        <List.Item>
            <List.Icon name={"truck"}/>
            <List.Content>{contract.truck || I18n.get("No truck assigned")}</List.Content>
        </List.Item>
        <List.Item>
            <List.Icon name={"truck"}/>
            <List.Content>{contract.trailer || I18n.get("No trailer assigned")}</List.Content>
        </List.Item>
    </List>;

function TransportStatus({contract}) {
    return <Step.Group fluid size={"mini"}>
        <Step content={I18n.get("Created")}
              active={contract.status === "CREATED" || contract.status === "DRAFT"}/>
        <Step content={I18n.get("Ongoing")} active={contract.status === "IN_PROGRESS"}/>
        <Step content={I18n.get("Done")} active={contract.status === "DONE"}/>
        <Step content={I18n.get("Archived")} active={contract.status === "ARCHIVED"}/>
    </Step.Group>;
}

function OrderStatus({contract}) {
    return <Step.Group fluid size={"mini"}>
        <Step content={I18n.get("Sent")} active={contract.orderStatus === 'ORDER_SENT'} />
        <Step content={I18n.get("Accepted")} active={contract.orderStatus === 'ORDER_ACCEPTED'} />
        <Step content={I18n.get("Planned")} active={contract.orderStatus === 'PLANNED'} />
        <Step content={I18n.get("Ongoing")} active={contract.orderStatus === 'IN_PROGRESS'}/>
        <Step content={I18n.get("Done")} active={contract.orderStatus === 'DONE'} />
    </Step.Group>
}

function isOrderStatusOrAfter(actual, compare) {
    const orderStatuses = ['DRAFT',
        'ORDER_SENT',
        'ORDER_ACCEPTED',
        'PLANNED',
        'IN_PROGRESS',
        'DONE',
        'CANCELLED'];
    return orderStatuses.indexOf(actual) >= orderStatuses.indexOf(compare);
}

function isContractStatusOrAfter(actual, compare) {
    const contractStatuses = ['DRAFT',
        'CREATED',
        'IN_PROGRESS',
        'DONE',
        'ARCHIVED'];
    return contractStatuses.indexOf(actual) >= contractStatuses.indexOf(compare);
}

function EcmrMap({contract}) {
    const ref = useRef();

    useEffect(() => {
        const google = window.google;
        const map = new google.maps.Map(ref.current);
        const bounds = new google.maps.LatLngBounds();
        const markerLength = contract.events
            .filter(e => e.geoposition)
            .map(e => {
                const {geoposition: {latitude, longitude}} = e;
                const marker = new google.maps.Marker({
                    position: new google.maps.LatLng({
                        lat: latitude,
                        lng: longitude
                    }),
                    map: map,
                    title: eventText(e),
                    label: e.site === 'pickup' ? "1" : "2"
                });
                bounds.extend(marker.position);
            }).length;

        google.maps.event.addListenerOnce(map, 'bounds_changed', function (event) {
            map.setZoom(Math.min(15, map.getZoom()));
        });


        map.fitBounds(bounds);
    });

    return <div ref={ref} id="map" style={{width: "100%", height: "150px"}}/>;
}

function OptionalEcmrMap({contract}) {
    const hasGeoinfo = (contract.events || []).findIndex(e => !!e.geoposition) !== -1;

    return hasGeoinfo ? <EcmrMap contract={contract}/> : <div/>
}

class Transport extends Component {
    fileInputRef = React.createRef()

    constructor(props) {
        super(props);

        this.state = {
        };
        this.fileChange = this.fileChange.bind(this);
        this.acceptOrder = this.acceptOrder.bind(this);
        this.delete = this.delete.bind(this);
        this.assignDriverVehicles = this.assignDriverVehicles.bind(this);
    }

    async componentDidMount() {
        const username = (await getCurrentUser()).username;

        const response = await client.graphql({query: queries.getContract, variables: {
            "id": this.props.match.params.id
        }});
        const contract = response.data.getContract;

        this.setState({
            contract: contract,
            isOrderCarrier: contract.orderCarrier === username
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
            const initialCreator = contract.orderOwner || contract.owner;
            result[initialCreator] = contract.creator.name;
        }
        return result;
    }

    render() {
        const {contract, isOrderCarrier} = this.state;
        const {viewOrder} = this.props;
        const viewTransport = !viewOrder;

        if (!contract) {
            return (<div>loading</div>);
        }

        const goods =
            <List>
                {contract.loads.map((load) =>
                    <List.Item>
                        {load.quantity} {I18n.get(load.category)}
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

        const deletedAttachments = contract.events.filter(e => e.type === 'DeleteAttachment').map(e => e.deletesAttachments);
        const attachments = contract.events
            .filter(e => e.type === 'AddAttachment' && deletedAttachments.indexOf(e.createdAt) === -1)
            .map(e => (e.attachments || []).map(a => ({event: e, attachment: a}))).flat()
        const cmrId = this.getCmrId(contract)

        const orderStatus = contract.orderStatus;

        return (
            <div>
                <Button.Group floated={'right'} style={{"marginLeft": 5}}>
                    <Button size={"mini"} onClick={() => this.componentDidMount()} icon={"refresh"}/>
                </Button.Group>

                {
                    viewTransport && contract.driverDriverId && contract.carrierUsername === "-" &&
                    <Message warning>
                        <Message.Header>{I18n.get('Transport assigned to a driver that is not yet linked')}</Message.Header>
                        <p>{I18n.get('The driver needs to enter the association code in the app, please see the drivers page.')}</p>
                    </Message>
                }

                {
                    viewOrder && isOrderCarrier && isOrderStatusOrAfter(orderStatus, 'ORDER_ACCEPTED') &&
                    <Message warning>
                        <Message.Header>{I18n.get('You are viewing the order of a transport')}</Message.Header>
                        <p><Link to={`/transports/${contract.id}`}>{I18n.get('View related transported')}</Link></p>
                    </Message>
                }

                {viewOrder && <Button.Group floated='right'>
                    {(orderStatus === 'ORDER_SENT' && isOrderCarrier) && <Button onClick={() => this.setState({confirmAcceptOrder: true})}>
                        <Icon name='check circle outline'/>
                        {I18n.get('Accept order')}
                    </Button>}
                </Button.Group>
                }

                {viewTransport && <Button.Group floated='right'>
                    <Button onClick={() => this.showAssignDriver()}>
                        <Icon name='truck'/>
                        {I18n.get('Assign driver / vehicles')}
                    </Button>
                    {!isContractStatusOrAfter(contract.status, 'DONE') && <Button onClick={() => this.edit()}>
                        <Icon name='edit'/>
                        {I18n.get('Edit')}
                    </Button>}
                    <Button onClick={() => this.copy()}>
                        <Icon name='copy'/>
                        {I18n.get('Copy')}
                    </Button>
                    <Button onClick={() => this.setState({confirmDelete: true})}>
                        <Icon name='delete'/>
                        {I18n.get('Delete')}
                    </Button>
                </Button.Group>
                }

                <Header as={'h1'}>
                    {viewOrder && <Header.Content>{I18n.get('Order {number}').replace('{number}', contract.openecmrId ||  contract.id.substring(0, 8))}</Header.Content>}
                    {viewTransport && <Header.Content>{I18n.get('Transport {number}').replace('{number}', contract.openecmrId || contract.id.substring(0, 8))}</Header.Content>}
                    <Header.Subheader>
                        {I18n.get('Created by {creator} on {date}')
                            .replace('{creator}', contract.creator ? contract.creator.name : contract.owner)
                            .replace('{date}', moment(contract.createdAt).format("LLLL"))}
                    </Header.Subheader>
                </Header>

                <TransportStatus contract={contract} />

                <Segment>

                    <Grid columns={16} stackable>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <Address address={contract.shipper} icon={'building'} label={I18n.get('Shipper')}/>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Address address={contract.carrier} icon={'truck'} label={I18n.get('Carrier')}/>
                            </Grid.Column>
                            <Grid.Column width={4}>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Wrapper apiKey={MAPS_API_KEY}>
                                    <OptionalEcmrMap contract={contract}/>
                                </Wrapper>
                            </Grid.Column>
                        </Grid.Row>
                        {contract.orderStatus && <Grid.Row>
                            <Grid.Column width={8}>
                                <Header as={'h5'}>
                                    <Icon name={"check circle outline"}/>
                                    <Header.Content>{I18n.get("Order status")}</Header.Content>
                                </Header>
                                <OrderStatus contract={contract} />
                            </Grid.Column>
                        </Grid.Row>}
                    </Grid>
                </Segment>
                <Segment>
                    <Grid columns={5} divided stackable>
                        <Grid.Row divided>
                            <Grid.Column><Header as={'h5'}>{I18n.get('Activity')}</Header></Grid.Column>
                            <Grid.Column><Header as={'h5'}>{I18n.get('Address')}</Header></Grid.Column>
                            <Grid.Column><Header as={'h5'}>{I18n.get('Loads')}</Header></Grid.Column>
                            <Grid.Column><Header as={'h5'}>{I18n.get('Arrival')}</Header></Grid.Column>
                            <Grid.Column><Header as={'h5'}>{I18n.get('Driver')}</Header></Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Label circular={true}>1</Label> {I18n.get('Pickup')}
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
                                <Label circular={true}>2</Label> {I18n.get('Delivery')}
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
                <ViewPhoto open={!!this.state.attachmentPhoto} photo={this.state.attachmentPhoto} close={() => this.setAttachmentPhoto(null)}/>
                <Grid columns={2} stackable>
                    <Grid.Row stretched>
                        <Grid.Column>
                            <Segment>
                                <Header as={'h4'}>{I18n.get('Documents')}</Header>
                                <Grid columns={2} divided stackable>
                                    <Grid.Row divided>
                                        <Grid.Column width={4}><Header
                                            as={'h5'}>{I18n.get('Type')}</Header></Grid.Column>
                                        <Grid.Column width={6}><Header
                                            as={'h5'}>{I18n.get('Name')}</Header></Grid.Column>
                                        <Grid.Column width={6}><Header
                                            as={'h5'}>{I18n.get('Description')}</Header></Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column width={4}>
                                            <Icon name='file'/> {I18n.get('Consignment note')}
                                        </Grid.Column>
                                        <Grid.Column width={6}>
                                            <MyLink
                                                onClick={() => this.downloadPdf()}>{`cmr-${cmrId}.pdf`}</MyLink>&nbsp;
                                            <Loader size='mini' active={this.state.downloadingPdf} inline/>
                                        </Grid.Column>
                                        <Grid.Column width={6}/>
                                    </Grid.Row>
                                    {
                                        attachments.map(({event, attachment}) =>
                                            (<Grid.Row>
                                                <Grid.Column width={4}>
                                                    <Icon name='file'/> {I18n.get('Document')}
                                                </Grid.Column>
                                                <Grid.Column width={6}>
                                                    <MyLink
                                                        onClick={() => this.openOrDownloadDocument(attachment)}>{attachment.filename}</MyLink>&nbsp;
                                                    <Loader size='mini' active={this.state.downloading === attachment}
                                                            inline/>
                                                    <Icon name={"delete"} style={{cursor: "pointer"}}
                                                          onClick={() => this.deleteAttachment(event)}/>
                                                </Grid.Column>
                                                <Grid.Column width={6}>{event.attachmentDescription}</Grid.Column>
                                            </Grid.Row>)
                                        )
                                    }
                                    <Grid.Row>
                                        <Grid.Column width={16}>
                                            {this.state.uploadErrorTooBig && <Message negative>
                                                <Message.Header>{I18n.get("File too big")}</Message.Header>
                                                <p>{I18n.get("You can only upload files smaller than 1MB")}</p>
                                            </Message>}
                                            <Button primary disabled={this.state.uploading}
                                                    loading={this.state.uploading}
                                                    onClick={() => this.fileInputRef.current.click()}>{I18n.get("Add Document")}</Button>
                                            <input
                                                ref={this.fileInputRef}
                                                type="file"
                                                accept="image/jpeg,application/pdf"
                                                hidden
                                                onChange={this.fileChange}
                                            />
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
                                   companyId={this.props.company && this.props.company.companyId}
                                   driverId={this.state.contract.driverDriverId}
                                   truckVehicleId={this.state.contract.truckVehicleId}
                                   trailerVehicleId={this.state.contract.trailerVehicleId}
                                   onSave={this.assignDriverVehicles}
                />
                <Confirm
                    open={this.state.confirmAcceptOrder}
                    content={I18n.get("Accept the order and add it to your list of transports?")}
                    cancelButton={I18n.get("Cancel")}
                    confirmButton={I18n.get("Confirm")}
                    onCancel={() => this.setState({confirmAcceptOrder: false})}
                    onConfirm={this.acceptOrder}
                />
                <Confirm
                    open={this.state.confirmDelete}
                    content={I18n.get("Are you sure you want to delete this transport? It will be gone permanently.")}
                    cancelButton={I18n.get("Cancel")}
                    confirmButton={() => <Button color='red' content={I18n.get("Confirm")} onClick={this.delete}/>}
                    onCancel={() => this.setState({confirmDelete: false})}
                />
            </div>

        );
    }

    getCmrId(contract) {
        return contract.openecmrId || contract.id.substring(0, 8);
    }

    copy() {
        const {history} = this.props;
        history.push('/transports-new/' + this.state.contract.id);
    }

    edit() {
        const {history} = this.props;
        history.push('/transports/edit/' + this.state.contract.id);
    }

    async acceptOrder() {
        this.setState({
            confirmAcceptOrder: false
        });
        const {contract} = this.state;
        contract.orderStatus = 'ORDER_ACCEPTED';

        await doUpdateContract({
            id: contract.id,
            orderStatus: 'ORDER_ACCEPTED',
            status: 'CREATED',
            owner: (await getCurrentUser()).username
        });

        this.setState({
            contract
        });
    }

    setAttachmentPhoto(photo) {
        this.setState({
            attachmentPhoto: photo
        })
    }

    async openOrDownloadDocument(attachment) {
        if (attachment.mimeType && attachment.mimeType.startsWith('image/')) {
            this.setAttachmentPhoto(attachment.location);
        } else {
            this.setState({
                downloading: attachment
            });
            let s3file = await Storage.get(attachment.location.key, {download: true});
            this.openBlob(s3file.Body, attachment.filename);
            this.setState({
                downloading: null
            });
        }
    }

    openBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.target = "_blank";
        const clickHandler = () => {
            setTimeout(() => {
                URL.revokeObjectURL(url);
                a.removeEventListener('click', clickHandler);
            }, 150);
        };
        a.addEventListener('click', clickHandler, false);
        a.click();
    }

    async fileChange(e) {
        this.setState({
            uploadErrorTooBig: false,
            uploading: true
        });

        const file = e.target.files[0];
        if (file.size > MAX_FILE_SIZE) {
            this.setState({
                uploadErrorTooBig: true
            });
        } else {
            const extension = this.extension(file);
            const uploadFilename = uuidv4() + "." + extension;
            const result = await Storage.put(uploadFilename, file);
            const attachment = {
                location: {
                    bucket: 'bucket',
                    region: 'eu-central-1',
                    key: result.key
                },
                size: file.size,
                filename: file.name,
                mimeType: file.type,
                extension
            }

            const {contract} = this.state;
            if (!contract.events) {
                contract.events = [];
            }
            const now = moment().toISOString();
            contract.events.push({
                author: {
                    username: (await getCurrentUser()).username
                },
                type: 'AddAttachment',
                createdAt: now,
                attachments: [attachment]
            });
            await doUpdateContract({
                id: contract.id,
                events: contract.events
            });
            this.setState({
                contract
            });
        }
        this.setState({
            uploading: false
        });
    }

    async deleteAttachment(event) {
        // TODO: implement removal of attachments
        // await Storage.remove(event.attachments[0].location.key);
        const {contract} = this.state;
        if (!contract.events) {
            contract.events = [];
        }
        const now = moment().toISOString();
        contract.events.push({
            author: {
                username: (await getCurrentUser()).username
            },
            type: 'DeleteAttachment',
            createdAt: now,
            deletesAttachments: event.createdAt
        });
        await doUpdateContract({
            id: contract.id,
            events: contract.events
        });
        this.setState({
            contract
        });
    }

    extension(file) {
        const split = file.name.split(".");
        return split[split.length - 1];
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

    async assignDriverVehicles(driver, truck, trailer) {
        console.log(driver);

        const {contract} = this.state;
        const now = moment().toISOString();
        const username = (await getCurrentUser()).username

        const update = {};
        const events = contract.events ? [...contract.events] : [];

        let changed = false;
        if (contract.truckVehicleId !== (truck ? truck.id : null)) {
            changed = true;
            if (truck) {
                update.truckVehicleId = truck.id;
                update.truck = truck.licensePlateNumber;
            } else {
                update.truckVehicleId = null;
                update.truck = null;
            }
        }

        if (contract.trailerVehicleId !== (trailer ? trailer.id : null)) {
            changed = true;
            if (trailer) {
                update.trailerVehicleId = trailer.id;
                update.trailer = trailer.licensePlateNumber;
            } else {
                update.trailerVehicleId = null;
                update.trailer = null;
            }
        }

        if (contract.driverDriverId !== (driver ? driver.id : null)) {
            changed = true;
            if (driver) {
                update.driverDriverId = driver.id;
                update.driver = {
                    name: driver.name,
                    username: driver.carrier
                };
                update.carrierUsername = driver.carrier ? driver.carrier : "-";
                events.push({
                    author: {
                        username: username
                    },
                    type: 'AssignDriver',
                    createdAt: now,
                    assignedDriver: update.driver
                });
                if (contract.orderStatus && !isOrderStatusOrAfter(contract.orderStatus, 'PLANNED')) {
                    update.orderStatus = 'PLANNED';
                }
            } else {
                update.driverDriverId = null;
                update.driver = null;
                update.carrierUsername = "-";
                events.push({
                    author: {
                        username: username
                    },
                    type: 'AssignDriver',
                    createdAt: now
                });
            }
        }

        this.hideAssignDriver();

        if (changed) {
            update.id = contract.id;
            update.events = events;

            const newContract = {
                ...contract,
                ...update
            };
            newContract.updatedAt = now;
            this.setState({
                contract: newContract
            });
            await doUpdateContract(update);
        }
    }

    async delete() {
        const {history} = this.props;
        await client.graphql({query: mutations.deleteContract, variables: {
            "input": {
                "id": this.props.match.params.id
            }
        }});

        history.push('/transports');
    }

    async downloadPdf() {
        if (this.state.downloadingPdf) {
            return;
        }
        this.setState({
            downloadingPdf: true
        });
        const response = await client.graphql({query: queries.rpdfexport, variables: {
            "id": this.props.match.params.id
        }});
        this.setState({
            downloadingPdf: false
        });

        const linkSource = `data:application/pdf;base64,${response.data.rpdfexport}`;
        const fileName = `cmr-${this.getCmrId(this.state.contract)}.pdf`;

        const blob = await fetch(linkSource).then(res => res.blob());
        this.openBlob(blob, fileName);
    }
}

export default Transport;