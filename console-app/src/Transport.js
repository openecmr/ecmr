import {Component} from "react";
import React from "react";
import {
    Button,
    Container,
    Grid,
    Header,
    Icon,
    Step,
    List
} from "semantic-ui-react";
import { API, graphqlOperation } from 'aws-amplify';
import moment from 'moment';
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";

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

    renderAddress(address, label, icon) {
        return (
            <Container>
                <Header as={'h5'}>
                    <Icon name={icon} />
                    <Header.Content>{label}</Header.Content>
                </Header>
                <List>
                    <List.Item>
                        <List.Content><strong>{address.name}</strong></List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>{address.address}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>{address.postalCode}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>{address.city}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>{address.country}</List.Content>
                    </List.Item>
                </List>
            </Container>
        )
    }

    render() {
        const {contract} = this.state;

        if (!contract) {
            return (<div>loading</div>);
        }

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
                </Button.Group>
                <Header as={'h1'}>
                    <Header.Content>Transport {contract.id.substring(0,8)}</Header.Content>
                    <Header.Subheader>Created by {contract.owner} on {moment(contract.createdAt).format("LLLL")}</Header.Subheader>
                </Header>



                <Grid columns={3}>
                    <Grid.Row columns={1}>
                        <Grid.Column>
                            <Step.Group>
                                <Step content='Created' active/>
                                <Step content='Ongoing' />
                                <Step content='Done' />
                                <Step content='Archived' />
                            </Step.Group>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row divided>
                        <Grid.Column>
                            {this.renderAddress(contract.shipper, 'Shipper', 'building')}
                        </Grid.Column>
                        <Grid.Column>
                            {this.renderAddress(contract.carrier, 'Carrier', 'truck')}
                        </Grid.Column>
                        <Grid.Column>
                            Transport code
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
}

export default Transport;