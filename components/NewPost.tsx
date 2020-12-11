import React, { useState } from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { View, Text } from './Themed'
import { Avatar, IconButton } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../store/userSlice'
import { ScrollView } from 'react-native-gesture-handler'

export default function NewPost(props) {
  const { onClose } = props
  const photoURL = useSelector(selectCurrentUser)?.photoURL
  const [content, setContent] = useState('')

  const save = () => console.log('save current edits')
  const contentInputOnChange = (value) => setContent(value)

  const renderTopbar = () => (
    <View
      style={{
        height: 80,
        backgroundColor: '#194A4C',
        marginBottom: 20,
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <IconButton
        icon="window-close"
        onPress={onClose}
        size={30}
        color="#fff"
      />
      <IconButton icon="publish" onPress={save} size={30} color="#fff" />
    </View>
  )

  const renderIconGroup = () => (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        borderTopColor: '#D6D6D6',
        borderTopWidth: 1,
      }}>
      <IconButton
        icon="image"
        size={24}
        color="#194A4C"
        onPress={() => alert('dummy')}
      />
      <IconButton
        icon="poll"
        size={24}
        color="#194A4C"
        onPress={() => alert('dummy')}
      />
      <IconButton
        icon="map-marker"
        size={24}
        color="#194A4C"
        onPress={() => alert('dummy')}
      />
      <IconButton
        icon="racing-helmet"
        size={24}
        color="#194A4C"
        onPress={() => alert('dummy')}
      />
    </View>
  )

  return (
    <View style={styles.container}>
      {renderTopbar()}
      <View style={styles.elementContainer}>
        <Avatar.Image
          source={{ uri: photoURL }}
          size={48}
          style={styles.avatar}
        />
        <ScrollView style={styles.editorScroll}>
          <TextInput
            value={content}
            onChangeText={contentInputOnChange}
            multiline
            style={styles.editor}
            placeholder="Exprimez-vous"
          />
        </ScrollView>
      </View>
      {renderIconGroup()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    top: 0,
    left: 0,
  },
  elementContainer: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 10,
  },
  editorScroll: {
    marginTop: 10,
  },
  editor: {
    width: '100%',
    paddingHorizontal: 10,
    fontSize: 18,
    color: '#000',
  },
  avatar: {
    marginLeft: 15,
  },
})
