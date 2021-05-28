import React from 'react'
import { StyleSheet, Text } from 'react-native'
import {RectButton,RectButtonProps} from 'react-native-gesture-handler'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

interface EnviromentButtonProps extends RectButtonProps {
    title:string;
    acive?:boolean;
}

export function EnviromentButton({title,acive=false,...rest}:EnviromentButtonProps){
    return(
        <RectButton style={[
            styles.container,
            acive && styles.containerAciver]} {...rest}>

            <Text style={[
                styles.text,
                acive && styles.textAtiver]}>
                {title}
            </Text>
        </RectButton>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.shape,
        width:76,
        height:40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:12,
        marginHorizontal:5
    },
    containerAciver:{
        backgroundColor: colors.green_light
    },
    text:{
        color: colors.heading,
        fontFamily: fonts.text
    },
    textAtiver:{
        fontFamily: fonts.heading,
        color: colors.green_dark,
    }
})