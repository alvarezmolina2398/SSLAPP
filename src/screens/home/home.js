import React from 'react';
import { View, Text, ViewPropTypes, ImageBackground, Image, TextInput, TouchableOpacity } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      formularios: [],
      idEmpresa: null,
      isConnected: true,
      cantidadPendientes: 0,
      Pendientes: []
    }



  }

  unsubscribe = NetInfo.addEventListener(statex => {
    // console.log("Connection type", state.type);
    // console.log("Is connected?", state.isConnected);
    this.setState({
      isConnected: statex.isConnected
    });


    

  });

  componentDidMount() {
    NetInfo.fetch().then(state => {

      this.setState({
        isConnected: (state.isConnected)
      })

      // if (state.isConnected) {
      //   this.getPendientes();
      // }


    });

    this.getPendientes();
    this.getData();

  }

  // componentWillMount(){
  //   this.getData();
  // }

  getData = async () => {
    try {
      const login = await AsyncStorage.getItem('@isLogin');

      const value = await AsyncStorage.getItem('@idempresa');
      if (login == "true") {
        // if(value!=nul)

        if (value != null) {
          this.setState({ idEmpresa: value })

        }
        //setTimeout(this.setState({idEmpresa: value}), 1000);

        //  this.getFormularios()
        this.getFormularios();
      } else {
        console.log('Cerrar Sesion')
        await AsyncStorage.setItem('@isLogin', "false");
        await AsyncStorage.setItem('@idusario', "");
        await AsyncStorage.setItem('@idempresa', "");
        await AsyncStorage.setItem('@nombre', "");
        await AsyncStorage.setItem('@correo', "");
        this.props.navigation.replace('Login');
      }
    } catch (e) {
      // error reading value 
      console.log(e)
    }
  }

  saveFormulariosData = async (value) => {
    try {
      //  console.log(value)
      const jsonValue = JSON.stringify(value)
      //  console.log(jsonValue)
      await AsyncStorage.setItem('@formularios', jsonValue)



      value.forEach(element => {
        let url = 'https://backend.ssldigital.app/formulario?id=' + element.id;
        // console.log(url)
        fetch(url)
          .then(res => res.json())
          .then(res => {
            // console.log(strtdata)
            // this.setState({
            //   formularios: res.records[0].detalle,
            //   encabezado: res.records[0],
            //   loading: false,
            //   dataForm: JSON.parse(strtdata)
            // });

            let id_Fomsave = '@formulario_' + element.id;
            AsyncStorage.setItem(id_Fomsave, JSON.stringify(res))

          });
      });


    } catch (e) {
      console.log('error ' + e)
    }
  }

  getIdEmpresa = async () => {
    try {

      const value = await AsyncStorage.getItem('@idempresa');
      let val = '';
      if (value != null) {
        val = value;
      }
      return val
    } catch (e) {
      // error reading value 
      console.log(e)
      return '0'
    }
  }

  getPendientes = async () => {
    const jsonValue = await AsyncStorage.getItem('@formulariosPendientes');

    if (jsonValue != null) {
      let Pendientes = JSON.parse(jsonValue);
      let cantidad = 0;
      Pendientes.forEach(element => {
        cantidad++;
      });
      console.log(cantidad)
      this.setState({
        cantidadPendientes: cantidad,
        Pendientes: Pendientes
      });

      this.getFormularios();
    }


  }



  getFormulariosLocal = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@formularios');

      this.setState({
        formularios: JSON.parse(jsonValue)
      });


    } catch (e) {
      console.log(e)
    }
  }

  getFormularios() {
    //this.setState({ loading: true });
    //console.log(this.idEmpresa);
    const IdEm = this.state.idEmpresa;
    console.log(IdEm);
   // setTimeout(() => {console.log(IdEm)}, 1000)
    if(IdEm == null){
      this.getData();
      
    }else{
      let url = "https://backend.ssldigital.app/formulario?vigencia=true&idEmpresa=" + IdEm;
      console.log(url)
        if (this.state.isConnected) {
          fetch(url)
            .then(res => res.json())
            .then(res => {
              console.log(res);
              this.setState({
                formularios: res.records,
                loading: false,
              });
              this.saveFormulariosData(res.records);
            })
        } else {
          this.getFormulariosLocal();
        }
    }
    

  }


  getFormularios2(idEmpresa) {


    // this.setState({ loading: true });
    // console.log(this.state.idEmpresa);

    // if (this.state.isConnected) {
    //   console.log('consume "https://backend.ssldigital.app/formulario?vigencia=true&idEmpresa=' + idEmpresa)
    //   fetch("https://backend.ssldigital.app/formulario?vigencia=true&idEmpresa=" + idEmpresa)
    //     .then(res => res.json())
    //     .then(res => {
    //       //console.log(res.records);
    //       this.setState({
    //         formularios: res.records,
    //         loading: false,
    //       });
    //       this.saveFormulariosData(res.records);
    //     });
    // } else {
    //   this.getFormulariosLocal();
    // }

    // if(idEmpresa != null){
    //   this.setState({
    //     idEmpresa : idEmpresa
    //   });
    //   this.getFormularios();
    // }else{
    //   setTimeout(this.getData(),1000)
    // }

    //  console.log('empresa ',idEmpresa)

  }


  sendPendientes() {


    if (this.state.isConnected) {
      if (this.state.cantidadPendientes) {
        this.state.Pendientes.forEach(element => {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          var raw = JSON.stringify(element);

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
                // this.props.navigation.pop();
              } else {
                console.log(res)
              }
            })
            .catch(error => console.log('error', error));


          let newPendientes = [];
          AsyncStorage.setItem('@formulariosPendientes', JSON.stringify(newPendientes));
          this.setState({
            Pendientes: [],
            cantidadPendientes: 0
          })

        });


        alert('Formularios Enviados Exitosamente.');
      } else {
        alert('No existen Formularios Pendientes de  Enviar.');
      }

    } else {
      alert('Es necesario tener una conexion a Intenet.')
    }

  }


  cerrarSesion = async () => {
    try {
      console.log('Cerrando Sesion')
      await AsyncStorage.setItem('@isLogin', "false");
      await AsyncStorage.setItem('@idusario', "");
      await AsyncStorage.setItem('@idempresa', "");
      await AsyncStorage.setItem('@nombre', "");
      await AsyncStorage.setItem('@correo', "");
      this.props.navigation.replace('Login');
    }
    catch (e) {
      console.log(e)
    }
  }


  render() {
    return (
      <ImageBackground
        source={require("../../images/back.png")}
        style={{ width: "100%", height: "100%" }}
      >
        <View
          style={{
            flexDirection: "row",
            marginTop: 40,
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <Icon name="menu" size={30} color="#a2a2db" style={{ width: 20 }} />
          <TouchableOpacity onPress={() => this.cerrarSesion()}>
            <Icon
              name="logout"
              size={33}
              color="#a2a2db"
              style={{ marginLeft: 230 }}
            />
          </TouchableOpacity>

        </View>

        <View style={{ paddingHorizontal: 40, marginTop: 25 }}>
          <Text
            style={{
              fontSize: 40,
              color: "#522289",
              fontFamily: "RobotoBold",
            }}
          >
            Hola
          </Text>

          <Text
            style={{
              fontSize: 15,
              paddingVertical: 10,
              paddingRight: 80,
              lineHeight: 22,
              fontFamily: "RobotoRegular",
              color: "#a2a2db",
            }}
          >
            Bienvenido, Recuerda revisar tu conexión de internet para actualizar tu formularios.
          </Text>

          {/* <View
            style={{
              flexDirection: "row",
              backgroundColor: "#FFF",
              borderRadius: 40,
              alignItems: "center",
              paddingVertical: 10,
              paddingHorizontal: 20,
              marginTop: 30,
            }}
          >
            <Icon name="search" size={14} style={{ color: "#a2a2db",}}></Icon>
            
            
            <TextInput
              placeholder="Buscar Formulario"
              style={{ paddingHorizontal: 20, fontSize: 15, color: "#ccccef" }}
            />
          </View> */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginLeft: 25, marginTop: 80, alignContent: 'center' }}
          >
            <TouchableOpacity onPress={() => this.getFormularios()}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  width: 50,
                  borderRadius: 50,
                  backgroundColor: "#ff5c83",
                  marginHorizontal: 22,
                }}
              >
                <Icon name="refresh" color="white" size={32} />
              </View>
            </TouchableOpacity>


            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 50,
                width: 50,
                borderRadius: 50,
                backgroundColor: this.state.isConnected ? "#43a047" : "#f50057",
              }}
            >
              <Icon name={this.state.isConnected ? "wifi" : "wifi-off"} color="white" size={32} />
            </View>
            <TouchableOpacity onPress={() => this.sendPendientes()}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  width: 50,
                  borderRadius: 50,
                  backgroundColor: "#bb32fe",
                  marginLeft: 22,
                }}
              >
                <Icon name="cloud-upload" color="white" size={32} />
              </View>
              <Text style={{ color: '#bb32fe', fontWeight: 'bold' }}>{this.state.cantidadPendientes > 0 ? this.state.cantidadPendientes + " Pendientes" : ""} </Text>
            </TouchableOpacity>
          </ScrollView>

          <Text
            style={{
              color: "#FFF",
              fontFamily: "RobotoRegular",
              marginTop: 50,
              fontSize: 17,
            }}
          >
            Formularios Disponibles
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -35, marginTop: 30 }}
          >


            {this.state.formularios.map((dataInfo, i) => {
              const fin = Moment(dataInfo.vigenciaInicio);
              const ini = Moment(dataInfo.vigenciaFin);
              return (
                <TouchableOpacity key={"fun" + dataInfo.id}
                  onPress={() => this.props.navigation.navigate('Detail', { idFormulario: dataInfo.id })}>
                  <View
                    style={{
                      backgroundColor: "#FEFEFE",
                      height: 200,
                      width: 200,
                      borderRadius: 15,
                      marginLeft: 15,
                      padding: 10,

                    }}
                  >
                    <Text style={{ color: '#522289', textAlign: 'center' }}>
                      {dataInfo.nombre}
                    </Text>

                    <View style={{ height: 2, width: "100%", backgroundColor: "#522289", borderRadius: 20 }}>

                    </View>
                    <Text style={{ paddingHorizontal: 15, paddingVertical: 2, fontSize: 10, marginTop: 15 }}>
                      <Icon name="clock-time-seven-outline" color="#522289" size={25}></Icon>  {ini.diff(fin, 'days')} dias Restantes
                    </Text>
                    <Text style={{ paddingHorizontal: 15, paddingVertical: 2, fontSize: 10 }}>
                      <Icon name="calendar-month-outline" color="#522289" size={25}></Icon>  {Moment(dataInfo.vigenciaInicio).format('d MMM YYYY')} al {Moment(dataInfo.vigenciaFin).format('d MMM YYYY')}
                    </Text>
                    <Text style={{ paddingHorizontal: 15, paddingVertical: 2, fontSize: 10 }}>
                      <Icon name="download" color="#522289" size={25}></Icon> Descargado/Completo
                    </Text>
                    <Text style={{ paddingHorizontal: 15, paddingVertical: 2, fontSize: 10 }}>
                      <Icon name="send-clock" color="#522289" size={25}></Icon>  Pendiente de enviar
                    </Text>
                  </View>
                </TouchableOpacity>

              )
            })}


          </ScrollView>
        </View>
      </ImageBackground>

    );
  }
}