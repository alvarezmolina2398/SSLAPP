import React  from 'react';
import { View,Text, ViewPropTypes, ImageBackground,Image,TextInput} from 'react-native';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default class Home extends React.Component{
    render(){
        return(
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
          <Icon
            name="account-circle"
            size={33}
            color="#a2a2db"
            style={{ marginLeft: 230 }}
          />
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
            Bienvenido, Recuerda revisar tus conexiona internet para actulizar tu formularios
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
            style={{ marginLeft: 25, marginTop: 80,alignContent:'center'  }}
          >
           
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

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 50,
                width: 50,
                borderRadius: 50,
                backgroundColor: "#ffa06c",
              }}
            >
              <Icon name="wifi" color="white" size={32} />
            </View>

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
            style={{ marginHorizontal: -20, marginTop: 30 }}
          >
            <View
              style={{
                backgroundColor: "#FEFEFE",
                height: 200,
                width: 190,
                borderRadius: 15,
                padding: 15,
               
              }}
            >
                <Text style={{ color: '#522289', textAlign:'center'}}>
                     Formulario Prueba No.1
                </Text>
               
                <View style={{height:2, width:"100%", backgroundColor:"#522289", borderRadius:20}}>

                </View>
                <Text style={{paddingHorizontal:15, paddingVertical:2, fontSize:10, marginTop:15}}>
                    <Icon name="clock-time-seven-outline"  color="#522289" size={25}></Icon>    16 dias Restantes
                </Text>
                <Text style={{paddingHorizontal:15, paddingVertical:2, fontSize:10}}>
                    <Icon name="calendar-month-outline" color="#522289"  size={25}></Icon>  Del 01 jul al 16 de jul
                </Text>
                <Text style={{paddingHorizontal:15, paddingVertical:2, fontSize:10}}>
                    <Icon name="download" color="#522289"  size={25}></Icon> Descargado/Completo
                </Text>
                <Text style={{paddingHorizontal:15, paddingVertical:2, fontSize:10}}>
                    <Icon name="send-clock" color="#522289"  size={25}></Icon>  Pendiente de enviar
                </Text>
            </View>


            <View
              style={{
                backgroundColor: "#FEFEFE",
                height: 200,
                width: 190,
                borderRadius: 15,
                padding: 15,
                marginLeft:15
               
              }}
            >
                <Text style={{ color: '#522289', textAlign:'center'}}>
                     Formulario Prueba No.1
                </Text>
               
                <View style={{height:2, width:"100%", backgroundColor:"#522289", borderRadius:20}}>

                </View>
                <Text style={{paddingHorizontal:15, paddingVertical:2, fontSize:10, marginTop:15}}>
                    <Icon name="clock-time-seven-outline"  color="#522289" size={25}></Icon>    16 dias Restantes
                </Text>
                <Text style={{paddingHorizontal:15, paddingVertical:2, fontSize:10}}>
                    <Icon name="calendar-month-outline" color="#522289"  size={25}></Icon>  Del 01 jul al 16 de jul
                </Text>
                <Text style={{paddingHorizontal:15, paddingVertical:2, fontSize:10}}>
                    <Icon name="download" color="#522289"  size={25}></Icon> Descargado/Completo
                </Text>
                <Text style={{paddingHorizontal:15, paddingVertical:2, fontSize:10}}>
                    <Icon name="send-clock" color="#522289"  size={25}></Icon>  Pendiente de enviar
                </Text>
            </View>

            <View
              style={{
                backgroundColor: "#FEFEFE",
                height: 200,
                width: 190,
                borderRadius: 15,
                padding: 15,
                marginLeft:15
               
              }}
            >
                <Text style={{ color: '#522289', textAlign:'center'}}>
                     Formulario Prueba No.1
                </Text>
               
                <View style={{height:2, width:"100%", backgroundColor:"#522289", borderRadius:20}}>

                </View>
                <Text style={{paddingHorizontal:15, paddingVertical:2, fontSize:10, marginTop:15}}>
                    <Icon name="clock-time-seven-outline"  color="#522289" size={25}></Icon>    16 dias Restantes
                </Text>
                <Text style={{paddingHorizontal:15, paddingVertical:2, fontSize:10}}>
                    <Icon name="calendar-month-outline" color="#522289"  size={25}></Icon>  Del 01 jul al 16 de jul
                </Text>
                <Text style={{paddingHorizontal:15, paddingVertical:2, fontSize:10}}>
                    <Icon name="download" color="#522289"  size={25}></Icon> Descargado/Completo
                </Text>
                <Text style={{paddingHorizontal:15, paddingVertical:2, fontSize:10}}>
                    <Icon name="send-clock" color="#522289"  size={25}></Icon>  Pendiente de enviar
                </Text>
            </View>

            

            
          
          </ScrollView>
        </View>
      </ImageBackground>
            
            );
    }
}