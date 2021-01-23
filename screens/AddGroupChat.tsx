import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Avatar, TextInput } from 'react-native-paper';
import { View } from "../components/Themed";

export default function AddGroupChat() {
    const [name, setName] = React.useState('')
    const nameOnChange = (newName: string) => setName(newName)

    return(<View style={styles.container}>
        <Text style={styles.titleStyle}>Photo de groupe</Text>
        <Avatar.Image size={140} style={styles.photoStyle}
          source={{uri: 'https://m.info.pmu.fr/images/pmu.jpg'}}
        />
        <Text style={styles.titleStyle}>Nom de groupe</Text>
        <TextInput
          value={name}
          onChangeText={nameOnChange}
          mode="outlined"
          placeholder="e.g. PMU's Dev Team"
          placeholderTextColor="#757575"
          style={{ width: '100%', paddingHorizontal: 25}}
          theme={{
            colors: {
              background: '#0002',
              text: '#000',
            },
          }}
        />
        
        <Text style={styles.titleStyle}>Utilisateurs invités</Text>
    </View>)
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    titleStyle: {
        marginLeft: 30, marginTop: 20, fontSize: 18
    },
    photoStyle: {
        marginLeft: 30, marginTop: 20 
    }
})