import {Component} from "react";
import {
    ActivityIndicator,
    FlatList,
    SectionList,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {Address, HandOverModal, MyText} from "./Components";
import {Button, CheckBox} from "react-native-elements";
import {Auth, Storage, graphqlOperation, API, I18n} from 'aws-amplify';
import SignatureCapture from 'react-native-signature-capture';
import UUIDGenerator from "react-native-uuid-generator";
import {Buffer} from "buffer";
import moment from "moment/min/moment-with-locales";
import * as mutations from "./graphql/mutations";
import {createUpdateContractInput, updateContract} from "./DataUtil";


class CaptureSignature extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: I18n.get('Draw signature')
    });

    constructor(props) {
        super(props);
        this.state = {
            contract: props.navigation.getParam("item"),
            site: props.navigation.getParam("site"),
            saving: false,
            handoverPhone: false
        };
    }

    render() {
        return (
            <View style={{padding: 5, flex: 1}}>
                <HandOverModal
                    onPress={() => this.props.navigation.navigate('Transport', {
                        item: this.state.finalContract,
                        site: this.state.site
                    })}
                    visible={this.state.handoverPhone}
                    text={I18n.get("Please return the phone to the driver")}/>
                <View style={{borderWidth: 1, borderColor: '#000033', padding: 0, margin: 5, flex: 1}}>
                    <SignatureCapture
                        style={{flex:1}}
                        ref="sign"
                        saveImageFileInExtStorage={false}
                        showNativeButtons={false}
                        showTitleLabel={false}
                        showBorder={true}
                        onSaveEvent={(result) => this._onSaveEvent(result)}
                        viewMode={"portrait"}/>


                    <TouchableHighlight style={{
                        position: "absolute",
                        left: 5,
                        bottom: 5,
                        alignItems: "center",
                        backgroundColor: "white"}}
                                        onPress={() => { this.refs["sign"].resetImage() } }>
                        <Text>{I18n.get("Reset")}</Text>
                    </TouchableHighlight>
                </View>

                <View>
                    <Button title={I18n.get("Save")} buttonStyle={{height: 60, backgroundColor: 'rgb(60,176,60)'}}
                            onPress={() => this.save()} disabled={this.state.saving}/>
                    <ActivityIndicator size="small" color="rgb(0, 115, 209)" animating={this.state.saving}/>
                </View>
            </View>
        );
    }

    save() {
        this.refs["sign"].saveImage();
    }

    async _onSaveEvent(result) {
        if (this.state.saving) {
            return;
        }
        this.setState({
            saving: true
        });
        const buffer = new Buffer(result.encoded, 'base64');
        const filename = await UUIDGenerator.getRandomUUID();

        try {
            const file = await Storage.put('signature-' + filename + '.png', buffer);
            const now = moment().format();
            const user = await Auth.currentAuthenticatedUser();

            const photos = await Promise.all(this.props.navigation.getParam("photos").map(async (photo) => {
                const fetchResponse = await fetch(photo.uri);
                const photoBuffer = await fetchResponse.blob();
                const key = 'photo-' + (await UUIDGenerator.getRandomUUID()) + ".jpg";
                return {
                    bucket: 'bucket',
                    region: 'eu-central-1',
                    key: (await Storage.put(key, photoBuffer)).key
                }
            }));

            const signatoryObservation = this.props.navigation.getParam("signatoryObservation");
            const signatoryName = this.props.navigation.getParam("signatoryName");
            const signatoryEmail = this.props.navigation.getParam("signatoryEmail");
            const sendCopy = this.props.navigation.getParam("sendCopy");
            const event = {
                type: this.state.site === 'pickup' ? 'LoadingComplete' : 'UnloadingComplete',
                site: this.state.site,
                createdAt: now,
                author: {
                    username: user.username
                },
                signature: {
                    method: 'SIGN_ON_GLASS',
                    signatureImageSignatory: {
                        bucket: 'bucket',
                        region: 'eu-central-1',
                        key: file.key
                    },
                    ...signatoryName && {signatoryName},
                    ...signatoryEmail && {signatoryEmail}
                },
                ...signatoryObservation && {signatoryObservation},
                sendCopy: sendCopy,
                photos
            };
            const input = createUpdateContractInput(this.state.contract);
            input.events.push(event);
            input.status = this.state.site === 'pickup' ? 'IN_PROGRESS' : 'DONE';

            const oldLoads = this.props.navigation.getParam("oldLoads");
            if (oldLoads) {
                input.loads = this.state.contract.loads;
                event.oldLoads = oldLoads;
                event.newLoads = this.state.contract.loads;
            }

            const finalContract = await updateContract(input);

            this.setState({
                handoverPhone: true,
                finalContract
            });
        } catch (error) {
            console.warn(error);
            this.setState({
                saving: false
            })
        }
    }
}

export default CaptureSignature;