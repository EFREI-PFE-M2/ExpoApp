import * as React from 'react'
import { View } from 'react-native'
import { Menu, Divider } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { getGroupChatMembersDetails } from '../../store/chatSlice'

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
          onPress={() => alert('Are you sure to leave?')}
          titleStyle={{ color: 'red' }}
          title="Quitter le chat"
        />
      </Menu>
    </View>
  )
}
