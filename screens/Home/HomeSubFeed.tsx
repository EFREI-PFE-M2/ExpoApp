import React from 'react'
import { View} from '../../components/Themed'
import Post from '../../components/Post'
import { StyleSheet, SafeAreaView, ScrollView, RefreshControl } from 'react-native'





export default function HomeSubFeed() {

  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
       <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
       >
        <Post 
          type="image"
          photoURL="https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg"
          username="Jeff B." date="21/06/2020" nbLikes={2} nbComments={14}
          text="Hello what's up everyone"
          content={{image: "https://cdn.radiofrance.fr/s3/cruiser-production/2019/06/f7b16196-c9e4-400e-975b-e6cf10b1ca00/870x489_a3878acdc3ef.jpg"}}
          />
          <Post 
          type="bet"
          photoURL="https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg"
          username="Jeff B." date="21/06/2020" nbLikes={2} nbComments={14}
          text="This is my bet"
          content={{nbCopiedBet: 5, betID: 34}}
          />
          <Post 
          type="survey"
          photoURL="https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg"
          username="Jeff B." date="21/06/2020" nbLikes={2} nbComments={14}
          text="Ca va?"
          content={{responses: {'oui': 545, 'non': 120, 'peut être' : 60}, expirationDatetime: new Date(), userVote: ''}}
          />
      </ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5E5E5',
    height: '100%',
  }
})