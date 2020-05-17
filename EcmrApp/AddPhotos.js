import React, {Component} from "react";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {MyText} from "./Components";
import {Button} from "react-native-elements";
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {I18n} from "aws-amplify";

class AddPhotos extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: I18n.get('Add photos?')
    });

    constructor(props) {
        super(props);
        this.state = {
            contract: props.navigation.getParam("item"),
            site: props.navigation.getParam("site"),
            photos: [
                {}, {}, {}
            ]
        };

        this.signature = this.signature.bind(this);
        this.addPhoto = this.addPhoto.bind(this);
    }

    render() {
        return (
            <View style={styles.baseContainer}>
                <MyText style={styles.header}>{I18n.get('E.g. photos of the load, delivery documents, etc.')}</MyText>

                <View style={styles.photoFrameContainer}>
                    {
                        this.state.photos.map((photo, idx) => (
                            <TouchableOpacity onPress={() => this.addPhoto(idx)} key={idx} style={styles.photoFrameClick}>
                                <View style={styles.photoFrame}>
                                    {!photo.imageSource && <Icon name={"plus"} size={40} />}
                                    {photo.imageSource && <Image source={photo.imageSource} style={styles.photo} />}
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                </View>

                <View style={styles.alignBottom}>
                    <Button buttonStyle={{height: 60}}
                            containerStyle={{flex: 1, padding: 0}}
                            title={I18n.get("Continue with signature")}
                            onPress={this.signature}/>
                </View>
            </View>
        )
    }

    addPhoto(idx) {
        const options = {
            title: I18n.get('Select photo'),
            cancelButtonTitle: I18n.get('Cancel'),
            takePhotoButtonTitle: I18n.get('Take photo...'),
            chooseFromLibraryButtonTitle: I18n.get('Choose from library...'),
            chooseWhichLibraryTitle: I18n.get('Choose which library'),
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            rotation: 360
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                let rotation = 0
                if (response.originalRotation === 90) {
                    rotation = 90
                } else if (response.originalRotation === 270) {
                    rotation = -90
                } else if (response.isVertical) {
                    rotation = 90;
                }


                ImageResizer.createResizedImage(response.uri,
                    800,
                    600,
                    "JPEG", 60, rotation, null)
                    .then(async (response) => {
                        if (response.size > 250000) {
                            console.warn(`image still too big ${response.size}`);
                            return;
                        }
                        this.addPhotoState(response, idx);
                    }).catch((err) => {
                    console.warn(`cannot resize image ${err}`)
                });
            }
        });
    }

    addPhotoState(response, idx) {
        const source = {uri: response.uri};
        const photos = this.state.photos;
        photos[idx].imageSource = source;
        photos[idx].uri = response.uri;
        this.setState({
            photos
        });

    }

    signature() {
        const {navigate} = this.props.navigation;
        navigate('SignSelection', {
            item: this.state.contract,
            site: this.state.site,
            photos: this.state.photos.filter(photo => photo.uri),
        });
    }
}

const styles = StyleSheet.create({
    header: {
        fontSize: 18
    },
    photoFrame: {
        marginLeft: 10,
        aspectRatio: 3 / 4,
        justifyContent: 'center',
        alignItems: "center",
        borderColor: "gray",
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 5
    },
    photoFrameContainer: {
        flexDirection: "row",
        marginTop: 20,
        flex: 1
    },
    photo: {
        height: "100%",
        width: "100%",
        borderRadius: 5
    },
    baseContainer: {
        flex: 1, padding: 10
    },
    photoFrameClick: {
        flex: 1
    },
    alignBottom: {
        flexDirection: 'row',
        margin: 10,
        marginTop: 5,
        position: 'absolute',
        bottom: 0, left: 10
    }
});

export default AddPhotos;