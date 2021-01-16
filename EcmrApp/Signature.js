import {Component} from "react";
import {Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput} from "react-native";
import React from "react";
import {Address, HandOverModal, MyText} from "./Components";
import {Button, CheckBox} from "react-native-elements";
import {I18n} from "aws-amplify";

class Signature extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: I18n.get('Check information')
    });

    constructor(props) {
        super(props);
        this.state = {
            contract: props.navigation.getParam("item"),
            site: props.navigation.getParam("site"),
            signatoryName: props.navigation.getParam("signatoryName"),
            signatoryEmail: props.navigation.getParam("signatoryEmail"),
            addingRemark: false,
            handoverPhone: true,
            sendCopy: false
        };
    }


    render() {
        return (
            <View style={{padding: 10, flex: 1}}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.addingRemark}
                    onRequestClose={() => this.setState({addingRemark: false})}>
                    <View style={{padding: 10, flex:1, justifyContent: "center", alignContent: "center"}}>
                        <View>
                            <TextInput
                                multiline
                                numberOfLines={5}
                                value={this.state.signatoryObservation}
                                style={{textAlignVertical: 'top', minHeight: 120, maxHeight: 120, borderColor: 'gray', borderWidth: 1, marginTop: 5, marginBottom: 15}}
                                placeholder={I18n.get("Enter an observation...")}
                                onChangeText={(signatoryObservation) => this.setState({signatoryObservation})}/>

                            <Button
                                buttonStyle={{height: 60}}
                                color={"rgb(60,176,60)"}
                                title={I18n.get("Save")}
                                onPress={() => this.setState({addingRemark: false})}/>
                        </View>
                    </View>
                </Modal>

                <HandOverModal
                    onPress={() => this.setState({handoverPhone: false})}
                    visible={this.state.handoverPhone}
                               text={I18n.get("Please hand the phone to ${signatoryName}").replace("${signatoryName}", this.state.signatoryName)}/>

                <MyText style={{fontWeight: 'bold', fontSize: 17, textAlign: 'center'}}>{this.state.signatoryName}, {I18n.get("please check the information below before signing")}</MyText>
                <MyText style={{marginTop: 10, color: 'rgb(66,133,244)', textAlign: 'center'}}>{I18n.get("By checking the box below, I agree with the terms and conditions of this carrier.")}</MyText>


                <CheckBox
                    onPress={() => this.toggleAgreeWithInformation()}
                    title={I18n.get('I agree with this information')}
                    containerStyle={{backgroundColor: 'white', marginTop: 10}}
                    checkedIcon='check-square'
                    uncheckedIcon='square'
                    checked={this.state.agree}
                />

                {!!this.state.signatoryEmail && <CheckBox
                    onPress={() => this.toggleSendCopy()}
                    title={I18n.get('Send a copy of the consignment to ${email}').replace("${email}", this.state.signatoryEmail)}
                    containerStyle={{backgroundColor: 'white', marginTop: 10}}
                    checkedIcon='check-square'
                    uncheckedIcon='square'
                    checked={this.state.sendCopy}
                />}

                {!!this.state.signatoryEmail &&
                    <View>
                        <MyText style={{fontWeight: 'bold', marginTop: 5}}>{I18n.get("Email address:")}</MyText>
                        <MyText style={{marginLeft: 10}}>{this.state.signatoryEmail}</MyText>
                    </View>
                }
                <MyText style={{fontWeight: 'bold', marginTop: 5}}>{I18n.get("Loads:")}</MyText>
                <View style={{marginLeft: 10}}>
                    <FlatList
                        data={this.state.contract.loads}
                        extraData={this.state}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={({item, index}) => (
                            <MyText>{item.quantity} {item.category}, {item.description}</MyText>
                        )}/>
                </View>

                <MyText style={{fontWeight: 'bold', marginTop: 5}}>{I18n.get("Driver observations:")}</MyText>
                <MyText style={{marginLeft: 10}}>{I18n.get("No observations")}</MyText>

                <MyText style={{fontWeight: 'bold', marginTop: 5}}>{I18n.get("Signatory observations:")}</MyText>
                <MyText style={{marginLeft: 10}}>{this.state.signatoryObservation || I18n.get("No observations")}</MyText>

                <View style={{flexDirection: 'row', margin: 10, marginTop: 5, position: 'absolute', bottom: 0, left: 10}}>
                    <Button containerStyle={{flex: 1, marginRight: 15}} buttonStyle={{height: 60}} title={I18n.get("Add observations")}
                            onPress={() => this.setState({addingRemark: true})}/>
                    <Button containerStyle={{flex: 1}} title={I18n.get("Sign")} buttonStyle={{height: 60, backgroundColor: 'rgb(60,176,60)'}}
                            onPress={() => this.captureSignature()}/>
                </View>
            </View>
        )
    }

    toggleAgreeWithInformation() {
        this.setState({
            agree: !this.state.agree
        })
    }

    toggleSendCopy() {
        this.setState({
            sendCopy: !this.state.sendCopy
        })
    }

    captureSignature() {
        if (!this.state.agree) {
            Alert.alert(
                I18n.get('Agree with information'),
                I18n.get('In order to sign you must agree with the provided information'),
                [
                    {text: I18n.get('OK')}
                ],
                {cancelable: true}
            );
            return;
        }

        const {navigate} = this.props.navigation;
        navigate('CaptureSignature', {
            item: this.state.contract,
            site: this.state.site,
            signatoryName: this.state.signatoryName,
            signatoryEmail: this.state.signatoryEmail,
            signatoryObservation: this.state.signatoryObservation,
            photos: this.props.navigation.getParam("photos"),
            sendCopy: this.state.sendCopy,
            oldLoads: this.props.navigation.getParam("oldLoads")
        });
    }
}

export default Signature;