import React from 'react'
import { Text, TouchableOpacity,StyleSheet,TouchableOpacityProps } from 'react-native'
import colors from '../../styles/colors'

//Button como propriedade
interface ButtonProps extends TouchableOpacityProps{
    title:string;
}

export function Button({title, ...rest}:ButtonProps){
    return(
       <div className=""></div>
    )
}

const styles = StyleSheet.create({
   
})