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
import {API, graphqlOperation, Storage, Auth, I18n} from 'aws-amplify';
import moment from 'moment/min/moment-with-locales';
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import {S3Image} from "aws-amplify-react";
import {DriverPicker} from "./NewTransport";
import { v4 as uuidv4 } from 'uuid';

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
        default:
            return I18n.get('completed {eventType}').replace('{eventType}', event.type);
    }
};

const ViewPhoto = ({photo, open, close}) => (<Modal open={open} onClose={close} closeIcon>
    <Header icon={'archive'} content={`Photo ${photo && photo.key}`} />
    <Modal.Content>
        <div style={{textAlign: "center"}}>
        {photo && <S3Image
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
                                theme={{photoImg: {width: '100px', height: '100px', marginRight: 5, cursor: "pointer"}}}
                                resizeMode={'center'}
                                level={"public"}
                                imgKey={photo.key}/>)
                    }
                    </div>
            </List>
        }
    </div>;

const MyLink = ({onClick, children}) => <span onClick={onClick} style={{color: "#4183c4", cursor: "pointer"}}>{children}</span>

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
    fileInputRef = React.createRef()

    constructor(props) {
        super(props);

        this.state = {
        };
        this.fileChange = this.fileChange.bind(this);
        this.acceptOrder = this.acceptOrder.bind(this);
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
        const cmrId = contract.openecmrId ? contract.openecmrId : contract.id.substring(0, 8)

        const orderStatus = contract.orderStatus;

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
                    {orderStatus === 'ORDER_SENT' && <Button onClick={() => this.acceptOrder()}>
                        <Icon name='check circle outline'/>
                        {I18n.get('Accept order')}
                    </Button>}
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

                    <Grid columns={3} stackable>
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
                <Grid columns={2} stackable>
                    <Grid.Row stretched>
                        <Grid.Column>
                            <Segment>
                                <Header as={'h4'}>{I18n.get('Documents')}</Header>
                                <Grid columns={2} divided stackable>
                                    <Grid.Row divided>
                                        <Grid.Column width={4}><Header as={'h5'}>{I18n.get('Type')}</Header></Grid.Column>
                                        <Grid.Column width={12}><Header as={'h5'}>{I18n.get('Name')}</Header></Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column width={4}>
                                            <Icon name='file'/> {I18n.get('Consignment note')}
                                        </Grid.Column>
                                        <Grid.Column width={12}>
                                            <MyLink onClick={() => this.downloadPdf()}>{`cmr-${cmrId}.pdf`}</MyLink>&nbsp;
                                            <Loader size='mini' active={this.state.downloadingPdf} inline/>
                                        </Grid.Column>
                                    </Grid.Row>
                                    {
                                        attachments.map( ({event, attachment}) =>
                                            (<Grid.Row>
                                                <Grid.Column width={4}>
                                                    <Icon name='file'/> {I18n.get('Document')}
                                                </Grid.Column>
                                                <Grid.Column width={12}>
                                                    <MyLink onClick={() => this.downloadDocument(attachment)}>{attachment.filename}</MyLink>&nbsp;
                                                    <Loader size='mini' active={this.state.downloading === attachment} inline/>
                                                    <Icon name={"delete"} style={{cursor: "pointer"}} onClick={() => this.deleteAttachment(event)}/>
                                                </Grid.Column>
                                            </Grid.Row>)
                                        )
                                    }
                                    <Grid.Row>
                                        <Grid.Column width={16}>
                                            {this.state.uploadErrorTooBig && <Message negative>
                                                <Message.Header>{I18n.get("File too big")}</Message.Header>
                                                <p>{I18n.get("You can only upload files smaller than 1MB")}</p>
                                            </Message>}
                                            <Button primary disabled={this.state.uploading} loading={this.state.uploading}
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

    async acceptOrder() {
        const {contract} = this.state;
        contract.orderStatus = 'ORDER_ACCEPTED';

        await API.graphql(graphqlOperation(mutations.updateContract, {
            "input": {
                id: contract.id,
                orderStatus: 'ORDER_ACCEPTED'
            }
        }));

        this.setState({
            contract
        });
    }

    async downloadDocument(attachment) {
        this.setState({
            downloading: attachment
        });
        let s3file = await Storage.get(attachment.location.key, {download: true});
        const url = URL.createObjectURL(s3file.Body);
        const a = document.createElement('a');
        a.href = url;
        a.download = attachment.filename;
        const clickHandler = () => {
            setTimeout(() => {
                URL.revokeObjectURL(url);
                a.removeEventListener('click', clickHandler);
            }, 150);
        };
        a.addEventListener('click', clickHandler, false);
        a.click();
        this.setState({
            downloading: null
        });
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
                    username: (await Auth.currentAuthenticatedUser()).getUsername()
                },
                type: 'AddAttachment',
                createdAt: now,
                attachments: [attachment]
            });
            this.setState({
                contract
            });

            await API.graphql(graphqlOperation(mutations.updateContract, {
                "input": {
                    id: contract.id,
                    events: contract.events
                }
            }));
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
                username: (await Auth.currentAuthenticatedUser()).getUsername()
            },
            type: 'DeleteAttachment',
            createdAt: now,
            deletesAttachments: event.createdAt
        });
        this.setState({
            contract
        });
        await API.graphql(graphqlOperation(mutations.updateContract, {
            "input": {
                id: contract.id,
                events: contract.events
            }
        }));
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
        contract.updatedAt = now;
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