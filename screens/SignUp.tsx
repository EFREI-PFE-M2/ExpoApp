import React, { useRef, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native'
import { Checkbox, TouchableRipple } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import SignInButton from '../components/Custom/SignInButton'
import SignInTextField from '../components/Custom/SignInTextField'
import { View, Text, LayoutView } from '../components/Themed'
import { firebaseAuthCreateUser } from '../store/userSlice'

export default function SignUp({ navigation }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [tosCheck, setTosCheck] = useState(false)
  const dispatch = useDispatch()

  const usernameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const passwordConfirmationRef = useRef(null)

  const usernameInputOnChange = (value: string) => setUsername(value)
  const emailInputOnChange = (value: string) => setEmail(value)
  const passwordInputOnChange = (value: string) => setPassword(value)
  const passwordConfirmationInputOnChange = (value: string) =>
    setPasswordConfirmation(value)
  const usernameInputOnSubmit = () => emailRef.current.focus()
  const emailInputOnSubmit = () => passwordRef.current.focus()
  const passwordInputOnSubmit = () => passwordConfirmationRef.current.focus()

  const tosCheckOnChange = () => setTosCheck((prev) => !prev)

  const onSubmit = async () => {
    if (password !== passwordConfirmation) return
    await dispatch(firebaseAuthCreateUser(email, password))
  }

  const navigationLogin = () => navigation.navigate('SignIn')
  const navigationTos = () => navigation.navigate('TermsOfUse')

  return (
    <LayoutView style={styles.container}>
      <KeyboardAvoidingView behavior="position" style={{ width: '100%' }}>
        <ScrollView contentContainerStyle={{ width: '100%' }}>
          <SignInTextField
            label="Nom d'utilisateur"
            ref={usernameRef}
            value={username}
            onChangeText={usernameInputOnChange}
            textContentType="username"
            onSubmitEditing={usernameInputOnSubmit}
            returnKeyType="next"
          />
          <SignInTextField
            label="Email"
            ref={emailRef}
            value={email}
            onChangeText={emailInputOnChange}
            textContentType="emailAddress"
            onSubmitEditing={emailInputOnSubmit}
            returnKeyType="next"
          />
          <SignInTextField
            label="Mot de passe"
            ref={passwordRef}
            value={password}
            onChangeText={passwordInputOnChange}
            textContentType="password"
            onSubmitEditing={passwordInputOnSubmit}
            secureTextEntry={true}
            returnKeyType="next"
          />
          <SignInTextField
            label="Confirmation de mot de passe"
            ref={passwordConfirmationRef}
            value={passwordConfirmation}
            onChangeText={passwordConfirmationInputOnChange}
            textContentType="password"
            onSubmitEditing={onSubmit}
            secureTextEntry={true}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={tosCheck ? 'checked' : 'unchecked'}
          onPress={tosCheckOnChange}
          color="#fff"
        />
        <Text style={styles.checkboxLabel}>
          Je confirme avoir pris connaissance des {'\n'}
          <TouchableRipple onPress={navigationTos}>
            <Text style={styles.tosLabel}>
              Termes et conditions générales d'utilisation
            </Text>
          </TouchableRipple>
        </Text>
      </View>
      <SignInButton onPress={onSubmit}>S'inscrire</SignInButton>
      <TouchableRipple
        onPress={navigationLogin}
        style={styles.navigationContainer}>
        <Text style={styles.navigationLogin}>Se connecter</Text>
      </TouchableRipple>
    </LayoutView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#194A4C',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  checkboxContainer: {
    backgroundColor: '#fff0',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  checkboxLabel: {
    color: '#ffffffA0',
    fontSize: 12,
    marginLeft: 30,
  },
  tosLabel: {
    textDecorationLine: 'underline',
    color: '#fff',
  },
  navigationContainer: {
    marginTop: 20,
  },
  navigationLogin: {
    color: '#fff',
  },
})
