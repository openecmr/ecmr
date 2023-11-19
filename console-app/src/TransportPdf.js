import React, {Component} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {I18n} from 'aws-amplify/utils';
import * as queries from "./graphql/queries";
import "./TransportPdf.css"
import {Header, Icon, List, Table} from "semantic-ui-react";
import {S3Image} from "aws-amplify-react";
import moment from "moment/min/moment-with-locales.min";

const PdfHeader = ({label, icon}) => (
    <Header as={'h5'}>
        {icon && <Icon name={icon} />}
        <Header.Content>{label}</Header.Content>
    </Header>
);

const Address = ({address, label, icon, children}) => (
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
        {children}
    </div>
);

const Row = ({children, max, fill}) => (
    <div className={"row " + (max ? ' max' : '') + ' ' + (fill ? ' fill' : '')}>
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
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Method of packaging</Table.HeaderCell>
                <Table.HeaderCell>Nature of the goods</Table.HeaderCell>
                <Table.HeaderCell>Net weight (kg)</Table.HeaderCell>
                <Table.HeaderCell>Volume (m³)</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {loads.map((g, index) =>
                <Table.Row key={index}>
                    <Table.Cell>{g.quantity}</Table.Cell>
                    <Table.Cell>{g.category}</Table.Cell>
                    <Table.Cell>{g.description}</Table.Cell>
                    <Table.Cell>{g.netWeight}</Table.Cell>
                    <Table.Cell>{g.volume}</Table.Cell>
                </Table.Row>

        )}
        </Table.Body>
    </Table>
);

const Legal = ({id, openecmrId}) => (
    <div>
        <div className={"inner-row"} style={{fontWeight: "bold"}}>
            <div className={"inner-cell"}>International consignment note</div>
            <div className={"inner-cell"}>
                {/*Internationale vrachtbrief*/}
            </div>
        </div>

        <div className={"inner-row"}>
            <div className={"inner-cell"}>
                Transport id: {id}
                {openecmrId && <br/>}
                {openecmrId && `Open e-CMR id: ${openecmrId}`}
            </div>
        </div>

        <div className={"inner-row"} >
            <div className={"inner-cell small-text"}>
                This carriage is subject, notwithstanding any clause to the contrary, to the Convention on the Contract for the International Carriage of Goods by Road (CMR)
            </div>
            <div className={"inner-cell small-text"}>
                {/*Dit vervoer, ongeacht enig tegenstrijdig beding, is onderworpen aan de bepalingen van het CMR-verdrag.*/}
            </div>
        </div>
    </div>
);

const Signature = ({event, label}) => (
    <div>
        <PdfHeader icon={'building'} label={label}/>
        {event &&
            <React.Fragment>
                <S3Image
                    theme={{photoImg: {width: '100px', height: '100px'}}}
                    resizeMode={'center'}
                    level={"public"}
                    imgKey={event.signature.signatureImageSignatory.key}/>
                <div>{event.signature.signatoryName} {event.signature.signatoryEmail && <span>({event.signature.signatoryEmail})</span>}</div>
                <div>{moment(event.createdAt).format('lll')}</div>
            </React.Fragment>
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
                    <Legal id={contract.id.substring(0, 8)} openecmrId={contract.openecmrId}/>
                </Row>
                <Row>
                    <Address address={contract.delivery} icon={'building'} label={'2. Consignee'}/>
                    <Address address={contract.carrier} icon={'truck'} label={'16. Carrier'}/>
                </Row>
                <Row>
                    <Address address={contract.delivery} icon={'building'} label={'3. Place designated for delivery of goods (place, country)'}>
                        <div>
                            Planned delivery date: {moment(contract.deliveryDate).format('ll')}
                            {contract.deliveryTime &&
                            <span style={{paddingLeft: 5}}>
                                    {I18n.get('({start} to {end})')
                                        .replace('{start}', contract.deliveryTime.start)
                                        .replace('{end}', contract.deliveryTime.end)}</span>}
                        </div>
                    </Address>
                    <LicensePlates contract={contract}/>
                </Row>
                <Row>
                    <Address address={contract.pickup} icon={'building'} label={'4. Place and date of taking over the goods'}>
                        <div>
                            Planned pickup date: {moment(contract.arrivalDate).format('ll')}
                            {contract.arrivalTime &&
                            <span style={{paddingLeft: 5}}>{I18n.get('({start} to {end})')
                                .replace('{start}', contract.arrivalTime.start)
                                .replace('{end}', contract.arrivalTime.end)}</span>}
                        </div>
                    </Address>
                    <div>
                        <PdfHeader label={'18. Reservations and observations'}/>

                        <h5>Loading</h5>
                        {
                            contract.events
                                .filter(e => e.type === 'LoadingComplete' && e.signatoryObservation && e.signature)
                                .map(e => <div>
                                    <span>{e.signature.signatoryName}: {e.signatoryObservation}</span>
                                </div>)
                        }
                        <h5>Delivery</h5>
                        {
                            contract.events
                                .filter(e => e.type === 'UnloadingComplete' && e.signatoryObservation && e.signature)
                                .map(e => <div>
                                    <span>{e.signature.signatoryName}: {e.signatoryObservation}</span>
                                </div>)
                        }
                    </div>
                </Row>
                <Row max={true} fill={true}>
                    <ListOfLoads loads={contract.loads}/>
                </Row>
                <Row>
                    <div>
                        <PdfHeader  label={"13. Sender's instructions"}/>

                    </div>
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