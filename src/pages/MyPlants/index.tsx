import React, { useEffect, useState } from 'react'
import {
    Image,
    StyleSheet,
    Text,
    View,
    FlatList,
    ScrollView,
    Alert
} from 'react-native'
import { Header } from '../../components/Header'
import colors from '../../styles/colors'

import waterdrop from '../../assets/waterdrop.png'
import { PlantProps, loadPlant, removePlant } from '../../libs/storage'
import { formatDistance } from 'date-fns'
import { pt } from 'date-fns/locale'
import fonts from '../../styles/fonts'
import { PlantCardSecondary } from '../../components/PlantCardSecondary'
import { Load } from '../../components/Load'


export function MyPlants() {
    const [MyPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true); //Simular carregamento
    const [nextWaterd, setNextWatered] = useState<String>();//Proxima regada

    function handleRemove(plant: PlantProps) {
        Alert.alert('Reomover', `Deseja remover a ${plant.name}?`, [{
            text: 'Não 🙏',
            style: 'cancel'
        },
        {
            text: 'Sim 😥',
            onPress: async () => {
                try {
                    
                    //Removendo
                    await removePlant(plant.id);

                    //Atualizar o estado 
                    setMyPlants((oldData) => 
                        oldData.filter((item) => item.id != plant.id)
                    );

                } catch{
                    Alert.alert('Não foi possivel remover! 😥');
                }
            }
        }
        ]);
    }

    useEffect(() => {
        async function loadStorageData() {
            //Plant carregadas
            const plantsStorted = await loadPlant();

            //Calculo da distancia de uma data para outra
            const nextTime = formatDistance(
                new Date(plantsStorted[0].dateTimeNotification).getTime(),
                new Date().getTime(),//Data atual
                { locale: pt }
            );

            setNextWatered(
                `Não esqueça de regar a ${plantsStorted[0].name} á ${nextTime}.`
            )

            setMyPlants(plantsStorted);//Carregando os dados
            setLoading(false);//Parar o carregamento
        }

        loadStorageData();
    }, []);

    if (loading) return <Load />

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                <Header />

                <View style={styles.spotlight}>
                    <Image
                        source={waterdrop}
                        style={styles.spotlightImage} />

                    <Text style={styles.spotlightText}>
                        {nextWaterd}
                    </Text>
                </View>
                <View style={styles.plants}>
                    <Text style={styles.plantsTitle}>
                        Próxiomas regadas
                </Text>

                    <FlatList
                        data={MyPlants}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <PlantCardSecondary
                                data={item}
                                handleRemove={() => handleRemove(item)}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flex: 1 }}
                    />


                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    spotlightImage: {
        width: 60,
        height: 60
    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    }
})