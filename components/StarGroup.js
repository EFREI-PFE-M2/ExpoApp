import React from 'react'
import { View, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'

export default function StarGroup({ star }) {
  let starGroup = [];
  for (let i = 0; i < star; i++) {
    starGroup.push(
      <IconButton icon="star" color="#FFD700" size={20} key={i} style={{ margin: 0, padding: 0}}/>
    );
  }

  return (
    <View style={styles.container}>
      {starGroup}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center'
  }
})