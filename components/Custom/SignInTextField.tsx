import React from 'react'
import { StyleProp, TextStyle } from 'react-native'
import { TextInput } from 'react-native-paper'
import { TextInputProps } from 'react-native-paper/lib/typescript/src/components/TextInput/TextInput'

export default React.forwardRef(function SignInTextField(props, ref) {
  const { style: propStyle, ...rest } = props
  const style: StyleProp<TextStyle> = {
    fontSize: 18,
    height: 52,
    color: '#fff',
    marginVertical: 10,
    width: '100%',
  }
  return (
    <TextInput
      ref={ref}
      mode="flat"
      underlineColor="#194A4C"
      underlineColorAndroid="#194A4C"
      style={[style, propStyle]}
      {...rest}
    />
  )
})
