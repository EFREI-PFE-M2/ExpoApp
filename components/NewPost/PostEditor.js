import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard
} from 'react-native'
import {
  setText,
  setImage,
  setSurvey,
  setSurveyResponses,
  setSurveyDurationTime,
  addSurveyResponseField,
  setBetData,
  selectText,
  selectImage,
  selectSurvey,
  selectBetData,
} from './../../store/postEditorSlice';

import { MaterialIcons } from '@expo/vector-icons'

import { useDispatch, useSelector } from 'react-redux'

import { newRacePost } from '../../store/raceSlice'
import { newPost } from '../../store/subscriberFeedSlice'
import { selectCurrentUser } from '../../store/userSlice'

import { Avatar, IconButton, Snackbar, Modal, Portal } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import NumericInput from 'react-native-numeric-input'
import ProfileAvatar from '../ProfileAvatar';

export default function PostEditor({ route, navigation }) {

  const { feed, race, entityID } = route.params

  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch()

  const text = useSelector(selectText);
  const image = useSelector(selectImage);
  const survey = useSelector(selectSurvey);
  const bet = useSelector(selectBetData);

  const [pending, setPending] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (Platform.OS !== 'web') {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert(
            'Désolé, nous avons besoin de votre permission pour accèder à la bibliothèque'
          )
        }
      }
    })()
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.cancelled) {
      dispatch(setImage(result.uri))
      dispatch(setSurvey(null))
      dispatch(setBetData(null))
    }
  }

  const handleTextChange = (text) => {
    dispatch(setText(text))
  }
  
  const handleSurveyResponseChange = (index, text) => {
    dispatch(setSurveyResponses({index: index, text: text}))
  }

  const handleSurveyDurationChange = (value) => {
    dispatch(setSurveyDurationTime({duration: value}))
  }
  

  const handleClearImage = () => {
    dispatch(setImage(null))
  }

  const handleClearSurvey = () => {
    dispatch(setSurvey(null))
  }

  const handleAddSurvey = () => {
      dispatch(setSurvey({
          responses: ['', ''],
          nbMinutesDuration: 1
      }))
      dispatch(setImage(null))
      dispatch(setBetData(null))
  }
  const handleAddResponse = () => {
    dispatch(addSurveyResponseField())
  }

  const handleSendPost = () => {
    Keyboard.dismiss()
    let post = {
      user: user, 
      text: text, 
      image: image, 
      survey: survey, 
      bet: bet,
      entityID: feed === 'race' ? race?.id : user.uid
    }

    dispatch(setText(''))
    dispatch(setImage(null))
    dispatch(setSurvey(null))
    dispatch(setBetData(null))
    setPending(true);
    switch(feed){
      case 'race':
        dispatch(newRacePost(post,
          ()=> { 
            setPending(false);
            alert('Post publié')
            navigation.goBack()
          },
          ()=> {
            setPending(false);
            alert('Erreur interne, veuillez réessayer')
          }))
        break;
      case 'sub':
        dispatch(newPost(post,
          ()=> { 
            setPending(false);
            alert('Post publié')
            navigation.goBack()
          },
          ()=> {
            setPending(false);
            alert('Erreur interne, veuillez réessayer')
          }))
        break;
      case 'group':
        break;
    }
    //navigation.goBack()
  }

  const handleClearBet = () => {
    dispatch(setBetData(null))
    dispatch(setText(''))
  }

  const cancel = () => {
    dispatch(setText(''))
    dispatch(setImage(null))
    dispatch(setBetData(null))
    dispatch(setSurvey(null))
    navigation.goBack()
  }

  const handleAddBet = () => {
    //if race feed go directly to bet editor
    if(feed === 'race' && race){
      navigation.navigate('Bet_Editor', {race: race})
    }else{
      navigation.navigate('Race_Selector')
    }
  }


  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, backgroundColor: '#fff' }}>
      {
        pending && (
        <Portal>
          <Modal visible={true}>
            <View style={{ alignItems: 'center'}}>
              <View style={styles.modal}>
                <Image source={require('../../assets/images/loading_horse_green.gif')}  style={{width: 72, height: 47}} />
                <Text>Sending...</Text>
              </View>
            </View>
          </Modal>
        </Portal>)
      }

      <View style={{ flexDirection: 'column', flex: 1 }}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <IconButton
              icon="window-close"
              onPress={cancel}
              size={30}
              color="#fff"
            />
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              Nouveau post
            </Text>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <View style={{ margin: 10 }}>
            <ProfileAvatar url={user.photoURL}/>
          </View>
          <ScrollView style={{ marginLeft: 10, marginRight: 10, flex: 1 }}>
            <TextInput
              multiline
              defaultValue={text}
              onChangeText={handleTextChange}
              placeholder={
                survey ? 'Posez votre question* ...' : 'Exprimez vous ...'
              }
              placeholderTextColor="grey"
            />
            {image && (
              <View style={{ marginTop: 5 }}>
                <Image
                  source={{ uri: `file://${image}` }}
                  style={{ width: '100%', height: 300, borderRadius: 10 }}
                />
                <View
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    backgroundColor: 'rgba(52, 52, 52, 0.6)',
                    alignSelf: 'flex-start',
                    borderRadius: 50,
                  }}>
                  <IconButton
                    icon="eraser"
                    size={14}
                    color="#fff"
                    onPress={handleClearImage}
                  />
                </View>
              </View>
            )}
            {survey && (
              <View
                style={{
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: '#194A4C',
                  marginTop: 5,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    {survey.responses.map((response, index) => (
                      <TextInput
                        key={index}
                        style={{
                          height: 40,
                          borderColor: '#194A4C',
                          borderWidth: 1,
                          margin: 4,
                          borderWidth: 2,
                          borderRadius: 10,
                          padding: 2,
                        }}
                        placeholder={`Choix ${index + 1} ...`}
                        onChangeText={(text) =>
                          handleSurveyResponseChange(index, text)
                        }
                      />
                    ))}
                    {survey.responses.length < 10 && (
                      <TouchableOpacity onPress={handleAddResponse}>
                        <View
                          style={{
                            height: 40,
                            borderWidth: 1,
                            margin: 4,
                            borderWidth: 2,
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                            borderColor: '#194A4C',
                          }}>
                          <Text style={{ fontSize: 20, color: '#194A4C' }}>
                            +
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    <View
                      style={{
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        margin: 4,
                        marginLeft: 20,
                      }}>
                      <Text style={{ color: '#757575' }}>
                        Durée du sondage:
                      </Text>
                      <NumericInput
                        minValue={1}
                        value={survey.nbMinutesDuration}
                        onChange={handleSurveyDurationChange}
                      />
                      <Text style={{ color: '#757575' }}>
                        {' '}
                        minute{survey.nbMinutesDuration > 1 && 's'}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      backgroundColor: 'rgba(52, 52, 52, 0.6)',
                      alignSelf: 'flex-start',
                      borderRadius: 50,
                      margin: 2,
                    }}>
                    <IconButton
                      icon="eraser"
                      size={14}
                      color="#fff"
                      onPress={handleClearSurvey}
                    />
                  </View>
                </View>
              </View>
            )}
            {bet && (
              <View style={{ backgroundColor: '#194A4C', borderRadius: 10 }}>
                <View style={styles.betHeader}>
                  <View style={styles.codeContainer}>
                    <Text style={styles.raceCode}>{bet.raceCode}</Text>
                    <Text style={styles.raceCode}>{bet.locationCode}</Text>
                  </View>
                  <View style={styles.betDesc}>
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 12,
                      }}>
                      {bet.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'transparent',
                        alignItems: 'center',
                        marginTop: 3,
                      }}>
                      <Text style={{ color: '#C6D2D2', fontSize: 10 }}>
                        {bet.raceCategory} •{' '}
                      </Text>
                      <Text style={{ color: '#C6D2D2', fontSize: 10 }}>
                        {bet.distance}m •{' '}
                      </Text>
                      <Text style={{ color: '#C6D2D2', fontSize: 10 }}>
                        {bet.nbContenders} partants
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'transparent',
                        alignItems: 'center',
                        marginTop: 3,
                      }}>
                      <MaterialIcons
                        name="location-on"
                        color="#C6D2D2"
                        size={14}
                      />
                      <Text style={{ color: '#C6D2D2', fontSize: 10 }}>
                        {bet.location}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'transparent',
                        alignItems: 'center',
                        marginTop: 3,
                      }}>
                      <MaterialIcons
                        name="access-time"
                        color="#C6D2D2"
                        size={14}
                        style={{ marginRight: 2 }}
                      />
                      <Text style={{ color: '#C6D2D2', fontSize: 10 }}>
                        {bet.raceDate}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                      justifyContent: 'center',
                      backgroundColor: 'transparent',
                    }}>
                    <View
                      style={{
                        backgroundColor: 'rgba(52, 52, 52, 0.6)',
                        borderRadius: 50,
                        margin: 2,
                      }}>
                      <IconButton
                        icon="eraser"
                        size={14}
                        color="#fff"
                        onPress={handleClearBet}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    marginLeft: 10,
                    marginBottom: 10,
                  }}>
                  {bet.betType === 'simple' && (
                    <Image
                      style={styles.betTypeImage}
                      source={require('./../../assets/images/simple.png')}
                    />
                  )}
                  {bet.betType === 'couplé' && (
                    <Image
                      style={styles.betTypeImage}
                      source={require('./../../assets/images/couple.png')}
                    />
                  )}
                  {bet.betType === 'quinté' && (
                    <Image
                      style={styles.betTypeImage}
                      source={require('./../../assets/images/quinte.png')}
                    />
                  )}
                  <View
                    style={{
                      height: '100%',
                      backgroundColor: 'transparent',
                      marginRight: 2,
                    }}>
                    <Text style={{ color: '#C6D2D2', fontSize: 8 }}>
                      ({bet.category})
                    </Text>
                  </View>
                  {bet.bet.map((result, index) => (
                    <View
                      style={{
                        borderRadius: 100,
                        width: 30,
                        height: 30,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 2,
                        backgroundColor: '#fff',
                      }}
                      key={index}>
                      <Text>{result}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
          <View
            style={{
              backgroundColor: '#fff',
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: '#D6D6D6',
              borderStyle: 'solid',
            }}>
            <IconButton
              icon="image"
              size={24}
              color="#194A4C"
              onPress={pickImage}
            />
            <IconButton
              icon="poll-box"
              size={24}
              color="#194A4C"
              onPress={handleAddSurvey}
            />
            <View style={{ flex: 1 }}>
              <IconButton
                icon="horseshoe"
                size={24}
                color="#194A4C"
                onPress={handleAddBet}
              />
            </View>
            <SendButton
              handleSendPost={handleSendPost}
              text={text}
              image={image}
              survey={survey}
              bet={bet}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

function SendButton(props){
  let {handleSendPost, text, image, survey, bet} = props
  //enable if at least text, image, bet, question + responses (for survey)
  let isDisabled = !(survey ?
    text && survey.responses.some((res)=>res.length > 0)
    :
    text || image || bet)
  return (
    <IconButton
              disabled={isDisabled}
              icon="send"
              size={24}
              color={'#194A4C'}
              onPress={handleSendPost}
    />
  )
}


const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: '#194A4C',
    flexDirection: 'row',
    alignItems: 'center',
  },
  betHeader: {
    margin: 8,
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  codeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    borderRadius:10,
    backgroundColor: "#113435"
  },
  raceCode: {
    color: "#fff",
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  betDesc: {
    margin: 5,
    flexDirection: 'column', 
    justifyContent: 'space-between', 
    backgroundColor: 'transparent',
  },
  betTypeImage: {
    width:  85,
    height: 30,
    marginRight: 2
  },
  modal: {
    borderRadius: 10,
    backgroundColor: '#fff', 
    paddingHorizontal: 10, 
    paddingVertical: 10
  }
})
