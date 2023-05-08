import React, {Component} from "react";
import {ActivityIndicator, View} from "react-native";
import {API, Auth, graphqlOperation, I18n, Storage} from "aws-amplify";
import {Button} from "react-native-elements";
import {SignatureCaptureView} from "./CaptureSignature";
import UUIDGenerator from "react-native-uuid-generator";
import {Buffer} from "buffer";
import moment from "moment/min/moment-with-locales";
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";

export class EditMySignature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false
        };
    }

    render() {
        return (
            <View style={{padding: 5, flex: 1}}>
                <SignatureCaptureView ref={"sign"} onSave={(result) => this._onSaveEvent(result)}/>

                <View>
                    <Button title={I18n.get("Save")} buttonStyle={{height: 60, backgroundColor: 'rgb(60,176,60)'}}
                            onPress={() => this.startSave()} disabled={this.state.saving}/>
                    <ActivityIndicator size="small" color="rgb(0, 115, 209)" animating={this.state.saving}/>
                </View>
            </View>
        );
    }

    finish() {
        return this.props.navigation.navigate('Transport', {
            item: this.state.finalContract,
            site: this.state.site
        });
    }

    startSave() {
        this.refs["sign"].startSave();
    }

    async _onSaveEvent(result) {
        try {
            const buffer = new Buffer(result.encoded, 'base64');
            const filename = await UUIDGenerator.getRandomUUID();
            const file = await Storage.put('profile-signature-' + filename + '.png', buffer);
            const now = moment().format();

            const user = await Auth.currentAuthenticatedUser();

            const userProfile = {
                signatureImage: {
                    bucket: 'bucket',
                    region: 'eu-central-1',
                    key: file.key
                },
                updatedAt: now
            };

            const response = await API.graphql(graphqlOperation(queries.userProfileByOwner, {
                owner: user.username
            }));
            if (response.data.userProfileByOwner.items.length === 0) {
                userProfile.owner = user.username;
                await API.graphql(graphqlOperation(mutations.createUserProfile, {
                    input: userProfile
                }));
            } else {
                userProfile.id = response.data.userProfileByOwner.items[0].id
                await API.graphql(graphqlOperation(mutations.updateUserProfile, {
                    input: userProfile
                }));
            }
        } catch (ex) {
            console.warn('cannot save signature', ex);
        }
    }
}