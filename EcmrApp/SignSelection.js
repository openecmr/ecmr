import {Component} from "react";
import {FlatList, StyleSheet, TouchableOpacity, View, Text, Alert} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {Address, MyText} from "./Components";
import {I18n} from "aws-amplify";

const SigningOption = ({onPress, iconName, title}) =>
    <TouchableOpacity style={styles.signingOption} onPress={onPress}>
        <Icon name={iconName} color={'rgb(187,222,251)'} size={50}/>
        <MyText>{title}</MyText>
    </TouchableOpacity>;

class SignSelection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contract: props.navigation.getParam("item"),
            site: props.navigation.getParam("site")
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>{this.state.site === 'pickup' ?
                    I18n.get('How does the sender sign?') :
                    I18n.get('How does the receiver sign?')}
                </Text>
                <View style={styles.options}>
                    <SigningOption onPress={() => this.signOnPhone()} iconName={"pencil-square-o"} title={I18n.get("On the phone")}/>
                    <SigningOption onPress={() => this.noOtherParty()} iconName={"ban"} title={I18n.get("No one on site")}/>
                </View>
            </View>
        )
    }

    signOnPhone() {
        const {navigate} = this.props.navigation;
        navigate('SignatoryInformation', {
            item: this.state.contract,
            site: this.state.site,
            photos: this.props.navigation.getParam("photos")
        });
    }

    noOtherParty() {
        Alert.alert(
            I18n.get('Not available'),
            I18n.get('This option is not yet available.'),
            [
                {text: I18n.get('OK')}
            ],
            {cancelable: true}
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'rgb(245,245,245)',
        flex: 1
    },
    header: {
        paddingTop: 20,
        color: 'rgb(0, 115, 209)',
        fontSize: 25
    },
    options: {
        flexDirection: 'row',
        paddingTop: 20
    },
    signingOption: {
        alignItems: 'center',
        backgroundColor: 'white',
        width: 150,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: 'rgb(187,187,187)',
        padding: 5,
        margin: 10
    }
});

export default SignSelection;