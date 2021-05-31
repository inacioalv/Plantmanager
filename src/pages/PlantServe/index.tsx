import { useRoute } from '@react-navigation/core'
import React, { useState } from 'react'
import {
    StyleSheet,
    Alert,
    TouchableOpacity,
    Platform,
    ScrollView,
    View,
    Text,
    Image
} from 'react-native'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { color } from 'react-native-reanimated'
import { SvgFromUri } from 'react-native-svg'
import waterdrop from '../../assets/waterdrop.png'
import { Button } from '../../components/Button'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'
import DateTimePicker, { Event } from '@react-native-community/datetimepicker'
import { isBefore } from 'date-fns'
import { format } from 'date-fns/esm'
import { loadPlant, PlantProps, savePlant } from '../../libs/storage'
import { useNavigation } from '@react-navigation/native'


interface Params {
    plant: PlantProps
}

export function PlantSave() {

    const [selectendDateTime, setSlectedDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
    const route = useRoute();

    //Recuperar valores da rotas
    const { plant } = route.params as Params;

    const navigation = useNavigation();

    function handleChangeTime(envet: Event, dateTime: Date | undefined) {
        if (Platform.OS === 'android') {
            setShowDatePicker(oldState => !oldState);
        }

        //saber se tem alguma coisa em dateTime e saber se dateTime e antigar em relação a nova date
        if (dateTime && isBefore(dateTime, new Date())) {
            setSlectedDateTime(new Date());//Data atual
            return Alert.alert('Ecolha uma hora no futuro! ⏰');
        }

        if (dateTime) setSlectedDateTime(dateTime);
    }

    function handleOpenDateTimePickerForAndorid() {
        setShowDatePicker(oldState => !oldState);
    }

    async function handleSave() {

        const data = await loadPlant();
        console.log(data);

        try {
            await savePlant({
                ...plant,
                dateTimeNotification: selectendDateTime
            });

            navigation.navigate('Confirmation', {
                title: 'Tudo certo',
                subtitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha.',
                buttonTitle: 'Muito Obrigado :D',
                icon: 'hug',
                nextScreen: 'MyPlants'
            });

        } catch {
            Alert.alert('Não foi possivel salver.');
        }
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            >
            <View style={styles.container}>
                <View style={styles.plantInfo}>
                    <SvgFromUri
                        uri={plant.photo}
                        height={150}
                        width={150} />

                    <Text style={styles.plantName}>
                        {plant.name}
                    </Text>
                    <Text style={styles.plantAbout}>
                        {plant.about}
                    </Text>
                </View>

                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        <Image
                            source={waterdrop}
                            style={styles.tipImage}
                        />
                        <Text style={styles.tipText}>
                            {plant.water_tips}
                        </Text>
                    </View>
                    <Text style={styles.alerLabel}>
                        Escolhar o menlhor horário para ser lembrado
                </Text>

                    {
                        showDatePicker &&
                        (<DateTimePicker
                            value={selectendDateTime}
                            mode="time"
                            display="spinner"
                            onChange={handleChangeTime}
                        />
                        )}
                    {
                        Platform.OS === 'android' && (
                            <TouchableOpacity
                                style={styles.dateTimePickerButton}
                                onPress={handleOpenDateTimePickerForAndorid}
                            >
                                <Text style={styles.dateTimePickerText}>
                                    {`Mudar ${format(selectendDateTime, 'HH:mm')}`}
                                </Text>
                            </TouchableOpacity>
                        )
                    }

                    <Button
                        title="Cadastrar planta"
                        onPress={handleSave}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape
    },
    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.shape
    },
    plantName: {
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        margin: 15
    },
    plantAbout: {
        textAlign: 'center',
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginTop: 10
    },
    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: getBottomSpace() || 20

    },
    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 60
    },
    tipImage: {
        width: 56,
        height: 56,
    },
    tipText: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: 'justify'
    },
    alerLabel: {
        textAlign: 'center',
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 12,
        marginBottom: 5
    },
    dateTimePickerText: {
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text
    },
    dateTimePickerButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40,
    }
})