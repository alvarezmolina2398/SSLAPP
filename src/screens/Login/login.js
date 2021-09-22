import React from 'react';
import { View, Text, ViewPropTypes, ImageBackground, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            message: ""
        }

    }

    DataLocal = async (idusuario,idempresa, nombre, correo) => {
        try {
            await AsyncStorage.setItem('@isLogin', "true");
            await AsyncStorage.setItem('@idusario', idusuario);
            await AsyncStorage.setItem('@idempresa', idempresa);
            await AsyncStorage.setItem('@nombre', nombre);
            await AsyncStorage.setItem('@correo', correo);
            
        }
        catch (e) {
            console.log(e)
        }
    }
    iniciarSesion() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var body = '{"correo":"' + this.state.username + '","clave":"' + this.state.password + '"}';
        //  var raw = JSON.stringify(body);
        //console.log(raw);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: body,
            redirect: 'follow'
        };

        fetch("https://backend.ssldigital.app/usuario?login=true", requestOptions)
            .then(res => res.json())
            .then(res => {
                if (res.message == "ok") {
                    let idUsuario = (res.records.id)+"";
                    let idEmpresa = (res.records.idEmpresa)+"";
                    let nombre = res.records.nombre;
                    let correo = res.records.correo;
                 //   console.log(idUsuario)
                    this.DataLocal(idUsuario,idEmpresa,nombre,correo)
                    this.setState({ message: ''})
                    this.props.navigation.replace('Home');
                } else {
                    this.setState({ message: 'Username o Clave Incorrecta'})
                }
              //  console.log(res);
            })
            .catch(error => console.log('error', error));
    }



    render() {
        return (
            <ImageBackground
                source={require("../../images/back.png")}
                style={{ width: "100%", height: "100%" }}
            >
                <View style={style.centrado}>
                    <View style={style.panelLogin}>
                        <View style={{ paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 60, fontWeight: 'bold', textAlign: 'center', }}>SSL</Text>
                            <Text style={{ textAlign: 'center', color: '#5657c0' }}>A DIGITAL COMPANY</Text>
                        </View>
                        <View style={{ paddingHorizontal: 20 }}>
                            <View style={{ width: '80%' }}>
                                <Text style={style.text}>Username</Text>
                                <View style={style.textdiv}>
                                    <TextInput
                                        autoCorrect={false}
                                        onChangeText={text => this.setState({ username: text.trim() })}
                                        // value={this.state.userName}
                                        style={style.textInput}
                                    />
                                </View>

                            </View>
                            <View style={{ width: '80%' }}>
                                <Text style={style.text}>Password</Text>
                                <View style={style.textdiv}>
                                    <TextInput
                                        autoCorrect={false}
                                        secureTextEntry={true}
                                        onChangeText={text => this.setState({ password: text })}
                                        // value={this.state.userName}
                                        style={style.textInput}
                                    />
                                </View>

                            </View>
                            <View>
                                <Text style={{marginTop:15, fontWeight:'bold',textAlign:'center',color:'red'}}>{this.state.message}</Text>
                            </View> 
                            <View style={{ with: '80%', marginTop: 5, marginBottom: 15 }}>
                                <TouchableOpacity onPress={() => this.iniciarSesion()}
                                    style={{
                                        borderRadius: 20,
                                        marginTop: 50,
                                        textAlign: 'center',
                                        backgroundColor: '#5657c0',
                                        color: '#fff',
                                        height: 50,
                                        alignContent: "center"
                                    }}>
                                    <Text style={{
                                        color: '#fff',
                                        textAlign: 'center',
                                        alignSelf: 'center',
                                        marginTop: 15,
                                        fontSize: 16,
                                        fontWeight: 'bold'
                                    }}>INICIAR SESION</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </View>
            </ImageBackground>

        );
    }
}



const style = StyleSheet.create({
    panelLogin: {
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    text: {
        marginLeft: 16,
        marginTop: 10,
        marginBottom: 5
    },
    centrado: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    textdiv: {
        backgroundColor: '#e9eafd',
        height: 40,
        borderRadius: 20,
        width: Dimensions.get('window').width / 1.3,
    },
    textInput: {
        marginLeft: 10,
        borderColor: 'black',

        //borderColor: '#eeeeee'
    },
})