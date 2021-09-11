import React from 'react';
import { View, Text, Alert, Modal, Image, ImageBackground, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import { ScrollView } from "react-native-gesture-handler";
import { NetworkInfo } from "react-native-network-info";
import DateField from "react-native-datefield"
import RNPickerSelect from 'react-native-picker-select';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import BouncyCheckbox from "react-native-bouncy-checkbox";
export default class Detail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      loading: false,
      formularios: [],
      encabezado: {},
      idFormulario: 0,
      dataForm: {},
    }

  }




  componentDidMount() {
    this.getFormulario();

  }


  enviarData() {
    // console.log(this.state.dataForm);


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
          this.props.navigation.pop();
        } else {

        }
      })
      .catch(error => console.log('error', error));
  }


  goBack() {

    this.props.navigation.pop();
  }



  getFormulario = () => {
    // Get Local IP
    let ipA = '';
    NetworkInfo.getIPAddress().then(ipAddress => {
      ipA = ipAddress;
    });
    this.setState({ loading: true });
    let url = 'https://backend.ssldigital.app/formulario?id=' + this.props.route.params.idFormulario;
    // console.log(url)
    fetch(url)
      .then(res => res.json())
      .then(res => {
        //console.log(res.records[0].detalle);

        let strtdata = '{"idUsuario":"34","ip": "' + ipA + '", ' +
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
                    <Text style={InitWindowStyles.text}>{item.label.replace("<br>", "")}</Text>
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
                    <Text style={InitWindowStyles.text}>{item.label.replace("<br>", "")}</Text>
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
                  <Text style={InitWindowStyles.text}>{item.label}</Text>
                    {item.values.map((itemx, i) => {
                        return(
                            <View style={{width:'100%', marginTop:10}} key={"id-rd-" + i}>
                              <BouncyCheckbox
                                size={25}
                                fillColor="purple"
                                unfillColor="#FFFFFF"
                                text={itemx.label}
                                iconStyle={{ borderColor: "purple" }}
                                textStyle={{ fontFamily: "JosefinSans-Regular" }}
                                onPress={(isChecked) => { this.setDataToForm(item.name+ "-"+(i+1),isChecked ? itemx.value : null) }}
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
          {!this.state.loading ? <TouchableOpacity onPress={() => this.enviarData()} style={{ borderRadius: 20, margin: 16, textAlign: 'center', backgroundColor: '#5657c0', color: '#fff', height: 50, alignContent: "center" }}>
            <Text style={{ color: '#fff', textAlign: 'center', alignSelf: 'center', marginTop: 15, fontSize: 16, fontWeight: 'bold' }}>ENVIAR FORMULARIO</Text>
          </TouchableOpacity> : null}
        </ScrollView>
      </View>
    );
  }



}
const InitWindowStyles = StyleSheet.create({
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

    //borderColor: '#eeeeee'
  },
  dateInput: {
    borderRadius: 20,
    backgroundColor: '#fff',
    width: '30%',
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

