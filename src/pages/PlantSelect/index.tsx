import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native'
import { EnviromentButton } from '../../components/EnviromentButton'
import { Header } from '../../components/Header'
import { Load } from '../../components/Load'
import { PlantCardPrimary } from '../../components/PlantCardPrimary'
import api from '../../services/api'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

//tipando os elementos
interface EnviromentProps {
    key: string;
    title: string
}

interface PlantProps {
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
        times: number;
        repeat_every: string;
    }
}

export function PlantSelect() {

    //Estado
    const [enviroments, setEnviroments] = useState<EnviromentProps[]>([]);

    const [plants, setPlants] = useState<PlantProps[]>([]);

    const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);//Filtro

    const [enviromentSelectend, setEnviromentSelectend] = useState('all'); //Saber qual foi selecionado

    const [loading,setLoading] = useState(true);//Carregando

    //Paginação
    const [page,setPage] = useState(1)
    const [loadingMore,setLoadingMore] = useState(true);//Se tiver mais para carregar
    const [loadeAll,setLoadeAll] =useState(false)//Se carrego tudo


    //Selecionar && filtrar
    function handleEnrivomentSelect(environment: string) {

        //Selecionado
        setEnviromentSelectend(environment);

        //Se environment e igual retorna não prosseguir
        if (environment === 'all') return setFilteredPlants(plants);

        //Se Não retorna environment para constante
        const filtered = plants.filter(plant =>
            plant.environments.includes(environment)
        );

        setFilteredPlants(filtered);
    }

    async function fetchPlants() {
        const { data } = await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8  `);
        //Se não tem nada retorna tudo como true
        if(!data) return setLoading(true);

        //Se page for maior que um retorna dados anterios junto dados atuais
        if(page >1){  
            setPlants(oldValue => [...oldValue, ...data]);
            setFilteredPlants(oldValue => [...oldValue, ...data]);

        }else{
            setPlants(data);
            setFilteredPlants(data);

        }
        setLoading(false);
        setLoadingMore(false);
    }

    //Carregar mais dados
    function handleFetchMOre(distance:number){
        if(distance < 1) return;

        setLoadingMore(true);
        setPage(oldValue => oldValue +1);//Pagina atual +1
        fetchPlants();
    }


    //useEffect carregar api primeiro
    useEffect(() => {
        async function fetchEnviroment() {
            const { data } = await api.get('plants_environments?_sort=title&_order=asc');
            setEnviroments([
                {
                    key: 'all',
                    title: 'Todos',
                },
                ...data
            ]);

        }
        fetchEnviroment();

    }, [])

    useEffect(() => {
        fetchPlants();

    }, [])

    if(loading) return <Load/>

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />
                <Text style={styles.title}>
                    Em qual ambiente
                </Text>
                <Text style={styles.subtitle}>
                    voçê quer colocar sua planta?
                </Text>
            </View>
            <View>
                {/* Listar */}
                <FlatList
                    data={enviroments}
                    renderItem={({ item }) => (
                        <EnviromentButton
                            title={item.title}
                            acive={item.key === enviromentSelectend}
                            onPress={() => handleEnrivomentSelect(item.key)}
                        /> //Se for igual ficar marcado
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                >
                </FlatList>
            </View>

            <View style={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    renderItem={({ item }) => (
                        <PlantCardPrimary data={item} />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.1}
                    onEndReached={({distanceFromEnd}) =>                   handleFetchMOre(distanceFromEnd)
                    }
                    ListFooterComponent={
                        loadingMore
                        ?<ActivityIndicator color={colors.green}/>
                        :<></>
                    }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading,
    },
    header: {
        paddingHorizontal: 30
    },
    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center',
    }
})