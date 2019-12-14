import {Component} from "react";
import React from "react";
import {MyText} from "./Components";
import {Button, View, Modal, TouchableHighlight, TextInput, Text} from "react-native";
import { Auth } from 'aws-amplify';

export default class SignatoryInformation extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: 'Signatory information'
    });

    constructor(props) {
        super(props);
        this.state = {
            signatoryName: '',
            signatoryEmail: '',
            contract: props.navigation.getParam("item"),
            site: props.navigation.getParam("site")
        };
    }

    render() {
        return (
            <View style={{backgroundColor: 'rgb(245,245,245)', flex: 1}}>
                <Text style={{padding: 20, color: 'rgb(0, 115, 209)', fontSize: 25}}>Please enter the details of the signatory:</Text>
                <View style={{padding: 10, flex: 1, flexDirection: 'column'}}>


                    <MyText>Name of signatory</MyText>
                    <TextInput
                        value={this.signatoryName}
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 5, marginBottom: 15}}
                        placeholder="John Smith..."
                        onChangeText={(signatoryName) => this.setState({signatoryName})}/>
                    <MyText>Email of signatory</MyText>
                    <TextInput
                        value={this.signatoryEmail}
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 5, marginBottom: 15}}
                        placeholder="john@smith.com..."
                        onChangeText={(signatoryEmail) => this.setState({signatoryEmail})}/>
                    <Button
                        color={"rgb(60,176,60)"}
                        title={"Save"}
                        onPress={() => this.save()}/>
                </View>
            </View>);
    }

    save() {
        const {navigate} = this.props.navigation;
        navigate('Signature', {
            item: this.state.contract,
            site: this.state.site,
            signatoryEmail: this.state.signatoryEmail,
            signatoryName: this.state.signatoryName
        });
    }
}