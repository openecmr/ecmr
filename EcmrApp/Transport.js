import React, {Component, useState} from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text, TouchableOpacity, TouchableWithoutFeedback,
    View
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {Address, ArrivalDate, LicensePlates, LoadDetailText, MyText, Sizes} from "./Components";
import {API, Auth, graphqlOperation, I18n, Storage} from 'aws-amplify';
import * as queries from "./graphql/queries";
import moment from "moment/min/moment-with-locales";
import {S3Image} from "aws-amplify-react-native";
import ContractModel from "./ContractModel";
import {createUpdateContractInput, geoUtil, updateContract} from "./DataUtil";
import RNFetchBlob from 'rn-fetch-blob'
import {Button, Divider} from "react-native-elements";
import openMap from 'react-native-open-maps';
import MapView, {Circle, Marker} from "react-native-maps";

const Header = ({children}) => <MyText style={styles.header}>{children}</MyText>;

const activityDoneColor = 'rgb(5, 172, 5)';
const actionButtonColor = 'rgb(60,176,60)';

const formatInt = int => {
    if (int < 10) {
        return `0${int}`;
    }
    return `${int}`;
};

const formatDuration = time => {
    const seconds = moment.duration(time).seconds();
    const minutes = moment.duration(time).minutes();
    const hours = moment.duration(time).hours();
    const days = moment.duration(time).days();
    if (days > 0) {
        return `${days}d ${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`
    }
    if (hours > 0) {
        return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
    }
    if (minutes > 0) {
        return `${formatInt(minutes)}:${formatInt(seconds)}`;
    }
    return `00:${formatInt(seconds)}`;
};

async function openS3Location(location, mimeType) {
    const result = await Storage.get(location.key);
    const res = await RNFetchBlob
        .config({
            fileCache: true,
        })
        .fetch('GET', result);


    if (Platform.OS === 'android') {
        await RNFetchBlob.android.actionViewIntent(res.data, mimeType);
    } else if (Platform.OS === 'ios') {
        await RNFetchBlob.ios.openDocument(res.data);
    }
}

const SignatureEvent = ({signature, signatoryObservation, photos, oldLoads, newLoads}) => (
    <View>
        {
            oldLoads &&
            <View style={{flexDirection: 'row'}}>
                <MyText>{I18n.get("Loads description was changed")} </MyText>
            </View>
        }
        <TouchableOpacity onPress={() => openS3Location(signature.signatureImageSignatory, "image/png")}>
            <S3Image style={{width: 150, height: 150}}
             resizeMode={'center'}
             level={"public"}
             imgKey={signature.signatureImageSignatory.key} />
        </TouchableOpacity>
        {
            signature.signatoryName &&
            <View style={{flexDirection: 'row'}}>
                <MyText>{I18n.get("Signed by:")} </MyText>
                <View style={{flex: 1}}>
                    <MyText style={{fontStyle: 'italic'}}>{signature.signatoryName} {signature.signatoryEmail && `(${signature.signatoryEmail})`}</MyText>
                </View>
            </View>
        }
        {
            signatoryObservation &&
            <View style={{flexDirection: 'row'}}>
                <MyText>{I18n.get("Signatory observation:")} </MyText>
                <MyText style={{fontStyle: 'italic', flex: 1}}>{signatoryObservation}</MyText>
            </View>
        }
        {
            !!photos.length && <Divider style={{marginTop: 5, marginBottom: 5}}/>
        }
        {
            !!photos.length &&
            Photos(photos)
        }
    </View>
);

const LoadDetail = ({load}) => (
    <View style={styles.package}>
        <Icon name="archive" style={[styles.packageIcon]} size={Sizes.ICON_WIDTH} />
        <LoadDetailText style={styles.packageText} load={load} />
    </View>
);

const ActionButton = ({ onPress, disabled, label, icon }) => (
    <TouchableOpacity style={{padding: 15}} onPress={onPress} disabled={disabled}>
        <View style={{flexDirection: "row"}}>
            <Icon name={icon} style={{
                color: "rgb(0, 115, 209)",
                marginRight: 5,
                textAlignVertical: "center",
                width: Sizes.ICON_WIDTH
            }} size={Sizes.ICON_WIDTH}/>
            <MyText style={{fontWeight: "bold"}}>{label}</MyText>
            <ActivityIndicator size="small" color="rgb(0, 115, 209)" animating={disabled}/>
        </View>
    </TouchableOpacity>
);

function EventLocation({item, item: {geoposition: {latitude, longitude}}}) {
    const [visible, setVisible] = useState(false);
    return <View>
        <TouchableWithoutFeedback onPress={() => setVisible(!visible)}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Icon name={visible ? "caret-down" : "caret-right"} size={25} style={{paddingRight: 5, color: "grey"}}/>
                <MyText style={{color: "grey", textDecorationLine: "underline"}}>{I18n.get("Location details")}</MyText>
            </View>
        </TouchableWithoutFeedback>
        {visible && <MapView
            liteMode={true}
            toolbarEnabled={false}
            style={{height: 150, width: 150, borderWidth: 1, borderStyle: "solid", borderColor: "black"}}
            onPress={() => openMap({
                query: `${latitude},${longitude}`
            })}
            camera={{
                center: {
                    latitude: latitude,
                    longitude: longitude
                },
                heading: 0,
                zoom: 15,
                altitude: 15,
                pitch: 0
            }}>
            <Marker coordinate={{
                latitude: latitude,
                longitude: longitude
            }}/>
            <Circle center={{
                latitude: latitude,
                longitude: longitude
            }} radius={item.geoposition.accuracy}/>
        </MapView>}
    </View>;
}

class Transport extends Component {
    constructor(props) {
        super(props);

        const { navigation, route } = this.props;

        const site = route.params.site;
        const item = route.params.item;
        const activityName = site === 'pickup' ? I18n.get("pickup") : I18n.get("delivery");
        navigation.setOptions({
            title: activityName + ': ' + item[site].name
        });
        this.state = {
            'site': site,
            downloadingPdf: false,
            ...this.setContract(item, site)
        };

        this.launchNavigation = this.launchNavigation.bind(this);
    }

    launchNavigation() {
        const {
            item,
            site
        } = this.state;
        const address = item[site];
        const query = address.name + ", " + ", " + address.address + ", " + address.postalCode + ", " + address.city + ", " + address.country;
        openMap({query: query})
    }

    setContract(contract, site) {
        const item = new ContractModel(contract);

        const arrivalDate = site === 'pickup' ? item.arrivalDate : item.deliveryDate;
        const arrivalTime = site === 'pickup' ? item.arrivalTime : item.deliveryTime;
        const actions = site === 'pickup' ?
            ['ArrivalOnSite', 'LoadingComplete'] :
            ['ArrivalOnSite', 'UnloadingComplete'];
        const events = (item.events || []).filter(e => e.site === site && actions.indexOf(e.type) !== -1);

        let lastRelevantEvent;
        let firstAction;
        if (events.length === 0) {
            firstAction = contract.needAcknowledge ? "Acknowledge" : actions[0];
        } else {
            lastRelevantEvent = events[events.length - 1];
            const lastAction = actions.indexOf(lastRelevantEvent.type);
            const nextAction = lastAction + 1 < actions.length ? actions[lastAction + 1] : '';
            firstAction = contract.needAcknowledge ?
                "Acknowledge" : (!nextAction || !this.isPending(contract) ? '' : nextAction);
        }

        const relevantItems = [...item.events || []].filter(e => e.site === site || !e.site).reverse();
        const names = item.names();

        const lastRelevantEventDuration = lastRelevantEvent ? moment().diff(moment(lastRelevantEvent.createdAt)) : 0;

        return {
            arrivalDate,
            arrivalTime,
            lastRelevantEvent,
            firstAction,
            relevantItems,
            names,
            contract,
            item,
            lastRelevantEventDuration
        }
    }

    render() {
        const {
            arrivalDate,
            arrivalTime,
            lastRelevantEvent,
            lastRelevantEventDuration,
            firstAction,
            relevantItems,
            names,
            loading,
            item,
            contract,
            site
        } = this.state;

        const states = {
            'Acknowledge': I18n.get('Awaiting acknowledgement'),
            'ArrivalOnSite': I18n.get('Awaiting arrival on site'),
            'LoadingComplete': I18n.get('Arrived on location / loading'),
            'UnloadingComplete': I18n.get('Arrived on location / unloading'),
            '': I18n.get('Activity done')
        };

        const ongoingEvent = !!(lastRelevantEvent && firstAction);

        const attachments = this.attachments(contract);

        return (
            <ScrollView style={styles.transport}>
                <Header>{I18n.get("Current status")}</Header>
                <View style={{
                    padding: 5,
                    paddingLeft: Sizes.PADDING_FROM_SCREEN_BORDER,
                    paddingRight: Sizes.PADDING_FROM_SCREEN_BORDER
                }}>
                    <View style={{paddingTop: 10, paddingBottom: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: "center", flex: 1}}>
                            {!firstAction &&
                            <Icon color={activityDoneColor} size={30} style={{marginRight: 5}} name='check-circle'/>}
                            <MyText style={{
                                fontSize: 20,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                marginBottom: 5
                            }}>{states[firstAction]}</MyText>
                        </View>
                        {ongoingEvent &&
                        <MyText style={{fontSize: 18, textAlign: 'center', fontWeight: 'bold', color: '#FF5C00'}}>
                            {formatDuration(lastRelevantEventDuration)}
                        </MyText>}
                    </View>
                    <Divider style={{backgroundColor: '#FF5C00', marginLeft: 30, marginRight: 30, height: 2}}/>
                    {lastRelevantEvent &&
                    <View style={{flexDirection: "row", flex: 1, justifyContent: "center", marginTop: 15}}>
                        <MyText
                            style={{fontWeight: 'bold'}}>{firstAction ? I18n.get("Started on:") : I18n.get("Finished on:")}</MyText>
                        <MyText style={{marginLeft: 3, fontWeight: 'bold'}}>
                            {moment(lastRelevantEvent.createdAt).format('llll')}
                        </MyText>
                    </View>}
                </View>
                <View style={styles.action}>
                    {firstAction === 'Acknowledge' &&
                    <Button title={I18n.get("Acknowledge transport")} loading={loading}
                            buttonStyle={styles.actionButton} onPress={() => this.confirmAcknowledge()}/>}
                    {firstAction === 'ArrivalOnSite' && <Button
                        title={site === 'pickup' ? I18n.get("Notify arrival at loading site") : I18n.get("Notify arrival at unloading site")}
                        loading={loading}
                        buttonStyle={styles.actionButton}
                        onPress={() => this.confirmNotifyArrival()}/>}
                    {(firstAction === 'LoadingComplete' || firstAction === 'UnloadingComplete') &&
                    <Button loading={loading}
                            title={site === 'pickup' ? I18n.get("Confirm loading") : I18n.get("Confirm unloading")}
                            buttonStyle={styles.actionButton} onPress={() => this.confirmLoading()}/>}
                </View>
                <Header>{I18n.get("Details")}</Header>
                <View style={{paddingLeft: Sizes.PADDING_FROM_SCREEN_BORDER}}>
                    <TouchableOpacity
                        onPress={this.launchNavigation}>
                        <View style={{flexDirection: "row", alignItems: "center", ...styles.address}}>
                            <Address address={item[site]} style={{flex: 1}}/>
                            <Icon size={30}
                                  style={{...styles.navigateIcon, paddingRight: Sizes.PADDING_FROM_SCREEN_BORDER}}
                                  name='directions'/>
                        </View>
                    </TouchableOpacity>
                    <ArrivalDate date={arrivalDate} time={arrivalTime} style={{paddingTop: 10, ...styles.address}}/>

                    {
                        contract.loads.map((load, index) => <LoadDetail key={index} load={load}/>)
                    }

                    <LicensePlates truck={contract.truck} trailer={contract.trailer}
                                   style={{paddingTop: 10, ...styles.address}}/>
                </View>

                <Header>{I18n.get("Actions")}</Header>
                <View style={{paddingLeft: Sizes.PADDING_FROM_SCREEN_BORDER}}>
                    <View style={{borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgb(200, 200, 200)'}}>
                        <ActionButton onPress={() => this.showConsignmentNote()} label={I18n.get("Display the consignment note")} disabled={this.state.downloadingPdf} icon={"file"}/>
                    </View>
                    <ActionButton onPress={() => this.addDocumentOrPhoto()} label={I18n.get("Add a photo")} disabled={false} icon={"camera"}/>
                </View>

                {attachments.length > 0 && <View>
                    <Header>{I18n.get("Attachments")}</Header>
                    <View style={{paddingLeft: Sizes.PADDING_FROM_SCREEN_BORDER}}>
                        {attachments.map((a, index) => <ActionButton onPress={() => this.downloadAttachment(a)}
                                                            label={a.filename}
                                                            key={index}
                                                            icon={this.determineIcon(a)}
                                                            disabled={this.state.downloadingAttachment === a}/>)}

                    </View>
                </View>}

                <Header>{I18n.get("Activity feed")}</Header>
                <View style={{paddingLeft: Sizes.PADDING_FROM_SCREEN_BORDER}}>
                    {relevantItems.map((item, index) =>
                        (<View style={styles.activityItemContainer} key={index}>
                            <Text style={{fontSize: 12}}>{moment(item.createdAt).format('llll')}</Text>

                            <MyText>{this.eventText(item, names)}</MyText>
                            {
                                (item.type === 'UnloadingComplete' || item.type === 'LoadingComplete') &&
                                <SignatureEvent signature={item.signature}
                                                signatoryObservation={item.signatoryObservation}
                                                photos={item.photos || []} oldLoads={item.oldLoads}/>
                            }
                            {
                                item.geoposition && <EventLocation item={item}/>
                            }
                        </View>))
                    }
                </View>
            </ScrollView>
        );
    }

    determineIcon(attachment) {
        const icons = {
            "image/jpeg": "file-image"
        }
        return icons[attachment.mimeType] || "file"
    }

    attachments(contract) {
        const deletedAttachments = contract.events.filter(e => e.type === 'DeleteAttachment').map(e => e.deletesAttachments);
        return contract.events
            .filter(e => e.type === 'AddAttachment' && deletedAttachments.indexOf(e.createdAt) === -1 && e.attachments)
            .map(e => e.attachments).flat();
    }

    isPending(contract) {
        return contract.status === 'CREATED' || contract.status === 'IN_PROGRESS';
    }

    addDocumentOrPhoto() {
        const {navigate} = this.props.navigation;

        const attachments = this.attachments(this.state.item);
        if (attachments.length > 10) {
            Alert.alert(
                I18n.get('Error'),
                I18n.get('You cannot add more attachments to this transport. The maximum number of attachments has been reached.'),
                [
                    {text: I18n.get('OK'), onPress: () => this.acknowledge()}
                ],
                {cancelable: true}
            );
        } else {
            navigate('AddDocumentOrPhoto', {
                item: this.state.item,
                site: this.state.site
            });
        }
    }

    async downloadAttachment(attachment) {
        this.setState({
            downloadingAttachment: attachment
        })
        await openS3Location(attachment.location, attachment.mimeType);
        this.setState({
            downloadingAttachment: null
        })
    }

    async showConsignmentNote() {
        this.setState({
            downloadingPdf: true
        });
        const dirs = RNFetchBlob.fs.dirs;
        const path = `${dirs.CacheDir}/cn-${this.state.item.id.substring(0,8)}.pdf`;
        const result = await API.graphql(graphqlOperation(queries.rpdfexport, {id: this.state.item.id}));
        await RNFetchBlob.fs.writeFile(path, result.data.rpdfexport, 'base64');
        if (Platform.OS === 'android') {
            await RNFetchBlob.android.actionViewIntent(path, 'application/pdf');
        } else if (Platform.OS === 'ios') {
            await RNFetchBlob.ios.openDocument(path);
        }
        this.setState({
            downloadingPdf: false
        });
    }

    eventText(event, names) {
        const name = names[event.author.username] || event.author.username;
        switch (event.type) {
            case 'ArrivalOnSite':
                return event.site === 'pickup' ?
                    I18n.get("${name} arrived on pickup site.").replace("${name}", name) :
                    I18n.get("${name} arrived on delivery site.").replace("${name}", name);
            case 'LoadingComplete':
                return I18n.get("${name} completed the loading.").replace("${name}", name);
            case 'UnloadingComplete':
                return I18n.get("${name} completed the unloading.").replace("${name}", name);
            case 'AssignDriver':
                return I18n.get("${name} assigned transport to driver ${driver}.")
                    .replace("${name}", name)
                    .replace("${driver}", event.assignedDriver ? event.assignedDriver.name : I18n.get("unknown"));
            case 'Acknowledge':
                return I18n.get("${name} acknowledged the transport").replace("${name}", name);
            case 'AddAttachment':
                return event.attachmentDescription ?
                    I18n.get('${name} added attachment ${filename}\n\nDescription: ${description}')
                        .replace('${name}', name)
                        .replace('${filename}', event.attachments && event.attachments.length && event.attachments[0].filename)
                        .replace('${description}', event.attachmentDescription) :
                    I18n.get('${name} added attachment ${filename}')
                        .replace('${name}', name)
                        .replace('${filename}', event.attachments && event.attachments.length && event.attachments[0].filename);
            case "DeleteAttachment":
                return I18n.get('${name} removed attachment').replace('${name}', name);
            case "Edited":
                return I18n.get('${name} edited the transported').replace('${name}', name);
            default:
                return I18n.get("${name} completed ${type}").replace("${name}", name).replace("${type}", event.type);
        }
    }

    async confirmLoading() {
        this.setState({
            loading: true
        })
        const position = await geoUtil.getCurrentPosition();
        const {navigate} = this.props.navigation;
        navigate('ConfirmLoading', {
            item: this.state.item,
            site: this.state.site,
            position: position
        });
        this.setState({
            loading: false
        })
    }

    confirmAcknowledge() {
        Alert.alert(
            I18n.get('Confirmation'),
            I18n.get('Are you sure you want to acknowledge the transport?'),
            [
                {
                    text: I18n.get('Cancel'),
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: I18n.get('OK'), onPress: () => this.acknowledge()}
            ],
            {cancelable: true}
        );
    }

    async acknowledge() {
        this.setState({
            loading: true
        });
        this.setState({
            loading: true
        });
        const item = createUpdateContractInput(this.props.route.params.item);
        const now = moment().format();
        const user = await Auth.currentAuthenticatedUser();

        if (!item.events) {
            item.events = [];
        }
        item.events.push({
            type: 'Acknowledge',
            createdAt: now,
            author: {
                username: user.username
            }
        });
        item.needAcknowledge = false;

        try {
            const result = await updateContract(item);
            this.props.navigation.setParams({
                item: result
            });
            this.setState({
                ...this.setContract(result, this.state.site)
            });
        } catch (ex) {
            console.log(ex);
        } finally {
            this.setState({
                loading: false
            });
        }
    }

    confirmNotifyArrival() {
        Alert.alert(
            I18n.get('Confirmation'),
            I18n.get('Are you sure you want to notify your arrival at site?'),
            [
                {
                    text: I18n.get('Cancel'),
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: I18n.get('OK'), onPress: () => this.notifyArrival()}
            ],
            {cancelable: true}
        );
    }

    async notifyArrival() {
        this.setState({
            loading: true
        });

        const position = await geoUtil.getCurrentPosition();
        await this.finishNotifyArrival(position);
    }

    async finishNotifyArrival(geoposition) {
        const contract = this.props.route.params.item;
        const update = createUpdateContractInput(contract);
        const now = moment().format();
        const user = await Auth.currentAuthenticatedUser();

        if (!update.events) {
            update.events = [];
        }

        const event = {
            type: 'ArrivalOnSite',
            site: this.state.site,
            createdAt: now,
            author: {
                username: user.username
            }
        };

        if (geoposition) {
            event.geoposition = geoUtil.toGeoPosition(geoposition);
        }

        update.events.push(event);
        update.status = 'IN_PROGRESS';
        if (contract.orderStatus) {
            update.orderStatus = 'IN_PROGRESS';
        }
        try {
            const result = await updateContract(update);
            this.props.navigation.setParams({
                item: result
            });
            this.setState({
                ...this.setContract(result, this.state.site)
            });
        } catch (ex) {
            console.warn(ex);
        } finally {
            this.setState({
                loading: false
            });
        }
    }

    async refresh() {
        const id = this.state.item.id;

        const response = await API.graphql(graphqlOperation(queries.getContract, {
            id: id
        }));
        this.setState({
            ...this.setContract(response.data.getContract, this.state.site)
        })
    }

    componentWillUnmount() {
        this.navigationEventSubscription();

        clearInterval(this.state.timer);
    }

    componentDidMount() {
        this.navigationEventSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                this.refresh();
            }
        );

        const timer = setInterval(() => {
            const lastRelevantEventDuration = this.state.lastRelevantEvent ? moment().diff(moment(this.state.lastRelevantEvent.createdAt)) : 0;
            this.setState({
                lastRelevantEventDuration
            });
        }, 1000);
        this.setState({
            timer
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    transport: {
        backgroundColor: 'white'
    },
    header: {
        backgroundColor: 'rgb(240,240,240)',
        fontWeight: 'bold',
        padding: 15,
        paddingLeft: 10,
        borderBottomColor: 'rgb(200, 200, 200)',
        borderBottomWidth:  StyleSheet.hairlineWidth,
        borderTopColor: 'rgb(200, 200, 200)',
        borderTopWidth:  StyleSheet.hairlineWidth
    },
    address: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgb(200, 200, 200)',
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    package: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgb(200, 200, 200)',

        padding: 10,
        flexDirection: 'row',
        alignItems: "center"
    },
    packageIcon: {
        width: Sizes.ICON_WIDTH,
        color: 'rgb(0, 115, 209)'
    },
    navigateIcon: {
        color: actionButtonColor
    },
    packageText: {
        paddingLeft: 5
    },
    action: {
        paddingTop: 0,
        // backgroundColor: 'rgb(240,240,240)',
        padding: 10
    },
    activityDoneText: {
        color: activityDoneColor,
        fontWeight: 'bold',
        paddingLeft: 5
    },
    activityItemContainer: {
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgb(200, 200, 200)'
    },
    actionButton: {
        backgroundColor: actionButtonColor
    },


    photoFrame: {
        marginRight: 10,
        aspectRatio: 3 / 4,
        justifyContent: 'center',
        alignItems: "center",
        borderColor: "gray",
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 5,
        flex: 1
    },
    photoFrameLast: {
        marginRight: 0
    },
    photoFrameHidden: {
        opacity: 0
    },
    photoFrameContainer: {
        flexDirection: "row",
        marginTop: 5,
        flex: 1
    },
    photo: {
        height: "100%",
        width: "100%",
        borderRadius: 5
    },
});

export default Transport;

function Photos(photos) {
    return <View style={styles.photoFrameContainer}>
        {[0, 1, 2].map((photo, idx) => <View style={[styles.photoFrame, idx === 2 && styles.photoFrameLast, idx > photos.length - 1 && styles.photoFrameHidden]} key={idx}>
            {photos[photo] && <TouchableOpacity onPress={() => openS3Location(photos[photo], "image/jpeg")} style={styles.photo}>
                <S3Image style={styles.photo} level={"public"} imgKey={photos[photo].key} />
            </TouchableOpacity>}
        </View>)}
    </View>;
}
