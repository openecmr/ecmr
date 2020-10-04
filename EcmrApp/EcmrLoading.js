import AuthPiece, {IAuthPieceProps, IAuthPieceState} from "aws-amplify-react-native/src/Auth/AuthPiece";
import {AmplifyThemeType} from "aws-amplify-react-native/src/AmplifyTheme";
import {Image, View} from "react-native";
import {Header} from "aws-amplify-react-native/src/AmplifyUI";
import {I18n} from "aws-amplify";
import React from "react";

export default class EcmrLoading extends AuthPiece {
    constructor(props) {
        super(props);

        this._validAuthStates = ['loading'];
    }

    showComponent(theme) {
        return (
            <View style={{marginTop: -30, flex: 1, flexDirection: "column"}}>
                <Image resizeMode={"cover"} style={{flex: 1}}
                       source={require('./images/loading2.jpg')}/>
            </View>
        );
    }
}