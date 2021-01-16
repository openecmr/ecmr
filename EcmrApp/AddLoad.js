import React, {Component, useState} from "react";
import {
    Alert,
    FlatList,
    Image,
    ListView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {MyText, requiredFieldsAlert, Sizes} from "./Components";
import {API, Auth, graphqlOperation, I18n} from "aws-amplify";
import {Button} from "react-native-elements";
import * as mutations from "./graphql/mutations"
import * as EmailValidator from "email-validator";
import RadioForm from "react-native-simple-radio-button";

AddLoad.navigationOptions = ({navigation, screenProps}) => ({
    title: I18n.get('Add load'),
    ...(navigation.getParam('editLoad') && navigation.getParam('onRemove') && {
        headerRight: () => (
            <Button
                containerStyle={{backgroundColor: 'red', marginEnd: 10}}
                onPress={() => {
                    const onRemove = navigation.getParam('onRemove');
                    onRemove(navigation.getParam('editLoad'));
                    navigation.goBack();
                }}
                title={I18n.get("Remove")}
            />
        )
    })
})

I18n.get('pallets');
I18n.get('packages');
I18n.get('roll containers');
I18n.get('bulk');

const packaging = () => [
    {
        label: I18n.get("pallets"),
        value: "pallets"
    },
    {
        label: I18n.get("packages"),
        value: "packages"
    },
    {
        label: I18n.get("roll containers"),
        value: "roll containers"
    },
    {
        label: I18n.get("bulk"),
        value: "bulk"
    }
]

function Field({label, value, icon, onChangeText, required, keyboardType = "numeric"}) {
    return <View style={{
        flexDirection: "row",
        alignItems: "center"
    }}>
        <Icon size={20} style={{textAlign: "center", width: 30, marginEnd: 15}} name={icon}/>
        <MyText>{label[0].toUpperCase()}{label.substring(1)}</MyText>{required && <MyText style={{color: "red"}}>*</MyText>}
        <TextInput
            keyboardType={keyboardType}
            value={value ? String(value) : null}
            style={styles.textInput}
            onChangeText={onChangeText}/>
    </View>;
}

function AddLoad({navigation}) {
    const initialLoad = {
        category: "pallets"
    };
    const editLoad = navigation.getParam("editLoad");
    const [load, setLoad] = useState(editLoad ? editLoad : initialLoad);
    const packagingOptions = packaging();

    function change(field) {
        return function(value) {
            setLoad({
                ...load,
                [field]: value
            });
        }
    }

    function validate() {
        if (!load.description) {
            requiredFieldsAlert();
            return false;
        }
        return true;
    }

    function save() {
        if (!validate()) {
            return;
        }

        const onSave = navigation.getParam("onSave");
        onSave(load);
        navigation.goBack();
    }

    function categoryIndex(load) {
        return packagingOptions.findIndex(p => p.value === load.category);
    }

    return (
        <View style={{flex: 1}}>
            <ScrollView style={{marginBottom: 50}}>
                <View style={{backgroundColor: 'white', padding: Sizes.PADDING_FROM_SCREEN_BORDER}}>
                    <RadioForm
                        buttonColor={'black'}
                        radio_props={packagingOptions}
                        initial={categoryIndex(load)}

                        onPress={change("category")}
                    />
                </View>

                <View style={styles.row}>
                    <Field label={I18n.get("quantity")} value={load.quantity} icon={"th"}
                           onChangeText={change("quantity")}/>
                </View>

                <View style={styles.row}>
                    <Field label={I18n.get("volume (m³)")} value={load.volume} icon={"ruler-combined"}
                           onChangeText={change("volume")}/>
                </View>

                <View style={styles.row}>
                    <Field label={I18n.get("net weight (kg)")} value={load.netWeight} icon={"weight-hanging"}
                           onChangeText={change("netWeight")}/>
                </View>

                <View style={styles.row}>
                    <Field label={I18n.get("loading meters (m)")} value={load.loadMeters} icon={"ruler"}
                           onChangeText={change("loadMeters")}/>
                </View>

                <View style={styles.row}>
                    <Field label={I18n.get("description")} value={load.description} icon={"archive"}
                           onChangeText={change("description")} keyboardType={"default"} required/>
                </View>
            </ScrollView>

            <Button containerStyle={{position: "absolute", start: 0, bottom: 0, end: 0}}
                    title={navigation.getParam('editLoad') ? I18n.get("Save") : I18n.get("Add")}
                    buttonStyle={{height: 40, backgroundColor: 'rgb(60,176,60)'}}
                    onPress={save} />
        </View>
    );
}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        flex: 1,
        marginLeft: 10
    },
    baseContainer: {
        flex: 1, padding: 10
    },
    row: {
        backgroundColor: 'white',
        paddingLeft: Sizes.PADDING_FROM_SCREEN_BORDER,
        paddingRight: Sizes.PADDING_FROM_SCREEN_BORDER,
        paddingTop: Sizes.PADDING_FROM_SCREEN_BORDER/2,
        paddingBottom: Sizes.PADDING_FROM_SCREEN_BORDER/2,
        marginTop: 5
    }
});



export default AddLoad;