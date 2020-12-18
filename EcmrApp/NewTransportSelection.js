import {TouchableOpacity, View} from "react-native";
import React from "react";
import {MyText} from "./Components";
import Icon from "react-native-vector-icons/FontAwesome5";

function NewTransportSelection({navigation: {navigate}}) {

    function addTransport() {
        navigate('AddTransportScreen');
    }

    return (
        <View style={{flex: 1, alignContent: "center", flexDirection: "row", justifyContent: "center"}}>
            <TouchableOpacity onPress={addTransport} style={{marginTop: 50, width: 200, height: 80, flexDirection: "column", justifyContent: "center", elevation: 10, padding: 15, borderRadius: 2, backgroundColor: "rgb(0, 115, 209)"}}>
                <Icon name={"plus"} size={20} style={{textAlign: "center", color: "white"}}/>
                <MyText style={{marginTop: 5, fontWeight: "bold", textAlign: "center", color: "white"}}>New transport</MyText>
            </TouchableOpacity>
        </View>
    )
}

export default NewTransportSelection;