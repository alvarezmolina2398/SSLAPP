import React, { useState } from 'react';
import { View, Text, Alert, Modal, Image, ImageBackground, TextInput, StyleSheet, TouchableOpacity, Button, PermissionsAndroid } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import { ScrollView } from "react-native-gesture-handler";
import { NetworkInfo } from "react-native-network-info";
import DateField from "react-native-datefield"
import RNPickerSelect from 'react-native-picker-select';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import SignatureView from "../../componets/SignatureView"
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
export default class Detail extends React.Component {
  constructor(props) {
    super(props);

    //const data, setData] = useState(null);
    // this.signature = React.useState(null);
    this.signatureView = React.createRef(null);
    this.state = {
      modalVisible: false,
      loading: false,
      formularios: [],
      encabezado: {},
      idFormulario: 0,
      dataForm: {},
      firma: null,
      signature: null,
      idusuario: '',
      isConnected: false,
      imgFile: null,
    }

  }


  unsubscribe = NetInfo.addEventListener(statex => {
    // console.log("Connection type", state.type);
    console.log("Is connected?", statex.isConnected);
    this.setState({
      isConnected: statex.isConnected
    });

  });

  requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };


  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@idusario')
      // console.log(value)
      if (value !== null) {
        // value previously stored 
        this.setState({
          idusuario: value
        });
      }
    } catch (e) {
      // error reading value 
      console.log(e)
    }
  }


  onSave = function (result) {
    // console.log(result)
    let res = `data:image/png;base64,${result.encoded}`;

    this.state.signature = res;
    this.signatureView.current.show(false);

    this.setDataToForm('signature', res);
    // console.log(this.state.signature)
  };

  handleEmpty = () => {
    console.log('Empty');
  }

  getFormularioLocal = async (id) => {
    try {
      let ipA = '';
      NetworkInfo.getIPV4Address().then(ipAddress => {
        ipA = ipAddress;
      });
      let id_Fomsave = '@formulario_' + id;
      const jsonValue = await AsyncStorage.getItem(id_Fomsave);

      let strtdata = '{"idUsuario":"' + + this.state.idusuario + '","ip": "' + ipA + '", ' +
        '"navegador":"N/A", ' +
        '"dispositivo":"dispositivo móvil",' +
        '"longitud":"-90.5328", ' +
        '"latitud":"14.6248", ' +
        '"signature":"", ' +
        '"idFormulario":"' + + this.props.route.params.idFormulario + '",';
      let itemp = 0;
      let res = JSON.parse(jsonValue);
      res.records[0].detalle.forEach(element => {
        strtdata += ('"' + element.name + '": "",');
      });

      strtdata = strtdata.substring(0, strtdata.length - 1);
      strtdata += '}';

      this.setState({
        formularios: res.records[0].detalle,
        encabezado: res.records[0],
        loading: false,
        dataForm: JSON.parse(strtdata)
      });

    } catch (e) {
      console.log(e)
    }
  }


  componentDidMount() {
    this.requestCameraPermission();
    this.requestExternalWritePermission();
    NetInfo.fetch().then(state => {

      this.setState({
        isConnected: state.isConnected
      })


    });



    this.getFormulario();

  }

  enviarData() {
    // console.log(this.state.dataForm);

    if (this.state.isConnected) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "data": this.state.dataForm
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("https://backend.ssldigital.app/valores", requestOptions)
        .then(res => res.json())
        .then(res => {
          if (res.message == "ok") {
            this.setState({
              loading: false,
            })
            alert('Data enviada exitosamente.')
            this.props.navigation.pop();
          } else {

          }
        })
        .catch(error => console.log('error', error));
    } else {

      var raw = {
        "data": this.state.dataForm
      };

      this.guardarPendientes(raw);


    }

  }

  guardarPendientes = async (raw) => {
    const jsonPendientes = await AsyncStorage.getItem('@formulariosPendientes')
    if (jsonPendientes != null && jsonPendientes != "") {
      let newjsonPendientes = JSON.parse(jsonPendientes);

      newjsonPendientes.push(raw);

      await AsyncStorage.setItem('@formulariosPendientes', JSON.stringify(newjsonPendientes));


    } else {
      let Pendientes = [];
      Pendientes.push(raw)
      await AsyncStorage.setItem('@formulariosPendientes', JSON.stringify(Pendientes));
    }

    alert('Datos Almacenados en memoria Local, Ha espera de conexion para realziar el envio.')
    this.props.navigation.pop();
  }

  goBack() {

    this.props.navigation.pop();
  }

  getFormulario = () => {
    this.getData();
    // Get Local IP
    let ipA = '';
    NetworkInfo.getIPV4Address().then(ipAddress => {
      ipA = ipAddress;
    });
    this.setState({ loading: true });

    //console.log(this.props.route.params.idFormulario)
    if (this.state.isConnected) {
      let url = 'https://backend.ssldigital.app/formulario?id=' + this.props.route.params.idFormulario;
      // console.log(url)
      fetch(url)
        .then(res => res.json())
        .then(res => {
          //console.log(res.records[0].detalle);

          let strtdata = '{"idUsuario":"' + + this.state.idusuario + '","ip": "' + ipA + '", ' +
            '"navegador":"N/A", ' +
            '"dispositivo":"dispositivo móvil",' +
            '"longitud":"-90.5328", ' +
            '"latitud":"14.6248", ' +
            '"signature":"", ' +
            '"idFormulario":"' + + this.props.route.params.idFormulario + '",';
          let itemp = 0;
          res.records[0].detalle.forEach(element => {
            strtdata += ('"' + element.name + '": "",');
          });

          strtdata = strtdata.substring(0, strtdata.length - 1);
          strtdata += '}';

          // console.log(strtdata)
          this.setState({
            formularios: res.records[0].detalle,
            encabezado: res.records[0],
            loading: false,
            dataForm: JSON.parse(strtdata)
          });

        });
    } else {

      this.getFormularioLocal(this.props.route.params.idFormulario);



    }








  }

  setDataToForm = (name, value) => {

    let newData = this.state.dataForm;
    newData[name] = value;
    //console.log(newData)
    this.setState({
      dataForm: newData
    });

    // console.log(this.state.dataForm);
  }



  chooseFile = (name) => {
    // launchImageLibrary({
    //   title: 'Select una Imagen',
    //   type: 'library',
    //   options: {
    //     maxHeight: 200,
    //     maxWidth: 200,
    //     selectionLimit: 0,
    //     mediaType: 'photo',
    //     includeBase64: true,
    //   },
    // }, text => this.setImage(name,text.assets[0].uri));

    // let options = {
    //   title: 'Select una Imagen',
    //   type: 'library',
    //   options: {
    //     maxHeight: 200,
    //     maxWidth: 200,
    //     selectionLimit: 0,
    //     mediaType: 'photo',
    //     includeBase64: true,
    //   },
    // }


    // let options = {
    //   title: 'Select Image',
    //   customButtons: [
    //     { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
    //   ],
    //   storageOptions: {
    //     skipBackup: true,
    //     path: 'images',
    //   },
    // };

    try {
      let options = {
        title: 'Choose an Image',
        base64: true,
        includeBase64: true
      };

      launchImageLibrary(options, (response) => {
        // console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }

        let file = response.assets[0];
        //  console.log(file)
        //   console.log('base64 -> ', file.base64);
        // console.log('uri -> ', file.uri);
        // console.log('width -> ', file.width);
        // console.log('height -> ', file.height);
        // console.log('fileSize -> ', file.fileSize);
        // console.log('type -> ', file.type);
        // console.log('fileName -> ', file.fileName);
        //setFilePath(response);
       // console.log(name);
        this.setImage(name, file.base64);
      });

    }
    catch (e) {
      console.log(e)

    }



  };


  setImage(name, uri) {
    this.setDataToForm(name, uri);
    this.setState({ imgFile: uri })
    //console.log(this.state.imgFile);
    //console.log(uri);
  }


  getValueStore(name){
    //console.log(this.state.dataForm);
    return this.state.dataForm[name];
  }

  render() {

    const { modalVisible } = this.state;
    return (
      <View
        // source={require("../../images/back2.png")}
        style={{ height: "100%", width: "100%", backgroundColor: '#5657c0' }}
      >
        <View
          style={{
            flexDirection: "row",
            marginTop: 40,
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <TouchableOpacity onPress={() => this.goBack()}>
            <Icon name="arrow-left" size={30} color="#a2a2db" style={{ width: 20 }} />
          </TouchableOpacity>

          <Icon
            name="account-circle"
            size={33}
            color="#a2a2db"
            style={{ marginLeft: 230 }}
          />
        </View>

        <View
          style={{
            width: "100%",
            marginTop: 50,
            marginBottom: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontFamily: "RobotoBold",
              color: "#FFF",
            }}
          >
            {this.state.encabezado.nombre}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 40,
          }}
        >
          <Text
            style={{
              flex: 8,
              color: "#a2a2db",
              fontFamily: "RobotoRegular",
            }}
          >
            Fecha Creacion
          </Text>
          <Text
            style={{
              flex: 4,
              color: "#a2a2db",
              fontFamily: "RobotoRegular",
              textAlign: 'left',
            }}
          >
            Fecha Finaliza
          </Text>
        </View>
        <View style={{
          flexDirection: "row",
          paddingHorizontal: 40,
        }}>
          <Text
            style={{
              flex: 8,
              color: "#a2a2db",
              fontFamily: "RobotoRegular",
            }}
          >
            {Moment(this.state.encabezado.vigenciaInicio).format('d MMM YYYY')}
          </Text>
          <Text
            style={{
              flex: 4,
              color: "#a2a2db",
              fontFamily: "RobotoRegular",
            }}
          >
            {Moment(this.state.encabezado.vigenciaFin).format('d MMM YYYY')}
          </Text>
        </View>


        <ScrollView
          // showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: '#e9eafd',
            marginVertical: 5,
            marginTop: 10,

          }}
        >


          <View style={InitWindowStyles.root}>
            {this.state.formularios.map((item, i) => {
              if (item.type == 'text' || item.type == 'number') {
                return (

                  <View style={InitWindowStyles.rowContainer} key={"id-" + item.id}>
                    <Text style={InitWindowStyles.text}>{item.label.replace("<br>", "").replace(".&nbsp", "")}</Text>
                    <View style={InitWindowStyles.textdiv}>
                      <TextInput
                        autoCorrect={false}
                        onChangeText={text => this.setDataToForm(item.name, text)}
                        // value={this.state.userName}
                        style={InitWindowStyles.textInput}
                      />
                    </View>

                  </View>

                );
              } else if (item.type == "date") {
                return (
                  <View style={{ padding: 16 }} key={"id-" + item.id}>
                    <Text style={InitWindowStyles.text}>{item.label.replace("<br>", "").replace(".&nbsp", "")}</Text>
                    <DateField
                      labelDate="Dia"
                      labelMonth="Mes"
                      labelYear="Año"
                      // defaultValue={new Date()}
                      styleInput={InitWindowStyles.dateInput}
                      onSubmit={(value) => this.setDataToForm(item.name, Moment(value).format("DD/MM/YYYY"))}
                    />
                  </View>

                )

              } else if (item.type == "header") {
                let tam = 12;
                if (item.subtype == "h1") {
                  tam = 30;
                } else if (item.subtype == "h2") {
                  tam = 20;
                } if (item.subtype == "h3") {
                  tam = 18;
                } if (item.subtype == "h4") {
                  tam = 16;
                } if (item.subtype == "h5") {
                  tam = 14;
                }
                if (item.subtype == "h6") {
                  tam = 12;
                }
                return (
                  <View key={"id-" + item.id} style={{ padding: 16 }}>
                    <Text style={{ fontSize: tam, fontWeight: 'bold' }}>{item.label}</Text>
                  </View>
                )

              } else if (item.type == "select") {
                let options = [];
                let selected = 0;
                item.values.forEach(element =>

                  options.push({ label: element.label, value: element.value })
                );
                //  console.log(options)



                return (
                  <View style={InitWindowStyles.rowContainer} key={"id-" + item.id}>
                    <Text style={InitWindowStyles.text}>{item.label}</Text>
                    <View style={{ width: '100%' }}>
                      <RNPickerSelect
                        style={{
                          ...pickerSelectStyles,
                          iconContainer: {
                            top: 10,
                            right: 12,
                          },
                        }}
                        useNativeAndroidPickerStyle={false}
                        Icon={() => {
                          return <Icon name="arrow-down" size={24} color="gray" />;
                        }}
                        onValueChange={(value) => this.setDataToForm(item.name, value)}
                        items={options}
                      />
                    </View>
                  </View>
                )

              } else if (item.type == "checkbox-group") {
                return (
                  <View style={InitWindowStyles.rowContainer} key={"id-" + item.id}>
                    <Text style={InitWindowStyles.text}>{item.label.replace("<br>", "").replace(".&nbsp", "")}</Text>
                    {item.values.map((itemx, i) => {
                      return (
                        <View style={{ width: '100%', marginTop: 10 }} key={"id-rd-" + i}>
                          <BouncyCheckbox
                            size={25}
                            fillColor="purple"
                            unfillColor="#FFFFFF"
                            text={itemx.label}
                            iconStyle={{ borderColor: "purple" }}
                            textStyle={{ fontFamily: "JosefinSans-Regular" }}
                            onPress={(isChecked) => { this.setDataToForm(item.name + "-" + (i + 1), isChecked ? itemx.value : null) }}
                          />
                        </View>
                      )
                    }
                    )}

                  </View>
                )

              }
              else if (item.type == "radio-group") {
                let rdoptions = [];
                let selected = 0;
                item.values.forEach(element =>
                  rdoptions.push({ label: element.label, value: element.value })
                );
                return (
                  <View style={InitWindowStyles.rowContainer} key={"id-" + item.id}>
                    <Text style={InitWindowStyles.text}>{item.label}</Text>
                    <View style={{ width: '100%' }}>
                      <RadioForm

                        borderWidth={1}
                        buttonSize={15}
                        buttonColor={'#5657c0'}
                        radio_props={rdoptions}
                        initial={0}
                        //  buttonOuterColor={this.state.value3Index === i ? '#5657c0' : '#000'}
                        onPress={(value) => this.setDataToForm(item.name, value)}
                      />
                    </View>
                  </View>
                )

              } else if (item.type == "paragraph" && item.subtype == "canvas") {
                return (
                  <View key={"id-" + item.id}>
                    <TouchableOpacity
                      style={{ height: 200, backgroundColor: '#fff', marginVertical: 16, borderRadius: 20 }}
                      onPress={() => {
                        this.signatureView.current.show(true);
                      }}>
                      <View>
                        <Text style={styles.titleText}>
                          {this.state.signature ? 'Tu firma:' : 'Click para Poder firmar'}
                        </Text>
                        {this.state.signature && (
                          <View style={styles.imageContainer}>
                            <Image style={styles.previewImage} source={{ uri: this.state.signature }} />
                            <Button title="Clear" onPress={() => this.setState({ signature: null })} />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                    <SignatureView
                      ref={this.signatureView}
                      rotateClockwise={true}
                      onSave={(e) => this.onSave(e)}
                    />
                  </View>
                )
              } else if (item.type == "file") {
                return (
                  <View key={"id-" + item.id} >
                    <Text style={InitWindowStyles.text}>{item.label}</Text>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      style={{ height: 150, backgroundColor: '#fff', marginVertical: 16, borderRadius: 20, padding:16 }}
                      onPress={() => this.chooseFile(item.name)}>
                      <Text style={styles.titleText}>
                        Click Para Cargar la imagen
                      </Text>
                      {this.state.imgFile != null ? <Image
                        source={{ uri: 'data:image/png;base64,'+ this.getValueStore(item.name) }}
                        style={{ height: 100, width: 100 }}
                      />
                        : <Text></Text>}
                    </TouchableOpacity>
                  </View>
                )

              }
              else {
                return (
                  <View style={InitWindowStyles.rowContainer} key={"id-" + item.id}>
                    <Text style={InitWindowStyles.text}>Custom {item.label}</Text>
                  </View>
                )
              }
            })}
          </View>
          {!this.state.loading ? <TouchableOpacity onPress={() => this.enviarData()} style={{ borderRadius: 20, marginTop: 50, textAlign: 'center', backgroundColor: '#5657c0', color: '#fff', height: 50, alignContent: "center" }}>
            <Text style={{ color: '#fff', textAlign: 'center', alignSelf: 'center', marginTop: 15, fontSize: 16, fontWeight: 'bold' }}>ENVIAR FORMULARIO</Text>
          </TouchableOpacity> : null}
        </ScrollView>
      </View>
    );
  }





}

const styles = StyleSheet.create({
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
    padding: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: 16,
    fontSize: 18,
    color: '#62757f',
    fontWeight: 'bold',
    textAlign: 'center',
    // marginTop:80

  },
  imageContainer: {
    marginTop: 10,
    backgroundColor: 'white',
  },
  previewImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  preview: {
    width: 335,
    height: 114,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  previewText: {
    color: "#FFF",
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#69B2FF",
    width: 120,
    textAlign: "center",
    marginTop: 10,
  },
});

const InitWindowStyles = StyleSheet.create({
  preview: {
    height: 114,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    flex: 1,
  },
  root: {
    flex: 1,
    flexDirection: "column",
  },
  rowContainer: {
    padding: 16,
    flex: 12,
    flexDirection: "column",
    // justifyContent: "flex-start",
    alignItems: "center"
  },
  text: {
    flex: 12,
    marginLeft: 16,
    width: '100%',
    marginBottom: 5,
    color: '#000000'
  },
  textdiv: {
    backgroundColor: '#fff',
    borderRadius: 20,
    flex: 12,
    width: '100%',
  },
  textInput: {
    marginLeft: 10,
    borderColor: 'black',
    color: '#000000'
    //borderColor: '#eeeeee'
  },
  dateInput: {
    borderRadius: 20,
    backgroundColor: '#fff',
    width: '30%',
    color: '#000000'
  },
  h1: {
    fontSize: 20,
  },
  h2: {
    fontSize: 18,
  },
  h3: {
    fontSize: 16,
  },
  h4: {
    fontSize: 14,
  },
  h5: {
    fontSize: 12,
  },
  h6: {
    fontSize: 10,
  },
  select: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    backgroundColor: '#fff',
    // borderColor: 'gray',
    borderRadius: 4,
    width: '100%',
    flex: 12,
    color: 'black',
    paddingRight: 20, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    flex: 12,
    // borderWidth: 0.5,
    // borderColor: 'purple',
    borderRadius: 20,
    width: '100%',
    color: 'black',
    paddingRight: 10, // to ensure the text is never behind the icon
  },
});

