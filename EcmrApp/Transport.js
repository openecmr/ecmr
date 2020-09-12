import {Component} from "react";
import React from "react";
import {
    Alert,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {Address, ArrivalDate, LicensePlates, LoadDetailText, MyText, Sizes} from "./Components";
import {API, graphqlOperation, I18n} from 'aws-amplify';
import * as queries from "./graphql/queries";
import moment from "moment/min/moment-with-locales";
import { Auth } from 'aws-amplify';
import {S3Image} from "aws-amplify-react-native";
import ContractModel from "./ContractModel";
import {createUpdateContractInput, updateContract} from "./DataUtil";
const Header = ({children}) => <MyText style={styles.header}>{children}</MyText>;
import RNFetchBlob from 'rn-fetch-blob'
import {Button, Divider} from "react-native-elements";
import openMap from 'react-native-open-maps';

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

const SignatureEvent = ({signature, signatoryObservation, photos}) => (
    <View>
        <S3Image style={{width: 150, height: 150}}
             resizeMode={'center'}
             level={"public"}
             imgKey={signature.signatureImageSignatory.key} />
        {
            signature.signatoryName &&
            <View style={{flexDirection: 'row'}}>
                <MyText>{I18n.get("Signed by:")} </MyText>
                <MyText style={{fontStyle: 'italic'}}>{signature.signatoryName} {signature.signatoryEmail && `(${signature.signatoryEmail})`}</MyText>
            </View>
        }
        {
            signatoryObservation &&
            <View style={{flexDirection: 'row'}}>
                <MyText>{I18n.get("Signatory observation:")} </MyText>
                <MyText style={{fontStyle: 'italic'}}>{signatoryObservation}</MyText>
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
        <Icon name="dropbox" style={[styles.packageIcon]} size={Sizes.ICON_WIDTH} />
        <LoadDetailText style={styles.packageText} load={load} />
    </View>
);

class Transport extends Component {
    static navigationOptions = ({ navigation }) => {
        const site = navigation.getParam('site');
        const item = navigation.getParam('item');
        const activityName = site === 'pickup' ? I18n.get("pickup") : I18n.get("delivery");
        return {
            title: activityName + ': ' + item[site].name
        }
    };

    constructor(props) {
        super(props);

        const { navigation } = this.props;

        const item = this.props.navigation.getParam('item');

        const site = navigation.getParam('site');
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

        return (
            <ScrollView style={styles.transport}>
                <Header>{I18n.get("Current status")}</Header>
                <View style={{padding: 5, paddingLeft: Sizes.PADDING_FROM_SCREEN_BORDER, paddingRight: Sizes.PADDING_FROM_SCREEN_BORDER}}>
                    <View style={{paddingTop: 10, paddingBottom: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: "center", flex: 1}}>
                            {!!!firstAction && <Icon color={activityDoneColor} size={30} style={{marginRight: 5}} name='check-circle'/>}
                            <MyText style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold', marginBottom: 5}}>{states[firstAction]}</MyText>
                        </View>
                        {ongoingEvent && <MyText style={{fontSize: 18, textAlign: 'center',  fontWeight: 'bold', color: '#FF5C00'}}>
                            {formatDuration(lastRelevantEventDuration)}
                        </MyText>}
                    </View>
                    <Divider style={{backgroundColor: '#FF5C00', marginLeft: 30, marginRight: 30, height: 2}}/>
                    {lastRelevantEvent && <View style={{flexDirection: "row", flex: 1, justifyContent: "center", marginTop: 15}}>
                        <MyText style={{fontWeight: 'bold'}}>{firstAction ? I18n.get("Started on:") : I18n.get("Finished on:")}</MyText>
                        <MyText style={{marginLeft: 3, fontWeight: 'bold'}}>
                            {moment(lastRelevantEvent.createdAt).format('llll')}
                        </MyText>
                    </View>}
                </View>
                <View style={styles.action}>
                    {firstAction === 'Acknowledge' && <Button title={I18n.get("Acknowledge transport")} loading={loading} buttonStyle={styles.actionButton} onPress={() => this.confirmAcknowledge()} />}
                    {firstAction === 'ArrivalOnSite' && <Button title={site === 'pickup' ? I18n.get("Notify arrival at loading site") : I18n.get("Notify arrival at unloading site")}
                                                                loading={loading}
                                                                buttonStyle={styles.actionButton}
                                                                onPress={() => this.confirmNotifyArrival()}/>}
                    {(firstAction === 'LoadingComplete' || firstAction === 'UnloadingComplete') && <Button loading={loading}
                                                                                                           title={site === 'pickup' ? I18n.get("Confirm loading") : I18n.get("Confirm unloading")}
                                                                                                           buttonStyle={styles.actionButton} onPress={() => this.confirmLoading()}/>}
                </View>
                <Header>{I18n.get("Details")}</Header>
                <View style={{paddingLeft: Sizes.PADDING_FROM_SCREEN_BORDER}}>
                    <TouchableOpacity
                        onPress={this.launchNavigation}>
                        <View style={{flexDirection: "row", alignItems: "center", ...styles.address}}>
                            <Address address={item[site]} style={{flex: 1}} />
                            <Icon size={30} style={{...styles.navigateIcon, paddingRight: Sizes.PADDING_FROM_SCREEN_BORDER}} name='directions'/>
                        </View>
                    </TouchableOpacity>
                    <ArrivalDate date={arrivalDate} time={arrivalTime}  style={{paddingTop: 10, ...styles.address}} />

                    {
                        contract.loads.map((load, index) => <LoadDetail key={index} load={load}/>)
                    }

                    <LicensePlates truck={contract.truck} trailer={contract.trailer} style={{paddingTop: 10, ...styles.address}}/>
                </View>

                <Header>{I18n.get("Consignment note")}</Header>
                <View style={{paddingLeft: Sizes.PADDING_FROM_SCREEN_BORDER}}>
                <TouchableOpacity style={{padding: 15}} onPress={() => this.showConsignmentNote()} disabled={this.state.downloadingPdf}>
                    <View style={{flexDirection: "row"}}>
                        <Icon name={'file'} style={{color: 'rgb(0, 115, 209)', marginRight: 5, textAlignVertical: "center", width: Sizes.ICON_WIDTH}} size={Sizes.ICON_WIDTH}/>
                        <MyText style={{fontWeight: "bold"}}>{I18n.get("Display the consignment note")}</MyText>
                        <ActivityIndicator size="small" color="rgb(0, 115, 209)" animating={this.state.downloadingPdf}/>
                    </View>
                </TouchableOpacity>
                </View>

                <Header>{I18n.get("Activity feed")}</Header>
                <View style={{paddingLeft: Sizes.PADDING_FROM_SCREEN_BORDER}}>
                {relevantItems.map((item, index) =>
                    (<View style={styles.activityItemContainer} key={index}>
                            <Text style={{fontSize: 12}}>{moment(item.createdAt).format('llll')}</Text>

                            <MyText>{this.eventText(item, names)}</MyText>
                            {
                                (item.type === 'UnloadingComplete' || item.type === 'LoadingComplete') &&
                                    <SignatureEvent signature={item.signature} signatoryObservation={item.signatoryObservation} photos={item.photos || []}/>
                            }
                        </View>))
                    }
                </View>
            </ScrollView>
        );
    }

    isPending(contract) {
        return contract.status === 'CREATED' || contract.status === 'IN_PROGRESS';
    }

    async showConsignmentNote() {
        this.setState({
            downloadingPdf: true
        });
        const dirs = RNFetchBlob.fs.dirs;
        const path = `${dirs.CacheDir}/cn-${this.state.item.id.substring(0,8)}.pdf`;
        const result = await API.graphql(graphqlOperation(queries.pdfexport, {id: this.state.item.id}));
        await RNFetchBlob.fs.writeFile(path, result.data.pdfexport, 'base64');
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
            default:
                return I18n.get("${name} completed ${type}").replace("${name}", name).replace("${type}", event.type);
        }
    }

    confirmLoading() {
        const {navigate} = this.props.navigation;
        navigate('ConfirmLoading', {
            item: this.state.item,
            site: this.state.site
        });
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
        const item = createUpdateContractInput(this.props.navigation.getParam('item'));
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
        const item = createUpdateContractInput(this.props.navigation.getParam('item'));
        const now = moment().format();
        const user = await Auth.currentAuthenticatedUser();

        if (!item.events) {
            item.events = [];
        }
        item.events.push({
            type: 'ArrivalOnSite',
            site: this.state.site,
            createdAt: now,
            author: {
                username: user.username
            }
        });
        item.status = 'IN_PROGRESS';

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
        this.navigationEventSubscription.remove();

        clearInterval(this.state.timer);
    }

    componentDidMount() {
        this.navigationEventSubscription = this.props.navigation.addListener(
            'willFocus',
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
        borderBottomWidth:  StyleSheet.hairlineWidth
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
            {photos[photo] && <S3Image style={styles.photo} level={"public"} imgKey={photos[photo].key} />}
        </View>)}
    </View>;
}
