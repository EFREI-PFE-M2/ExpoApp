import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from '../components/Themed'
import {
  Button,
  IconButton,
  Switch,
  TextInput,
  TouchableRipple,
} from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function AddGroup({ goBack }) {
  const [name, setName] = useState('')
  const [switchState, setSwitchState] = useState(false)

  const nameOnChange = (value) => setName(value)
  const switchOnChange = () => setSwitchState((prev) => !prev)
  return (
    <View style={styles.container}>
      <TopBar goBack={goBack} />
      <View style={{ alignItems: 'center', flexDirection: 'column' }}>
        <ImageBox />
        <TextInput
          value={name}
          onChangeText={nameOnChange}
          mode="outlined"
          placeholder="Nom du groupe"
          placeholderTextColor="#757575"
          style={{ width: '100%', paddingHorizontal: 25 }}
          theme={{
            colors: {
              background: '#0002',
              text: '#000',
            },
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            marginVertical: 20,
          }}>
          <View style={{ flexDirection: 'column', width: 265 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Groupe privé
            </Text>
            <Text style={{ color: '#757575' }}>
              Les utilisateurs pourront le rejoindre uniquement par invitation
            </Text>
          </View>
          <Switch value={switchState} onValueChange={switchOnChange} />
        </View>
      </View>
      <Button
        mode="contained"
        color="#194A4C"
        labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
        style={{ marginHorizontal: 15 }}>
        Créer le groupe
      </Button>
    </View>
  )
}

function TopBar({ goBack }) {
  return (
    <View
      style={{
        height: 80,
        backgroundColor: '#194A4C',
        marginBottom: 20,
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <IconButton
        icon="chevron-left"
        onPress={goBack}
        size={30}
        color="#fff"
        style={{ position: 'absolute', top: 20, left: 0 }}
      />
      <Text style={styles.topbarTitle}>Création de groupe</Text>
    </View>
  )
}

function ImageBox() {
  return (
    <TouchableOpacity
      style={{
        height: 200,
        width: 300,
        borderRadius: 15,
        borderColor: '#757575',
        borderWidth: 2,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginVertical: 10,
      }}
      onPress={() => alert('clicked')}>
      <Text style={{ color: '#757575', fontSize: 16, fontWeight: 'bold' }}>
        Téléchargez une image
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topbarTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
})
