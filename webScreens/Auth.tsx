import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { StyleSheet, Animated } from 'react-native'
import { Surface } from 'react-native-paper'
import { View } from '../components/Themed'
import SignIn from '../screens/SignIn'
import SignUp from '../screens/SignUp'

export default function Auth() {
  const [opacity, setOpacity] = useState(new Animated.Value(1))
  const [switchState, setSwitchState] = useState(true)
  const navigation = useNavigation()
  const signUpCallback = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
    }).start(() => setSwitchState(!switchState))
  }

  useEffect(() => {
    opacity.addListener(({ value }) => {
      if (value === 0) {
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
        }).start()
      }
    })

    return () => opacity.removeAllListeners()
  }, [])

  return (
    <View style={styles.container}>
      <Surface style={styles.dialog}>
        <Animated.View style={[styles.innerContainer, { opacity }]}>
          {switchState ? (
            <SignIn signUpCallback={signUpCallback} navigation={navigation} />
          ) : (
            <SignUp signInCallback={signUpCallback} navigation={navigation} />
          )}
        </Animated.View>
        {/* <SignUp /> */}
      </Surface>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dialog: {
    width: 800,
    flexDirection: 'row',
    height: 500,
    overflow: 'hidden',
    borderRadius: 10,
    elevation: 10,
    opacity: 0.9,
    backgroundColor: '#194A4C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: 350,
    height: 400,
  },
})
