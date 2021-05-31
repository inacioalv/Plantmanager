import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { format } from 'date-fns';

export interface PlantProps {
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
        times: number;
        repeat_every: string;
    };
    hour: string;
    dateTimeNotification: Date;
}

export interface StoragePlantProps {
    [id: string]: {
        data: PlantProps;
        notificationId: string;
    }
}

export async function savePlant(plant: PlantProps): Promise<void> {
    try {
        const nexTime = new Date(plant.dateTimeNotification);
        const now = new Date();

        //Saber a frequencia que cuidar das plantas
        const { times, repeat_every } = plant.frequency;
        //Se a repetição e semanal
        if (repeat_every === 'week') {
            //quantas veses na semana
            const intervel = Math.trunc(7 / times);
            //Proxima data, atual + proxima
            nexTime.setDate(now.getDate() + intervel);
        } else
            //Notificação todos os dias
            nexTime.setDate(nexTime.getDate() + 1);

        //Diferença em segundos de um periodo pro outro
        const second = Math.abs(
            Math.ceil(now.getTime() - nexTime.getTime()) / 1000
        );

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Heeey, 🌱',
                body: `Está na hora de cuidar da sua  ${plant.name}`,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                data: {
                    plant
                },
            },
            trigger: {
                seconds: second < 60 ? 60 : second,
                repeats: true
            }
        });


        const data = await AsyncStorage.getItem('@plantmanager:plants');
        const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {};

        //Savar
        const newPlant = {
            [plant.id]: {
                data: plant,
                notificationId
            }
        }

        //Manter o que ja tinha e add uma nova plant
        await AsyncStorage.setItem('@plantmanager:plants',
            JSON.stringify({
                ...newPlant,
                ...oldPlants
            })
        )

    } catch (error) {
        throw new Error(error);
    }
}


export async function loadPlant(): Promise<PlantProps[]> {
    try {
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

        const plantsStorted = Object
            .keys(plants)
            .map((plant) => {
                return {
                    ...plants[plant].data,
                    hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm')
                }
            })
            //Descobrir o intem menor
            .sort((a, b) =>
                Math.floor(
                    new Date(a.dateTimeNotification).getTime() / 1000 - Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
                ));

        return plantsStorted;


    } catch (error) {
        throw new Error(error);
    }
}

export async function removePlant(id: string): Promise<void> {
    //Pegar dados
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    //Se data tiver dados trasforma em objeto se não tiver nada passa o objeto
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    //Cancelar notificação
    await Notifications.cancelScheduledNotificationAsync(plants[id].notificationId);

    //Pegar o id da planta e remover da coleção
    delete plants[id];

    //Salvar na coleção em forma de text
    await AsyncStorage.setItem(
        '@plantmanager:plants',
        JSON.stringify(plants)
    );
}