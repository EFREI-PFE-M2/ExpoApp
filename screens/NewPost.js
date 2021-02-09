import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
} from 'react-native'
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
import PostEditor from '../components/NewPost/PostEditor'
import RaceSelector from '../components/NewPost/RaceSelector'
import BetEditor from '../components/NewPost/BetEditor'

const NewPostStack = createStackNavigator()
export default function NewPost({ route, navigation }) {

  let feed;
  let race;
  if(route.params.hasOwnProperty("feed"))
    feed = route.params.feed;

  if(route.params.hasOwnProperty("race"))
    race = route.params.race;
  

  return (
    <NewPostStack.Navigator
      initialRouteName="Post_Editor"
      screenOptions={{headerShown: false}}>
      <NewPostStack.Screen
        name="Post_Editor"
        component={PostEditor}
        initialParams={{ feed: feed, race: race }}
      />
      <NewPostStack.Screen
        name="Race_Selector"
        component={RaceSelector}
      />
      <NewPostStack.Screen
        name="Bet_Editor"
        component={BetEditor}
      />
    </NewPostStack.Navigator>
  )
}


const styles = StyleSheet.create({
})

