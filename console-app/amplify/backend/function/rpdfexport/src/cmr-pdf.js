
import pkg from '@react-pdf/renderer';
const { Document, Page, StyleSheet, Text, View, Font, Image } = pkg;
import React from "react";
import moment from 'moment/min/moment-with-locales.js';

const I18n = {
    get: (x) => x
}

const PdfHeader = ({label, icon, style}) => (
    <View style={{marginBottom: 5, fontWeight: "bold"}}>
        {/*{icon && <Icon name={icon} />}*/}
        <Text style={{fontWeight: "bold"}}>{label}</Text>
    </View>
);

const SubHeader = ({children}) => (
    <View style={{marginBottom: 10, fontWeight: "bold", fontSize: 6}}>
        <Text>{children}</Text>
    </View>
)

const Address = ({address, label, icon, children }) => (
    <View>
        { label &&
        <PdfHeader label={label} icon={icon}/>
        }
        <View>
            <View>
                <Text><strong>{address.name}</strong></Text>
            </View>
            <View>
                <Text>{address.address}</Text>
            </View>
            <View>
                <Text>{address.postalCode} {address.city}, {address.country}</Text>
            </View>
        </View>
        {children}
    </View>
);

const Row = ({children, max}) => (
    <View style={[styles.row, max ? styles.rowMax : null]}>
        {React.Children.map(children, (c, i) =>
            //className={"cell"}
            <View style={[styles.rowCell, i === 0 ? styles.rowCellFirst : null]}>
                {c}
            </View>
        )}
    </View>
);

const LicensePlates = ({contract: {driver, trailer, truck}}) => (<View>
    <PdfHeader icon={'truck'} label={"17. Successive carriers"}/>
    <Text>Driver: {driver.name}</Text>
    <Text>Truck: {truck || '-'}</Text>
    <Text>Trailer: {trailer || '-'}</Text>
</View>);

const Cell = ({children}) => (
    <View style={styles.cell}>
        <Text>{children}</Text>
    </View>
);

const ListOfLoads = ({loads}) => (
    <View style={styles.table}>
        <View style={[styles.tableHeaderRow]}>
            <Text style={[styles.tableCell, {textAlign: "right", width: 70}]}>Quantity</Text>
            <Text style={[styles.tableCell, {flex: 0.8}]}>Method of packaging</Text>
            <Text style={[styles.tableCell, {flex: 2}]}>Nature of the goods</Text>
            <Text style={[styles.tableCell, {textAlign: "right", width: 70}]}>Net weight (kg)</Text>
            <Text style={[styles.tableCell, {textAlign: "right", width: 70}]}>Volume (m³)</Text>
        </View>
        <View>
            {loads.map((g, index) =>
                <View style={styles.tableRow} key={index}>
                    <Text style={[styles.tableCell, {textAlign: "right", width: 70}]}>{g.quantity}</Text>
                    <Text style={[styles.tableCell, {flex: 0.8}]}>{g.category}</Text>
                    <Text style={[styles.tableCell, {flex: 2}]}>{g.description}</Text>
                    <Text style={[styles.tableCell, {textAlign: "right", width: 70}]}>{g.netWeight}</Text>
                    <Text style={[styles.tableCell, {textAlign: "right", width: 70}]}>{g.volume}</Text>
                </View>

            )}
        </View>
    </View>
);

const Legal = ({id, openecmrId}) => (
    <View>
        <View style={styles.innerRow}>
            <View style={[styles.innerCell, styles.legalHeader]}><Text>International consignment note</Text></View>
            <View style={styles.innerCell}>
                {/*Internationale vrachtbrief*/}
            </View>
        </View>

        <View style={styles.innerRow}>
            <View style={styles.innerCell}>
                <Text>Transport id: {id}</Text>
                {openecmrId && <Text>Open e-CMR id: {openecmrId}</Text>}
            </View>
        </View>

        <View style={styles.innerRow}>
            <View style={[styles.innerCell, styles.smallText]}>
                <Text>This carriage is subject, notwithstanding any clause to the contrary, to the Convention on the Contract for the International Carriage of Goods by Road (CMR)</Text>
            </View>
            <View style={[styles.innerCell, styles.smallText]}>
                {/*Dit vervoer, ongeacht enig tegenstrijdig beding, is onderworpen aan de bepalingen van het CMR-verdrag.*/}
            </View>
        </View>
    </View>
);

const Signature = ({event, label, imageLocations}) => (
    <View>
        <PdfHeader icon={'building'} label={label}/>
        {event &&
        <React.Fragment>
            <Image source={imageLocations[event.signature.signatureImageSignatory.key]}
                   style={{width: '100px', height: '100px'}}/>
            {/*<S3Image*/}
            {/*    theme={{photoImg: {width: '100px', height: '100px'}}}*/}
            {/*    resizeMode={'center'}*/}
            {/*    level={"public"}*/}
            {/*    imgKey={event.signature.signatureImageSignatory.key}/>*/}
            <Text>{event.signature.signatoryName} {event.signature.signatoryEmail && <Text>({event.signature.signatoryEmail})</Text>}</Text>
            <Text>{moment(event.createdAt).format('lll')}</Text>
        </React.Fragment>
        }
        {!event &&
        <View style={{width: "100px", height: "100px"}}/>
        }
    </View>
);

function selectSignature(events, site) {
    const match = events.filter(e => (e.type === 'LoadingComplete' || e.type === 'UnloadingComplete') && e.site === site);
    return match.length === 0 ? null : match[0];
}



export const CmrPdf = ({contract, imageLocations}) => {
    //"public"}*/}
    //{/*    imgKey={event.signature.signatureImageSignatory.key



    return (
        <Document>
            <Page style={styles.body}>
                <View style={styles.innerBody}>
                    <Row>
                        <Address address={contract.shipper} icon={'building'} label={'1. Shipper'}/>
                        <Legal id={contract.id.substring(0, 8)} openecmrId={contract.openecmrId}/>
                    </Row>
                    <Row>
                        <Address address={contract.delivery} icon={'building'} label={'2. Consignee'}/>
                        <Address address={contract.carrier} icon={'truck'} label={'16. Carrier'}/>
                    </Row>
                    <Row>
                        <Address address={contract.delivery} icon={'building'}
                                 label={'3. Place designated for delivery of goods (place, country)'}>
                            <View style={styles.plannedDate}>
                                <Text>Planned delivery date: {moment(contract.deliveryDate).format('ll')}
                                {contract.deliveryTime &&
                                    ' ' + I18n.get('({start} to {end})')
                                        .replace('{start}', contract.deliveryTime.start)
                                        .replace('{end}', contract.deliveryTime.end)}</Text>
                            </View>
                        </Address>
                        <LicensePlates contract={contract}/>
                    </Row>
                    <Row>
                        <Address address={contract.pickup} icon={'building'}
                                 label={'4. Place and date of taking over the goods'}>
                            <View style={styles.plannedDate}>
                                <Text>Planned pickup date: {moment(contract.arrivalDate).format('ll')}
                                {contract.arrivalTime &&
                                ' ' + I18n.get('({start} to {end})')
                                    .replace('{start}', contract.arrivalTime.start)
                                    .replace('{end}', contract.arrivalTime.end)}</Text>
                            </View>
                        </Address>
                        <View>
                            <PdfHeader label={'18. Reservations and observations'}/>

                            <SubHeader>Loading</SubHeader>
                            {
                                contract.events
                                    .filter(e => e.type === 'LoadingComplete' && e.signatoryObservation && e.signature)
                                    .map(e => <Text>{e.signature.signatoryName}: {e.signatoryObservation}</Text>)
                            }
                            <SubHeader>Delivery</SubHeader>
                            {
                                contract.events
                                    .filter(e => e.type === 'UnloadingComplete' && e.signatoryObservation && e.signature)
                                    .map(e => <Text>{e.signature.signatoryName}: {e.signatoryObservation}</Text>)
                            }
                        </View>
                    </Row>
                    <Row max={true} fill={true}>
                        <ListOfLoads loads={contract.loads}/>
                    </Row>
                    <Row>
                        <View>
                            <PdfHeader label={"13. Sender's instructions"}/>

                        </View>
                    </Row>
                    <Row>
                        <Signature event={selectSignature(contract.events, 'pickup')}
                                   imageLocations={imageLocations}
                                   label={'22. Signature and stamp of the sender'}/>
                        <Signature event={null}
                                   imageLocations={imageLocations}
                                   label={'23. Signature and stamp of the carrier'}/>
                        <Signature event={selectSignature(contract.events, 'delivery')}
                                   imageLocations={imageLocations}
                                   label={'24. Signature and stamp of the consignee'}/>
                    </Row>
                </View>
            </Page>
        </Document>);
}

// Font.register({
//     family: 'Oswald',
//     src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
// });

Font.register({
    family: 'Open Sans',
    fonts: [
        { src: './fonts/open-sans-regular.ttf' },
        { src: './fonts/open-sans-600.ttf', fontWeight: 600 }
    ]
});

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        fontSize: 8,
        fontFamily: 'Open Sans',
    },
    innerBody: {
        border: '1px solid black',
        height: '100%'
    },
    table: {
        borderLeft: '1px solid rgb(233,233,233)',
        borderRight: '1px solid rgb(233,233,233)',
        borderTop: '1px solid rgb(233,233,233)',
        borderRadius: 2,
        fontSize: 8,
    },
    tableHeaderRow: {
        flexDirection: "row",
        fontWeight: 'bold',
        borderBottom: '1px solid rgb(233,233,233)',
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: '1px solid rgb(233,233,233)',
    },
    tableCell: {
        padding: 5
    },
    row: {
        flexDirection: "row",

        borderBottomWidth: 1,
        borderBottomColor: "black"
    },
    rowMax: {
        flex: 1
    },
    rowCell: {
        flex: 1,
        padding: 5,
        borderLeft: '1px solid black',
    },
    rowCellFirst: {
        borderLeft: 'none'
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        fontFamily: 'Oswald'
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 18,
        margin: 12,
        fontFamily: 'Oswald'
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Times-Roman'
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    innerRow: {
        flexDirection: "row"
    },
    innerCell: {
        padding: 5,
        flex: 1,
    },
    plannedDate: {
        paddingTop: 5
    },
    smallText: {
        fontSize: "7pt",
        lineHeight: "1em"
    },
    legalHeader: {
        fontWeight: "bold",
        fontSize: "7pt"
    }
});