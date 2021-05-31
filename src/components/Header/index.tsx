import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import colors from '../../styles/colors'
import {getStatusBarHeight} from 'react-native-iphone-x-helper'
import usuImg from '../../assets/inacio.png'
import fonts from '../../styles/fonts'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function Header(){
    const [userName,setUserName]= useState<string>();

    //Pegar name do user
    useEffect(() => {
        async function loadStorageUserName(){
            const user = await AsyncStorage.getItem('@plantmanager:user');

            //armazena no estado de userName
            setUserName(user || ''); //Se tiver alguma coisa no user será o user solvo se não ficar vazio
        }
        loadStorageUserName();
    })

    return(
            <View style={styles.container}>
                <View>
                    <Text style={styles.greeting}>Olá,</Text>
                    <Text style={styles.userName}>{userName}</Text>
                </View>
                <Image source={usuImg} style={styles.image}/>
            </View>
        
    )
}

const styles = StyleSheet.create({
    container:{
        width: '100%',
        flexDirection:'row',
        justifyContent:"space-between",
        alignItems: 'center',
        paddingVertical:20,
        marginTop:getStatusBarHeight(),
        
    },
    greeting:{
        fontSize:32,
        color: colors.heading,
        fontFamily: fonts.text
    },
    userName:{
        fontSize:32,
        fontFamily: fonts.heading,
        color: colors.heading,
        lineHeight:40
    },
    image:{
        width:70,
        height:70,
        borderRadius:40,

    }
})