import React, { useRef, useState } from 'react'
import { StyleSheet, Image } from 'react-native'
import SignInButton from '../components/Custom/SignInButton'
import SignInTextField from '../components/Custom/SignInTextField'
import { View, Text } from './../components/Themed'

export default function RetrievePassword() {
  const [email, setEmail] = useState('')

  const emailInputOnChange = (value: string) => setEmail(value)
  const onSubmit = () => {}

  return (
    <View style={styles.container}>
      <Image source={require('./../assets/images/logo1.png')} />
      <Text style={styles.text}>
        <Text style={styles.title}>
          Réinitialisation du mot de passe {'\n'}
        </Text>
        Un mail de réinitialisation de mot de passe vous sera envoyé à l'address
        indiquée
      </Text>
      <SignInTextField
        label="Email"
        value={email}
        onChangeText={emailInputOnChange}
        textContentType="emailAddress"
        onSubmitEditiong={onSubmit}
      />
      <SignInButton onPress={onSubmit} style={styles.button}>
        {' '}
        Envoyer mail{' '}
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
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
})
