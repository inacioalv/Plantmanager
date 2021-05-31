import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import colors from '../styles/colors';

import { Welcome } from '../pages/Welcome';
import { UserIndentification } from '../pages/UserIndentification';
import { Confirmation } from '../pages/Confirmation';
import { PlantSelect } from '../pages/PlantSelect';
import {PlantSave } from '../pages/PlantServe';
import { MyPlants } from '../pages/MyPlants';
import AuthRoutes from './tab.routes';

const stackRoutes = createStackNavigator();

const AppRoutes: React.FC = () =>(
    <stackRoutes.Navigator
        headerMode="none"
        screenOptions={{
            cardStyle:{
                backgroundColor: colors.white
            },
        }}>
            <stackRoutes.Screen
                name="Welcome"
                component={Welcome}/>
            <stackRoutes.Screen
                name="UserIndentification"
                component={UserIndentification}/>
            <stackRoutes.Screen
                name="Confirmation"
                component={Confirmation}/>
            <stackRoutes.Screen
                name="PlantSelect"
                component={AuthRoutes}/>
            <stackRoutes.Screen
                name="PlantSave"
                component={PlantSave}/>
            <stackRoutes.Screen
                name="MyPlants"
                component={AuthRoutes}/>

            

        </stackRoutes.Navigator>
); 

export default AppRoutes;