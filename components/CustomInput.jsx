import { View, Text, TextInput } from 'react-native'
import React from 'react'

const CustomInput = ({placeholder, value, handleChangeText, title, isEdit}) => {
  return (
    <View>
      <Text>Mobile: </Text>
      {isEdit ? <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={handleChangeText}
        secureTextEntry={title === 'Password' && !showPassword}
      /> : <Text>8273628133</Text>}
    </View>
  )
}

export default CustomInput