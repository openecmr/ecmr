import React, {Component} from "react";
import {API, graphqlOperation} from "aws-amplify";
import * as queries from "./graphql/queries";
import "./TransportPdf.css"
import {Header, Icon, List, Table} from "semantic-ui-react";
import {S3Image} from "aws-amplify-react";

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

const Row = ({children, max}) => (
    <div className={"row " + (max ? ' max' : '')}>
        {React.Children.map(children, c =>
            <div className={"cell"}>
                {c}
            </div>
        )}
    </div>
);

const LicensePlates = ({contract: {driver, trailer, truck}}) => (<div>
    <PdfHeader icon={'truck'} label={"17. Successive carriers"}/>
    <div>Driver: {driver.name}</div>
    <div>Truck: {truck}</div>
    <div>Trailer: {trailer}</div>
</div>);


const ListOfLoads = ({loads}) => (
    <Table className="App-text-with-newlines" compact='very'>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {loads.map((g, index) =>
                <Table.Row key={index}>
                    <Table.Cell>{g.category}</Table.Cell>
                    <Table.Cell>{g.quantity}</Table.Cell>
                    <Table.Cell>{g.description}</Table.Cell>
                </Table.Row>

        )}
        </Table.Body>
    </Table>
);

const Signature = ({event, label}) => (
    <div>
        <PdfHeader icon={'building'} label={label}/>
        {event &&
        <S3Image
            theme={{photoImg: {width: '100px', height: '100px'}}}
            resizeMode={'center'}
            level={"public"}
            imgKey={event.signature.signatureImageSignatory.key}/>
        }
        {!event &&
            <div style={{width: "100px", height: "100px"}}/>
        }
    </div>
);

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
                <Row max={true}>
                    <ListOfLoads loads={contract.loads}/>
                </Row>
                <Row>
                    <Signature event={this.selectSignature(contract.events, 'pickup')}
                               label={'22. Signature and stamp of the sender'}/>
                    <Signature event={null}
                               label={'23. Signature and stamp of the carrier'}/>
                    <Signature event={this.selectSignature(contract.events, 'delivery')}
                               label={'24. Signature and stamp of the consignee'}/>
                </Row>
            </div>
        );
    }

    selectSignature(events, site) {
        console.log(events);
        const match = events.filter(e => (e.type === 'LoadingComplete' || e.type === 'UnloadingComplete') && e.site === site);
        return match.length === 0 ? null : match[0];
    }
}