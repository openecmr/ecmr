import {Component} from "react";
import {ActivityIndicator, FlatList, SectionList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {Address, HandOverModal, MyText} from "./Components";
import {Button, CheckBox} from "react-native-elements";
import { Auth, Storage, graphqlOperation, API } from 'aws-amplify';
import SignatureCapture from 'react-native-signature-capture';
import UUIDGenerator from "react-native-uuid-generator";
import {Buffer} from "buffer";
import moment from "moment";
import * as mutations from "./graphql/mutations";
import {createUpdateContractInput, updateContract} from "./DataUtil";


class CaptureSignature extends Component {
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
                    onPress={() => this.props.navigation.popToTop()}
                    visible={this.state.handoverPhone}
                    text={`Please return the phone to the driver`}/>
                <View style={{borderWidth: 1, borderColor: '#000033', padding: 5, margin: 5, flex: 1}}>
                    <SignatureCapture
                        style={{flex:1}}
                        ref="sign"
                        saveImageFileInExtStorage={false}
                        showNativeButtons={false}
                        showTitleLabel={false}
                        showBorder={true}
                        onSaveEvent={(result) => this._onSaveEvent(result)}
                        viewMode={"portrait"}/>
                </View>
                <View>
                    <Button title={"Save"} buttonStyle={{height: 60, backgroundColor: 'rgb(60,176,60)'}}
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
            const userInfo = await Auth.currentUserInfo();

            const photos = await Promise.all(this.props.navigation.getParam("photos").map(async (photo) => {
                const photoBuffer = new Buffer(photo.data, 'base64');
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
            const event = {
                type: this.state.site === 'pickup' ? 'LoadingComplete' : 'UnloadingComplete',
                site: this.state.site,
                createdAt: now,
                author: {
                    username: user.username.indexOf("Google") !== -1 ? userInfo.attributes.email : user.username
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
                photos
            };
            const input = createUpdateContractInput(this.state.contract);
            input.events.push(event);
            input.status = this.state.site === 'pickup' ? 'IN_PROGRESS' : 'DONE';


            await updateContract(input);

            this.setState({
                handoverPhone: true
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