import {Component} from "react";
import {
    ActivityIndicator,
    Text,
    TouchableHighlight,
    View
} from "react-native";
import React from "react";
import {HandOverModal} from "./Components";
import {Button} from "react-native-elements";
import {Auth, Storage, I18n} from 'aws-amplify';
import SignatureCapture from 'react-native-signature-capture';
import UUIDGenerator from "react-native-uuid-generator";
import {Buffer} from "buffer";
import moment from "moment/min/moment-with-locales";
import {createUpdateContractInput, getDriverSignatureImage, geoUtil, updateContract, uploadPhotos} from "./DataUtil";


export class SignatureCaptureView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <View style={{borderWidth: 1, borderColor: '#000033', padding: 0, margin: 5, flex: 1}}>
            <SignatureCapture
                style={{flex: 1}}
                ref="sign"
                saveImageFileInExtStorage={false}
                showNativeButtons={false}
                showTitleLabel={false}
                showBorder={true}
                onSaveEvent={(result) => this.props.onSave(result)}
                viewMode={"portrait"}/>


            <TouchableHighlight style={{
                position: "absolute",
                left: 5,
                bottom: 5,
                alignItems: "center",
                backgroundColor: "white"
            }}
                                onPress={() => {
                                    this.refs["sign"].resetImage()
                                }}>
                <Text>{I18n.get("Reset")}</Text>
            </TouchableHighlight>
        </View>;
    }

    startSave() {
        this.refs["sign"].saveImage();
    }
}

class CaptureSignature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contract: props.route.params.item,
            site: props.route.params.site,
            saving: false,
            handoverPhone: false
        };
    }

    render() {
        return (
            <View style={{padding: 5, flex: 1}}>
                <HandOverModal
                    onPress={() => this.finish()}
                    visible={this.state.handoverPhone}
                    text={I18n.get("Please return the phone to the driver")}/>
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

            const signatureImageDriver = await getDriverSignatureImage(user);

            const params = this.props.route.params;
            const photos = await uploadPhotos(params.photos);

            const signatoryObservation = params.signatoryObservation;
            const signatoryName = params.signatoryName;
            const signatoryEmail = params.signatoryEmail;
            const sendCopy = params.sendCopy;
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
                    signatureImageDriver,
                    ...signatoryName && {signatoryName},
                    ...signatoryEmail && {signatoryEmail}
                },
                ...signatoryObservation && {signatoryObservation},
                sendCopy: sendCopy,
                photos
            };
            if (this.props.route.params.position) {
                event.geoposition = geoUtil.toGeoPosition(this.props.route.params.position);
            }

            const update = createUpdateContractInput(this.state.contract);
            update.events.push(event);
            update.status = this.state.site === 'pickup' ? 'IN_PROGRESS' : 'DONE';
            if (this.state.contract.orderStatus) {
                update.orderStatus = this.state.site === 'pickup' ? 'IN_PROGRESS' : 'DONE';
            }
            const oldLoads = params.oldLoads;
            if (oldLoads) {
                update.loads = this.state.contract.loads;
                event.oldLoads = oldLoads;
                event.newLoads = this.state.contract.loads;
            }

            const finalContract = await updateContract(update);

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