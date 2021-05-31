import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
    Alert
} from 'react-native'
import { Button } from '../../components/Button'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function UserIndentification() {

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [name, setName] = useState<string>();

    const navigation = useNavigation();

    function handleInputBlur(){
        setIsFocused(false);
        setIsFilled(!!name);//se tiver conteudo
    }

    function handleInputFocus(){
        setIsFocused(true);
    }
    function handkeInputChange(value:string){
        setIsFilled(!!value);
        setName(value);

    }


   async function handleSubmit(){
        if(!name) //Se tiver vazio retorna um alerta
        return  Alert.alert('Me diz como chamar voçê 😥');

        try {
            //armazenamento no dispositivo
            //Padrão de key @nameApp:user
          await AsyncStorage.setItem('@plantmanager:user',name);
            navigation.navigate('Confirmation',{
                title:'Prontinho',
                subtitle:'Agora vamos começar a cuidar das suas plantinhas com muito cuidado.',
                icon:'smile',
                buttonTitle:'Começar',
                nextScreen:'PlantSelect'
            });
            
        } catch{
            Alert.alert('Não foi possível salvar o seu nome.');
        }
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.content}>
                    <View style={styles.form}>
                        <View style={styles.header}>
                            <Text style={styles.emoji}>
                                { isFilled ?'😊' : '😁'}
                            </Text>
                            <Text style={styles.title}>
                                Como podemos {'\n'}
                                 chamar você?
                            </Text>
                        </View>
                        <TextInput
                            style={[
                                styles.input,
                                (isFocused || isFilled) && {borderColor:colors.green}
                            ]}
                            placeholder="Digite um nome"
                            onBlur={handleInputBlur}
                            onFocus={handleInputFocus} 
                            onChangeText={handkeInputChange}/>

                        <View style={styles.footer}>
                            <Button 
                                title="Confirma"
                                onPress={handleSubmit}/>
                        </View>

                    </View>

                </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    content: {
        flex: 1,
        width: '100%'
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 54,
        alignItems: 'center',
    },
    header:{
        alignItems: 'center',
    },
    emoji: {
        fontSize: 44
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        color: colors.heading,
        width: '100%',
        fontSize: 18,
        marginTop: 50,
        padding: 10,
        textAlign: 'center'
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.heading,
        marginTop: 20
    },
    footer: {
        width: '100%',
        marginTop: 40,
        paddingHorizontal: 20
    }
})