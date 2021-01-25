import * as React from 'react'
import { View, Alert } from 'react-native'
import { Menu, Divider } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import {
  getGroupChatMembersDetails,
  leaveGroupChat,
} from '../../store/chatSlice'

export default function GroupChatMenuOptions(props) {
  const [visible, setVisible] = React.useState(false)
  const navigation = useNavigation()

  const { chatInfo } = props.params

  const dispatch = useDispatch()

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)
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
          onPress={async () => {
            await dispatch(getGroupChatMembersDetails(chatInfo.chatID))
            setVisible(false)
            navigation.navigate('GroupChatDetails', {
              chatInfo,
              title: 'Détails du chat',
              isCreated: true,
            })
          }}
          titleStyle={{ color: 'black' }}
          title="Accéder aux détails"
        />
        <Divider />
        <Menu.Item
          onPress={() => {
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
          }}
          titleStyle={{ color: 'red' }}
          title="Quitter le chat"
        />
      </Menu>
    </View>
  )
}
