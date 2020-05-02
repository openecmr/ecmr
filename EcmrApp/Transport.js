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
import Icon from "react-native-vector-icons/FontAwesome";
import {Address, ArrivalDate, LicensePlates, LoadDetailText, MyText} from "./Components";
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from "./graphql/queries";
import moment from "moment";
import { Auth } from 'aws-amplify';
import {S3Image} from "aws-amplify-react-native";
import ContractModel from "./ContractModel";
import {createUpdateContractInput, updateContract} from "./DataUtil";
const Header = ({children}) => <MyText style={styles.header}>{children}</MyText>;
import RNFetchBlob from 'rn-fetch-blob'
import {Button, Divider} from "react-native-elements";

const activityDoneColor = 'rgb(5, 172, 5)';
const actionButtonColor = 'rgb(60,176,60)';

const SignatureEvent = ({signature, signatoryObservation, photos}) => (
    <View>
        <S3Image style={{width: 150, height: 150}}
             resizeMode={'center'}
             level={"public"}
             imgKey={signature.signatureImageSignatory.key} />
        {
            signature.signatoryName &&
            <View style={{flexDirection: 'row'}}>
                <MyText>Signed by: </MyText>
                <MyText style={{fontStyle: 'italic'}}>{signature.signatoryName} {signature.signatoryEmail && `(${signature.signatoryEmail})`}</MyText>
            </View>
        }
        {
            signatoryObservation &&
            <View style={{flexDirection: 'row'}}>
                <MyText>Signatory observation: </MyText>
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
        <Icon name="dropbox" style={styles.packageIcon} size={20} />
        <LoadDetailText style={styles.packageText} load={load} />
    </View>
);

class Transport extends Component {
    static navigationOptions = ({ navigation }) => {
        const site = navigation.getParam('site');
        const item = navigation.getParam('item');
        return {
            title: site + ': ' + item[site].name
        }
    };

    constructor(props) {
        super(props);

        const { navigation } = this.props;

        const item = this.props.navigation.getParam('item');

        this.state = {
            'site': navigation.getParam('site'),
            'item': item,
            downloadingPdf: false
        };
    }

    render() {
        const contract = this.state.item;
        const loading = this.state.loading;
        if (!contract || !contract.id) {
            return <MyText>Loading...</MyText>
        }

        const item = new ContractModel(contract);
        const site = this.state.site;

        const direction = site === 'pickup' ? "loading" : "unloading";
        const arrivalDate = site === 'pickup' ? item.arrivalDate : item.deliveryDate;
        const arrivalTime = site === 'pickup' ? item.arrivalTime : item.deliveryTime;
        const actions = site === 'pickup' ?
            ['ArrivalOnSite', 'LoadingComplete', /*'DepartureFromSite'*/] :
            ['ArrivalOnSite', 'UnloadingComplete'];
        const events = (item.events || []).filter(e => e.site === site && actions.indexOf(e.type) !== -1).map(e => e.type);
        actions.splice(0, events.length === 0 ? 0 : actions.indexOf(events[events.length - 1]) + 1);
        const firstAction = contract.needAcknowledge ?
            "Acknowledge" :
            (actions.length === 0 || !this.isPending(contract) ? '' : actions[0]);
        const relevantItems = [...item.events || []].filter(e => e.site === site || !e.site).reverse();
        const names = item.names();

        return (
            <ScrollView style={styles.transport}>
                <Header>Details</Header>
                <Address address={item[site]} style={styles.address} />
                <ArrivalDate date={arrivalDate} time={arrivalTime}  style={{paddingTop: 10, ...styles.address}} />

                {
                    contract.loads.map((load, index) => <LoadDetail key={index} load={load}/>)
                }

                <LicensePlates truck={contract.truck} trailer={contract.trailer} style={{paddingTop: 10, ...styles.address}}/>

                <View style={styles.action}>
                    {firstAction === 'Acknowledge' && <Button title={"Acknowledge transport"} loading={loading} buttonStyle={styles.actionButton} onPress={() => this.confirmAcknowledge()} />}
                    {firstAction === 'ArrivalOnSite' && <Button title={`Notify arrival at ${direction} site`} loading={loading} buttonStyle={styles.actionButton} onPress={() => this.confirmNotifyArrival()}/>}
                    {(firstAction === 'LoadingComplete' || firstAction === 'UnloadingComplete') && <Button loading={loading} title={`Confirm ${direction}`} buttonStyle={styles.actionButton} onPress={() => this.confirmLoading()}/>}
                    {!firstAction &&
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Icon color={activityDoneColor} size={30} name='check-circle'/>
                            <Text style={styles.activityDoneText}>Activity done</Text>
                        </View>
                    }
                </View>
                <Header>Consignment note</Header>
                <TouchableOpacity style={{borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: 'black',
                    padding: 15}} onPress={() => this.showConsignmentNote()} disabled={this.state.downloadingPdf}>
                    <View style={{flexDirection: "row"}}>
                        <Icon name={'file'} style={{color: 'rgb(0, 115, 209)', marginRight: 5, textAlignVertical: "center"}} size={15}/>
                        <MyText style={{fontWeight: "bold"}}>Display the consignment note</MyText>
                        <ActivityIndicator size="small" color="rgb(0, 115, 209)" animating={this.state.downloadingPdf}/>
                    </View>
                </TouchableOpacity>

                <Header>Activity feed</Header>
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
        await RNFetchBlob.android.actionViewIntent(path, 'application/pdf');
        this.setState({
            downloadingPdf: false
        });
    }

    eventText(event, names) {
        const name = names[event.author.username] || event.author.username;
        switch (event.type) {
            case 'ArrivalOnSite':
                return `${name} arrived on ${event.site} site.`;
            case 'LoadingComplete':
                return `${name} completed the loading.`;
            case 'UnloadingComplete':
                return `${name} completed the unloading.`;
            case 'AssignDriver':
                return `${name} assigned transport to driver ${event.assignedDriver ? event.assignedDriver.name : "unknown"}.`;
            case 'Acknowledge':
                return `${name} acknowledged the transport`;
            default:
                return `${name} completed ${event.type}`;
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
            'Confirmation',
            'Are you sure you want to acknowledge the transport?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: 'OK', onPress: () => this.acknowledge()}
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
                item: result
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
            'Confirmation',
            'Are you sure you want to notify your arrival at site?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: 'OK', onPress: () => this.notifyArrival()}
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
                item: result
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
            item: response.data.getContract
        })
    }

    componentWillUnmount() {
        this.navigationEventSubscription.remove();
    }

    componentDidMount() {
        this.navigationEventSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                this.refresh();
            }
        );
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
        padding: 10
    },
    package: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgb(200, 200, 200)',

        padding: 10,
        flexDirection: 'row',
        alignItems: "center"
    },
    packageIcon: {
        flex: 1,
        color: 'rgb(0, 115, 209)'
    },
    packageText: {
        flex: 10
    },
    action: {
        backgroundColor: 'rgb(240,240,240)',
        padding: 10,

        borderTopColor: 'rgb(219, 219, 219)',
        borderTopWidth:  StyleSheet.hairlineWidth
    },
    activityDoneText: {
        color: activityDoneColor,
        fontWeight: 'bold',
        paddingLeft: 5
    },
    activityItemContainer: {
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'black'
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
