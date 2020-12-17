import * as React from 'react'
import { View } from 'react-native'
import { Menu, Divider } from 'react-native-paper'
import { ReactReduxContext } from 'react-redux'
import { MaterialIcons } from '@expo/vector-icons'

export default function PrivateChatMenuOptions() {
  const [visible, setVisible] = React.useState(false)

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
          onPress={() => alert('Redirect to user profile')}
          icon="account-circle"
          titleStyle={{ color: 'black' }}
          title="Voir le profil"
        />
        <Divider />
        <Menu.Item
          onPress={() => alert('Are you sure to block this user?')}
          titleStyle={{ color: 'red' }}
          title="Bloquer l'utilisateur"
        />
      </Menu>
    </View>
  )
}
