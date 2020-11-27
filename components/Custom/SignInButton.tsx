import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'

export default React.forwardRef(function SignInButton(props, ref) {
  return (
    <Button
      ref={ref}
      mode="contained"
      labelStyle={styles.label}
      style={styles.container}
      {...props}>
      {props.children}
    </Button>
  )
})

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 18,
    color: '#194A4C',
    fontWeight: 'bold',
  },
})
