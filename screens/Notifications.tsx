import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack";
import React from "react";
import { StatusBar } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { View, Text } from "../components/Themed";

const defaultScreenOptions: StackNavigationOptions = {
    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: '#194A4C',
    },
    headerTitleStyle: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    headerTintColor: '#fff',
    headerStatusBarHeight: StatusBar.currentHeight,
}
  
const NotificationStack = createStackNavigator()
export default function NotificationStackNavigator() {
    return (
    <NotificationStack.Navigator screenOptions={defaultScreenOptions}>
        <NotificationStack.Screen
            name="Notifications"
            component={Notifications}
            options={{ headerTitle: 'Notifications' }}
        />
    </NotificationStack.Navigator>
    )
}

function Notifications() {
    return <View>
        <ScrollView>
            <Text>Hello</Text>
        </ScrollView>
    </View>
}