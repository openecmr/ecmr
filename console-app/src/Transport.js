import {Component} from "react";
import React from "react";
import {
    Button,
    Container,
    Grid,
    Header,
    Icon,
    Step,
    List, Table, Label, Divider, Segment, Comment
} from "semantic-ui-react";
import { API, graphqlOperation } from 'aws-amplify';
import moment from 'moment';
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import {S3Image} from "aws-amplify-react";

const Address = ({address, label, icon}) => (
    <Container>
        { label &&
            <Header as={'h5'}>
            <Icon name={icon} />
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

const Events = ({events}) => (
    <Container>
        <Comment.Group>
            <Header as={'h4'}>Events</Header>
            {
                events.map(event => (
                    <Comment>

                        <Comment.Content>
                            <Comment.Author as={'a'}>{event.author.username}</Comment.Author>
                            <Comment.Metadata>
                                <div>{moment(event.createdAt).format('llll')}</div>
                            </Comment.Metadata>
                            <Comment.Text>
                                {eventText(event)}
                                {
                                    (event.type === 'UnloadingComplete' || event.type === 'LoadingComplete') &&
                                    <S3Image
                                             theme={{ photoImg: { width: '100px', height: '100px' } }}
                                             resizeMode={'center'}
                                             level={"public"}
                                             imgKey={event.signature.signatureImageSignatory.key} />
                                }
                            </Comment.Text>
                        </Comment.Content>
                    </Comment>
                ))
            }
        </Comment.Group>
    </Container>
);

class Transport extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
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
                    <List.Item>{load.quantity} {load.category}, {load.description}</List.Item>
                )}
            </List>;

        return (
            <Container>
                <Button.Group floated='right'>
                    <Button onClick={() => this.delete()}>
                        <Icon name='delete' />
                        Delete
                    </Button>
                    <Button onClick={() => this.copy()}>
                        <Icon name='copy' />
                        Copy
                    </Button>
                    <Button onClick={() => this.downloadPdf()} disabled={this.state.downloadingPdf} loading={this.state.downloadingPdf}>
                        <Icon name='file' />
                        View CMR
                    </Button>
                </Button.Group>
                <Header as={'h1'}>
                    <Header.Content>Transport {contract.id.substring(0,8)}</Header.Content>
                    <Header.Subheader>Created by {contract.owner} on {moment(contract.createdAt).format("LLLL")}</Header.Subheader>
                </Header>

                <Step.Group>
                    <Step content='Created' active={contract.status === 'CREATED' || contract.status === 'DRAFT'}/>
                    <Step content='Ongoing'  active={contract.status === 'IN_PROGRESS'} />
                    <Step content='Done'  active={contract.status === 'DONE'} />
                    <Step content='Archived'  active={contract.status === 'ARCHIVED'}/>
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
                                <Address address={contract.pickup} />
                            </Grid.Column>
                            <Grid.Column>
                                {goods}
                            </Grid.Column>
                            <Grid.Column>
                                {contract.arrivalDate}
                            </Grid.Column>
                            <Grid.Column>
                                {contract.carrierUsername}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Label circular={true}>2</Label>Delivery
                            </Grid.Column>
                            <Grid.Column>
                                <Address address={contract.delivery} />
                            </Grid.Column>
                            <Grid.Column>
                                {goods}
                            </Grid.Column>
                            <Grid.Column>
                                {contract.deliveryDate}
                            </Grid.Column>
                            <Grid.Column>
                                {contract.carrierUsername}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment>
                                <Header as={'h4'}>Documents and photos</Header>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment>
                                <Events events={contract.events}/>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>

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
        this.setState({
            downloadingPdf: true
        });
        const response = await API.graphql(graphqlOperation(queries.pdfexport, {
            "id": this.props.match.params.id
        }));
        this.setState({
            downloadingPdf: false
        });
        window.location.href = 'data:application/octet-stream;base64,' + response.data.pdfexport;
    }
}

export default Transport;