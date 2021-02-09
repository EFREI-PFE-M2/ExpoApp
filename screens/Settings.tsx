import React, { useState } from 'react'
import { View, Text } from '../components/Themed'
import { Button, Switch, TouchableRipple, IconButton } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import SignInTextField from '../components/Custom/SignInTextField'
import { useDispatch, useSelector } from 'react-redux'
import {
  changeNotificationState,
  selectCurrentNotificationState,
  selectCurrentUser,
  selectCurrentUserEmail,
} from '../store/userSlice'

export default function Settings(props) {
  const { navigation, isDialog } = props
  const userEmail = useSelector(selectCurrentUserEmail)
  const notificationState = useSelector(selectCurrentNotificationState)
  const [email, setEmail] = useState(userEmail)
  const [password, setPassword] = useState('000000')
  const dispatch = useDispatch()

  const theme = {
    colors: { text: '#000', placeholder: '#000' },
  }

  const goBack = () => navigation.navigate('Home')
  const emailInputOnChange = (value) => setEmail(value)
  const passwordInputOnChange = (value) => setPassword(value)
  const onSwitchChange = () =>
    dispatch(changeNotificationState(!notificationState))
  const onDeleteAccount = () => console.log('NEVER')
  const save = () => console.log('save')

  const renderTopbar = () => (
    <View
      style={{
        height: 90,
        backgroundColor: '#194A4C',
        paddingTop: 35,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
      <IconButton 
        icon="chevron-left"
        onPress={goBack}
        size={30}
        color="#fff"
      />
      <Text style={{fontSize:24, fontWeight:'bold',color:"#fff"}}>Réglages</Text>
      <IconButton 
        icon="content-save-edit" 
        onPress={save}
        size={30}
        color="#fff"
      />
    </View>
  )

  const renderInputs = () => (
    <>
      <SignInTextField
        label="Email"
        value={email}
        onChangeText={emailInputOnChange}
        keyboardType="email-address"
        returnKeyType="next"
        textContentType="username"
        style={styles.textInput}
        theme={theme}
      />
      <SignInTextField
        label="Mot de passe"
        value={password}
        onChangeText={passwordInputOnChange}
        textContentType="password"
        secureTextEntry={true}
        style={styles.textInput}
        theme={theme}
      />
    </>
  )

  const renderSystemSection = () => (
    <>
      <Text style={styles.title}>Activer les notifications</Text>
      <View style={styles.notificationContainer}>
        <Text style={styles.content}>
          Vous recevrez des notifications pour les messages privés, les jaime,
          les commentaires, les demandes d’échange
        </Text>
        <Switch
          value={notificationState}
          onValueChange={onSwitchChange}
          color="#194A4C"
        />
      </View>
    </>
  )

  const renderDeleteAccount = () => (
    <Button
      onPress={onDeleteAccount}
      mode="text"
      labelStyle={styles.deleteLabel}
      style={styles.delete}>
      Désactiver le compte
    </Button>
  )
  return (
    <View style={styles.container}>
      {!isDialog && renderTopbar()}
      <View style={[styles.container, { paddingHorizontal: 20 }]}>
        {renderInputs()}
        <View style={{ marginTop: 20 }}>{renderSystemSection()}</View>
      </View>
      {renderDeleteAccount()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  textInput: {
    width: '100%',
    backgroundColor: '#D6D6D6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 14,
    color: '#757575',
    width: 200,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  delete: {
    marginVertical: 20,
  },
  deleteLabel: {
    color: '#EC5353',
    fontSize: 18,
    fontWeight: 'bold',
  },
})