import {Component} from "react";
import React from "react";
import {MyText} from "./Components";
import {View, TextInput, Text, Alert, StyleSheet} from "react-native";
import {Button} from "react-native-elements";

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

            <View style={{backgroundColor: 'white', flex: 1}}>
                <Text style={{padding: 10, color: 'rgb(0, 115, 209)', fontSize: 25, paddingBottom: 10}}>Please enter the details of the signatory:</Text>
                <View style={{padding: 10, flex: 1, flexDirection: 'column', paddingTop: 0}}>


                    <MyText>Name of signatory</MyText>
                    <TextInput
                        value={this.signatoryName}
                        style={styles.textInput}
                        placeholder="e.g. John Smith..."
                        onChangeText={(signatoryName) => this.setState({signatoryName})}/>
                    <MyText>Email of signatory (optional)</MyText>
                    <TextInput
                        autoCapitalize={"none"}
                        autoCompleteType={"email"}
                        keyboardType={"email-address"}
                        value={this.signatoryEmail}
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 5, marginBottom: 15}}
                        placeholder="e.g. john@smith.com..."
                        onChangeText={(signatoryEmail) => this.setState({signatoryEmail})}/>
                    <Button
                        buttonStyle={{height: 60, backgroundColor: "rgb(60,176,60)"}}
                        title={"Save"}
                        onPress={() => this.save()}/>
                </View>
            </View>);
    }

    save() {
        if (!this.state.signatoryName) {
            Alert.alert(
                'Required information',
                'Please enter the name of the signatory',
                [
                    {text: 'OK'}
                ],
                {cancelable: true}
            );
            return;
        }

        const {navigate} = this.props.navigation;
        navigate('Signature', {
            item: this.state.contract,
            site: this.state.site,
            signatoryEmail: this.state.signatoryEmail,
            signatoryName: this.state.signatoryName,
            photos: this.props.navigation.getParam("photos")
        });
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 15
    }
});