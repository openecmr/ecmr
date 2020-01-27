import {Component} from "react";
import React from "react";
import {
    Button,
    Container,
    Grid,
    Header,
    Icon,
    Step,
    List, Label, Segment, Comment, Loader
} from "semantic-ui-react";
import {API, graphqlOperation} from 'aws-amplify';
import moment from 'moment';
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import {S3Image} from "aws-amplify-react";

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
                <List.Content>{address.postalCode} {address.city}, {address.country}</List.Content>
            </List.Item>
        </List>
    </Container>);

const eventText = (event) => {
    switch (event.type) {
        case 'ArrivalOnSite':
            return `arrived on ${event.site} site.`;
        case 'LoadingComplete':
            return `completed the loading.`;
        case 'UnloadingComplete':
            return `completed the unloading.`;
        default:
            return `completed ${event.type}`;
    }
};

const Events = ({driver, events}) => (
    <Container>
        <Comment.Group >
            <Header as={'h4'}>Events</Header>
            {
                events.map(event => (
                    <Comment>

                        <Comment.Content>
                            <Comment.Author as={'a'}>{driver.name}</Comment.Author>
                            <Comment.Metadata>
                                <div>{moment(event.createdAt).format('llll')}</div>
                            </Comment.Metadata>
                            <Comment.Text>
                                {eventText(event)}
                                {
                                    (event.type === 'UnloadingComplete' || event.type === 'LoadingComplete') &&
                                        <SignatureEvent event={event}/>
                                }
                            </Comment.Text>
                        </Comment.Content>
                    </Comment>
                ))
            }
        </Comment.Group>
    </Container>
);

const SignatureEvent = ({event: { signature, signatoryObservation, driverObservation }}) =>
    <div>
        {
            <List style={{paddingTop: "10px", marginLeft: "20px"}}>
                {
                    signature.signatoryName &&
                    <List.Item>
                        <List.Icon name='user' verticalAlign={"middle"}/>
                        <List.Content>
                            <List.Header>Signed by</List.Header>
                            <List.Description>{signature.signatoryName} {signature.signatoryEmail && `(${signature.signatoryEmail})`}</List.Description>
                        </List.Content>
                    </List.Item>
                }
                {
                    signatoryObservation &&
                    <List.Item>
                        <List.Icon name='warning sign' verticalAlign={"middle"} />
                        <List.Content>
                            <List.Header>Signatory observation</List.Header>
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
            </List>
        }
    </div>;

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
                        {load.volume && `, ${load.volume} m³`}
                        {load.netWeight && `, ${load.netWeight} kg`}
                        {load.loadMeters && `, ${load.loadMeters} m`}
                    </List.Item>
                )}
            </List>;

        return (
            <div>
                <Button.Group floated='right'>
                    <Button onClick={() => this.delete()}>
                        <Icon name='delete'/>
                        Delete
                    </Button>
                    <Button onClick={() => this.copy()}>
                        <Icon name='copy'/>
                        Copy
                    </Button>
                </Button.Group>
                <Header as={'h1'}>
                    <Header.Content>Transport {contract.id.substring(0, 8)}</Header.Content>
                    <Header.Subheader>Created
                        by {contract.owner} on {moment(contract.createdAt).format("LLLL")}</Header.Subheader>
                </Header>

                <Step.Group fluid size={"mini"}>
                    <Step content='Created' active={contract.status === 'CREATED' || contract.status === 'DRAFT'}/>
                    <Step content='Ongoing' active={contract.status === 'IN_PROGRESS'}/>
                    <Step content='Done' active={contract.status === 'DONE'}/>
                    <Step content='Archived' active={contract.status === 'ARCHIVED'}/>
                </Step.Group>
                <Segment>

                    <Grid columns={3}>
                        <Grid.Row>
                            <Grid.Column>
                                <Address address={contract.shipper} icon={'building'} label={'Shipper'}/>
                            </Grid.Column>
                            <Grid.Column>
                                <Address address={contract.carrier} icon={'truck'} label={'Carrier'}/>
                            </Grid.Column>
                            <Grid.Column>
                                Transport code
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Segment>
                    <Grid columns={5} divided>
                        <Grid.Row divided>
                            <Grid.Column><Header as={'h5'}>Activity</Header></Grid.Column>
                            <Grid.Column><Header as={'h5'}>Address</Header></Grid.Column>
                            <Grid.Column><Header as={'h5'}>Loads</Header></Grid.Column>
                            <Grid.Column><Header as={'h5'}>Arrival</Header></Grid.Column>
                            <Grid.Column><Header as={'h5'}>Driver</Header></Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Label circular={true}>1</Label>Pickup
                            </Grid.Column>
                            <Grid.Column>
                                <Address address={contract.pickup}/>
                            </Grid.Column>
                            <Grid.Column>
                                {goods}
                            </Grid.Column>
                            <Grid.Column>
                                <Header sub>Planned</Header>
                                On {contract.arrivalDate}<br/>
                                {contract.arrivalTime &&
                                <div>From {contract.arrivalTime.start} to {contract.arrivalTime.end}</div>}
                            </Grid.Column>
                            <Grid.Column>
                                {contract.driver.name}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Label circular={true}>2</Label>Delivery
                            </Grid.Column>
                            <Grid.Column>
                                <Address address={contract.delivery}/>
                            </Grid.Column>
                            <Grid.Column>
                                {goods}
                            </Grid.Column>
                            <Grid.Column>
                                <Header sub>Planned</Header>
                                On {contract.deliveryDate}
                                {contract.deliveryTime &&
                                <div>From {contract.deliveryTime.start} to {contract.deliveryTime.end}</div>}
                            </Grid.Column>
                            <Grid.Column>
                                {contract.driver.name}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment>
                                <Header as={'h4'}>Documents and photos</Header>
                                <Grid columns={2} divided>
                                    <Grid.Row divided>
                                        <Grid.Column><Header as={'h5'}>Type</Header></Grid.Column>
                                        <Grid.Column><Header as={'h5'}>Name</Header></Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Icon name='file'/> Consignment note
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
                                <Events events={contract.events} driver={contract.driver}/>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>

        );
    }

    copy() {
        const {history} = this.props;
        history.push('/transports-new/' + this.state.contract.id);
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