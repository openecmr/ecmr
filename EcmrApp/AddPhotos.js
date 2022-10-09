import React, {Component} from "react";
import {Image, Modal, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {InputRow, MyText} from "./Components";
import {Button} from "react-native-elements";
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {I18n} from "aws-amplify";
import moment from "moment/min/moment-with-locales";

class AddPhotos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contract: props.route.params.item,
            site: props.route.params.site,
            photos: [
                {}, {}, {}
            ]
        };

        this.finish = this.finish.bind(this);
        this.addPhoto = this.addPhoto.bind(this);
    }

    buttonTitle() {
        return I18n.get("Continue with signature");
    }

    attachmentMode() {
        return false;
    }

    render() {
        return (
            <View style={styles.baseContainer}>
                <MyText style={styles.header}>{I18n.get('E.g. photos of the load, delivery documents, etc.')}</MyText>

                {this.attachmentMode() && <View style={{backgroundColor: 'rgb(237,237,237)', marginTop: 10, padding: 10, borderRadius: 5}}>
                    <TextInput
                        autoCapitalize={"sentences"}
                        value={this.state.attachmentDescription}
                        style={{textAlign: 'center', fontWeight: 'bold', padding: 0}}
                        placeholder={I18n.get("Add a description...")}
                        onChangeText={attachmentDescription => this.setState({attachmentDescription})}/>
                </View>}

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
                            title={this.buttonTitle()}
                            loading={this.state.loading}
                            disabled={this.state.loading}
                            onPress={this.finish}/>
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
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                ImageResizer.createResizedImage(response.uri,
                    800,
                    600,
                    "JPEG", 60, 0, null, true)
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
        const source = {
            uri: response.uri
        };
        const photos = this.state.photos;
        photos[idx].imageSource = source;
        photos[idx].uri = response.uri;
        photos[idx].timestamp = moment().format();
        this.setState({
            photos
        });
    }

    finish() {
        const {navigate} = this.props.navigation;
        navigate('SignSelection', {
            item: this.state.contract,
            site: this.state.site,
            photos: this.state.photos.filter(photo => photo.uri),
            oldLoads: this.props.route.params.oldLoads,
            position: this.props.route.params.position
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
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
});

export default AddPhotos;