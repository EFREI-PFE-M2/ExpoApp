import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack";
import React from "react";
import { StatusBar, TouchableOpacity, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";
import { View, Text } from "../components/Themed";
import { selectNotifications } from "../store/notificationSlice";
import { GetPublishedDate } from "../utils/ChatFunctions";

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

function checkNotifType(notif: any) {
    const user = notif.type == 'follow' ? notif.followerDisplayName : notif.userDisplayName
    let message = ''
    switch(notif.type) {
        case 'follow':
            message = ' follows you.'
            break
        case 'like':
            message = ' likes your post.'
            break
        case 'comment':
            message = ' comments your post.'
            break
        default:
            break;
    }

    return <Text style={styles.usernameStyle}>{user}
        <Text style={styles.messageStyle}>{message}</Text>
    </Text>
}

function Notifications() {
    const notifications = [{type: 'follow', datetime: new Date(), followerDisplayName: 'JoJo', followerPhotoURL: 'https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg'},
    {type: 'like', datetime: new Date(), userDisplayName: 'JoJo', userPhotoURL: 'https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg'},
    {type: 'comment', datetime: new Date(), userDisplayName: 'JoJo', userPhotoURL: 'https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg'}]
//useSelector(selectNotifications)

    return <View>
        <ScrollView>
            {notifications.map((notif: any) => {
                const userPhotoURL = notif.type == 'follow' ? notif.followerPhotoURL : notif.userPhotoURL

                return <TouchableOpacity
                style={styles.containerNotificationItem}>
                <Avatar.Image 
                size={60} 
                source={{ uri: userPhotoURL }} 
              />
                <View style={styles.viewStyle}>
                    {checkNotifType(notif)}
                    <View style={styles.viewStyle}>
                        <Text style={styles.publishedDateStyle}>
                           - {GetPublishedDate(notif.datetime)}
                        </Text>
                    </View>
                </View>
              </TouchableOpacity>
            })}
        </ScrollView>
    </View>
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerView: {
        flexDirection: 'row',
        marginStart: 10,
        marginTop: 10,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        flex: 1,
        justifyContent: 'space-between'
    },
    usernameStyle:{   
        fontWeight: 'bold', 
        fontSize: 16, 
        marginTop: 10, 
        marginStart: 10,
    },
    messageStyle:{ 
        fontWeight: 'normal', 
        fontSize: 15, 
    },
    publishedDateStyle: {
        marginStart: 10,
        color: 'grey',
        fontSize: 12,
    },
    containerNotificationItem: {
      flexDirection: 'row',
      marginTop: 15,
      backgroundColor: '#fff',
      shadowColor: 'black',
      shadowRadius: 3.84,
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 2 },
      paddingStart: 10,
      paddingEnd: 5,
      paddingTop: 10,
      paddingBottom: 10,
      elevation: 4,
    },
    viewStyle: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)', // transparent background
    },
})