import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import {
  Button,
  HelperText,
  Modal,
  Portal,
  TextInput,
} from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text } from '../components/Themed'
import {
  deleteGroupRequest,
  leaveGroupRequest,
  removeGroup,
  updateGroupInfo,
} from '../store/groupSlice'
import { selectCurrent } from '../store/userSlice'

export default function GroupParameters({ route, navigation }) {
  const { groupID } = route.params
  const { currentUserIsMember, name, masterID } = useSelector(
    ({ group }) => group.groups[groupID]
  )
  const dispatch = useDispatch()
  const userID = useSelector(selectCurrent)
  const isAdmin = masterID === userID

  const [dialog, setDialog] = useState(false)
  const [leaveDialog, setLeaveDialog] = useState(false)
  const [removeDialog, setRemoveDialog] = useState(false)
  const [error, setError] = useState('')

  const deleteGroup = (input) => {
    if (input === name) {
      dispatch(deleteGroupRequest(userID, groupID))
      navigation.navigate('Home_Home')
    } else {
      setError('Saisie incorrecte.')
    }
  }

  const leaveGroup = (input) => {
    if (input === name) {
      dispatch(leaveGroupRequest(userID, groupID))
      navigation.navigate('Home_Home')
    } else {
      setError('Saisie incorrecte.')
    }
  }

  const saveGroup = (input) => {
    if (!input) {
      setError('Le nom ne peut pas être vide.')
    } else {
      dispatch(updateGroupInfo(input, groupID))
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      {isAdmin && (
        <Button
          mode="outlined"
          color="#194A4C"
          style={styles.button}
          onPress={() => setDialog(true)}>
          Changer le nom
        </Button>
      )}

      <Portal>
        <RenderDialog
          visible={dialog}
          onDismiss={() => setDialog(false)}
          error={error}
          confirm={saveGroup}
        />
        <RenderDialog
          visible={leaveDialog}
          onDismiss={() => setLeaveDialog(false)}
          error={error}
          confirm={leaveGroup}
        />
        <RenderDialog
          visible={removeDialog}
          onDimiss={() => setRemoveDialog(false)}
          error={error}
          confirm={removeGroup}
        />
      </Portal>

      <View style={{ marginVertical: 25 }}>
        {isAdmin ? (
          <Button
            color="#ff3333"
            mode="outlined"
            onPress={() => setRemoveDialog(true)}>
            Supprimer ce groupe
          </Button>
        ) : (
          <Button
            color="#ff3333"
            mode="outlined"
            onPress={() => setLeaveDialog(true)}>
            Quitter ce groupe
          </Button>
        )}
      </View>
    </View>
  )
}

const RenderDialog = ({ visible, onDismiss, error, confirm }) => {
  const [input, setInput] = useState('')

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.dialogContainer}>
      <Text>Saisir:</Text>
      <TextInput
        value={input}
        onChangeText={(value) => setInput(value)}
        theme={{ colors: { text: '#000' } }}
        style={{ marginVertical: 10 }}
        error={error !== ''}
      />
      <HelperText type="error" visible={error !== ''}>
        {error}
      </HelperText>
      <View style={styles.buttonContainer}>
        <Button color="#194A4C" onPress={() => confirm(input)}>
          Confimer
        </Button>
        <Button color="#ff3333" onPress={() => onDismiss()}>
          Annuler
        </Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 25,
  },
  button: {},
  dialogContainer: {
    backgroundColor: '#fff',
    padding: 20,
    width: 350,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
