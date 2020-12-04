import React, { useRef, useState } from 'react'
import { StyleSheet, Image } from 'react-native'
import { useDispatch } from 'react-redux'
import SignInButton from '../components/Custom/SignInButton'
import SignInTextField from '../components/Custom/SignInTextField'
import { View, Text } from '../components/Themed'
import { firebaseAuthLogin } from '../store/userSlice'

export default function SignIn({ navigation }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const passwordInputRef = React.createRef()
  const dispatch = useDispatch()

  const usernameInputOnChange = (value: string) => setUsername(value)
  const usernameInputOnSubmit = () => passwordInputRef.current.focus()
  const passwordInputOnChange = (value: string) => setPassword(value)

  const onSubmit = () => {
    dispatch(firebaseAuthLogin(username, password))
  }

  const navigationRetrievePassword = () =>
    navigation.navigate('RetrievePassword')
  const navigationSignUp = () => navigation.navigate('SignUp')

  return (
    <View style={styles.container}>
      <Image source={require('./../assets/images/logo0.png')} />
      <SignInTextField
        label="Email"
        value={username}
        onChangeText={usernameInputOnChange}
        textContentType="username"
        onSubmitEditing={usernameInputOnSubmit}
        keyboardType="email-address"
        returnKeyType="next"
      />
      <SignInTextField
        label="Mot de passe"
        ref={passwordInputRef}
        value={password}
        onChangeText={passwordInputOnChange}
        textContentType="password"
        onSubmitEditing={onSubmit}
        secureTextEntry={true}
      />
      <SignInButton onPress={onSubmit} style={styles.button}>
        Se connecter
      </SignInButton>
      <View style={styles.labelContainer}>
        <Text onPress={navigationRetrievePassword} style={styles.labels}>
          Mot de passe oublié
        </Text>
        <Text onPress={navigationSignUp} style={styles.labels}>
          S'inscrire
        </Text>
      </View>
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
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 40,
    marginBottom: 20,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#fff0',
  },
  labels: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
})
