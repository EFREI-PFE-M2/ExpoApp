import React, { useRef, useState } from 'react'
import { StyleSheet, Image } from 'react-native'
import SignInButton from '../components/Custom/SignInButton'
import SignInTextField from '../components/Custom/SignInTextField'
import { View, Text } from './../components/Themed'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const passwordRef = useRef(null)

  const passwordInputOnChange = (value: string) => setPassword(value)
  const passwordInputOnSubmit = () => passwordRef.current.focus()
  const passwordConfirmationOnChange = (value: string) =>
    setPasswordConfirmation(value)

  const onSubmit = () => {}
  return (
    <View style={styles.container}>
      <Image source={require('./../assets/images/logo1.png')} />
      <SignInTextField
        label="Nouveau mot de passe"
        value={password}
        onChangeText={passwordInputOnChange}
        textContentType="newPassword"
        secureTextEntry={true}
        onSubmitEditing={passwordInputOnSubmit}
        returnKeyType="next"
      />
      <SignInTextField
        label="Confirmation du nouveau mot de passe"
        ref={passwordRef}
        value={passwordConfirmation}
        onChangeText={passwordConfirmationOnChange}
        textContentType="newPassword"
        secureTextEntry={true}
        onSubmitEditing={onSubmit}
      />
      <SignInButton onPress={onSubmit} style={styles.button}>
        Réinitialiser
      </SignInButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#194A4C',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  button: {
    width: '100%',
    marginTop: 30,
  },
})
