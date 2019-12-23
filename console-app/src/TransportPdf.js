import React, {Component} from "react";
import {API, graphqlOperation} from "aws-amplify";
import moment from 'moment';
import * as queries from "./graphql/queries";
import "./TransportPdf.css"
import {Container, Header, Icon, Label, List} from "semantic-ui-react";

const PdfHeader = ({label, icon}) => (
    <Header as={'h5'}>
        <Icon name={icon} />
        <Header.Content>{label}</Header.Content>
    </Header>
);

const Address = ({address, label, icon}) => (
    <div>
        { label &&
        <PdfHeader label={label} icon={icon}/>
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
    </div>
);

const Row = ({children}) => (
    <div className={"row"}>
        <div className={"cell"}>
            {children[0]}
        </div>
        <div className={"cell"}>
            {children[1]}
        </div>
    </div>
);

const LicensePlates = ({contract: {driver, trailer, truck}}) => (<div>
    <PdfHeader icon={'truck'} label={"17. Successive carriers"}/>
    <div>Driver: {driver.name}</div>
    <div>Truck: {truck}</div>
    <div>Trailer: {trailer}</div>
</div>);

export default class TransportPdf extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contract: null
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
            return null;
        }

        return (
            <div className={"pdf"}>
                <Row>
                    <Address address={contract.shipper} icon={'building'} label={'1. Shipper'}/>
                    <span/>
                </Row>
                <Row>
                    <Address address={contract.delivery} icon={'building'} label={'2. Consignee'}/>
                    <Address address={contract.carrier} icon={'truck'} label={'16. Carrier'}/>
                </Row>
                <Row>
                    <Address address={contract.delivery} icon={'building'} label={'3. Place designated for delivery of goods (place, country)'}/>
                    <LicensePlates contract={contract}/>
                </Row>
            </div>
        );
    }
}