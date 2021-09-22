import React, {Component} from 'react';
import {View, Text, Modal, Platform} from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const toolbarHeight = Platform.select({
  android: 0,
  ios: 22,
});

const modalViewStyle = {
  paddingTop: toolbarHeight,
  flex: 1,
};

class SignatureView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  show(display) {
    this.setState({visible: display});
  }

  render() {
    const {visible} = this.state;

    return (
      <Modal
       // style={{height:100,width:100}}
        transparent={false}
        visible={visible}
        onRequestClose={this._onRequreClose.bind(this)}>
        <View style={modalViewStyle}>
          <View style={{padding: 10, flexDirection: 'row'}}>
            <Text onPress={this._onPressClose.bind(this)}><Icon name="close" size={23}></Icon></Text>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{fontSize: 14,fontWeight:'bold',textAlign:'center'}}>Por favor Ingrese su firma.</Text>
            </View>
          </View>
          <SignatureCapture
            style={{flex: 1, width: '100%', height:200}}
            onDragEvent={this._onDragEvent.bind(this)}
            onSaveEvent={this._onSaveEvent.bind(this)}
            backgroundColor="#ffffff"
            strokeColor="#000000"
            minStrokeWidth={5}
            maxStrokeWidth={5}
          />
        </View>
      </Modal>
    );
  }

  _onPressClose() {
    this.show(false);
  }

  _onRequreClose() {
    this.show(false);
  }

  _onDragEvent() {
    // This callback will be called when the user enters signature
    //console.log('dragged');
  }

  _onSaveEvent(result) {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    this.props.onSave && this.props.onSave(result);
  }
}

export default SignatureView;
