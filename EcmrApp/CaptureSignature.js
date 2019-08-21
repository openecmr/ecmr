import {Component} from "react";
import {FlatList, SectionList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {Address, MyText} from "./Components";
import {Button, CheckBox} from "react-native-elements";
import { Auth, Storage, graphqlOperation, API } from 'aws-amplify';
import SignatureCapture from 'react-native-signature-capture';
import UUIDGenerator from "react-native-uuid-generator";
import {Buffer} from "buffer";
import moment from "moment";
import * as mutations from "./graphql/mutations";

class CaptureSignature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contract: props.navigation.getParam("item"),
            site: props.navigation.getParam("site")
        };
    }

    render() {
        return (
            <View style={{padding: 5, flex: 1}}>
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
                <Button title={"Save"} buttonStyle={{height: 60, backgroundColor: 'rgb(60,176,60)'}}
                        onPress={() => this.save()}/>
            </View>
        );
    }

    save() {
        this.refs["sign"].saveImage();
    }

    async _onSaveEvent(result) {
        const buffer = new Buffer(result.encoded, 'base64');
        const filename = await UUIDGenerator.getRandomUUID();

        try {
            const file = await Storage.put('signature-' + filename + '.png', buffer);
            const now = moment().format();
            const user = await Auth.currentAuthenticatedUser();

            const event = {
                type: 'LoadingComplete',
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
                    }
                }
            };
            const contract = {...this.state.contract};
            contract.events.push(event);

            try {
                await API.graphql(graphqlOperation(mutations.updateContract, {input: contract}));
                this.props.navigation.popToTop();
            } catch (ex) {
                console.warn(ex);
            }
        } catch (error) {
            console.warn(error);
        }
    }
}

export default CaptureSignature;