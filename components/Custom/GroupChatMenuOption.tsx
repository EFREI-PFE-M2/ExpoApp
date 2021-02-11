import * as React from 'react'
import { View, Alert, StyleSheet } from 'react-native'
import { Menu, Divider } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import {
  getGroupChatMembersDetails,
  leaveGroupChat,
} from '../../store/chatSlice'

export default function GroupChatMenuOptions(props: any) {
  const [visible, setVisible] = React.useState(false)
  const navigation = useNavigation()

  const { chatInfo } = props.params

  const dispatch = useDispatch()

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  const redirectToGroupChatDetails = async () => {
    await dispatch(getGroupChatMembersDetails(chatInfo.chatID))
    setVisible(false)
    navigation.navigate('GroupChatDetails', {
      chatInfo,
      title: 'Détails du chat',
      isCreated: true,
    })
  }

  const quitGroupChat = () => {
    setVisible(false)
    Alert.alert('Warning', 'Are you sure to leave the chat?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => { 
          await dispatch(leaveGroupChat(chatInfo.chatID))
          navigation.navigate('ChatList')
        },
      },
    ])
  }

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <MaterialIcons
            name="more-vert"
            color={'#fff'}
            size={24}
            onPress={openMenu}
          />
        }>
        <Menu.Item
          onPress={redirectToGroupChatDetails}
          titleStyle={styles.blackColor}
          title="Accéder aux détails"
        />
        <Divider />
        <Menu.Item
          onPress={quitGroupChat}
          titleStyle={styles.redColor}
          title="Quitter le chat"
        />
      </Menu>
    </View>
  )
}

const styles = StyleSheet.create({
  blackColor: {
    color: 'black',
  },
  redColor: {
    color: 'red',
  },
})
