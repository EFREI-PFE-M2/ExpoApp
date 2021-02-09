import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { Menu, Divider } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function PrivateChatMenuOptions(props: any) {
  const [visible, setVisible] = React.useState(false)
  const navigation = useNavigation()

  const { chatInfo } = props.params

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  const goToProfile = () => {
    setVisible(false)
    navigation.navigate('Profil', {
      self: false,
      user: {
        username: chatInfo.receiverDisplayName,
        photoURL: chatInfo.receiverPhotoURL,
        level: 0,
        experience: 0,
        winPercentage: 0,
        nbFollowers: 0,
        nbFollowing: 0,
        currentSeries: [],
      },
    })
  }

  const blockUser = () => alert('Are you sure to block this user?')

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
          onPress={goToProfile}
          titleStyle={styles.blackColor}
          title="Voir le profil"
        />
        <Divider />
        <Menu.Item
          onPress={blockUser}
          titleStyle={styles.redColor}
          title="Bloquer l'utilisateur"
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
