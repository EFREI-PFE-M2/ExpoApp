import React from 'react'
import { View} from '../../components/Themed'
import Post from '../../components/Post'
import { StyleSheet, SafeAreaView, ScrollView, RefreshControl, Image } from 'react-native'
let alreadyInBottomZone = false;

export default function HomeSubFeed() {

  const [loadingRecent, setLoadinRecent] = React.useState(false);
  const [loadingNext, setLoadingNext] = React.useState(false);

  

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const onLoadRecent = React.useCallback(() => {
    setLoadinRecent(true);

    wait(2000).then(() => setLoadinRecent(false));
  }, []);

  const onLoadNext = React.useCallback(() => {
    setLoadingNext(true);

    wait(2000).then(() => setLoadingNext(false));
  }, []);

  const isInBottomZone = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 50;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/*
      <View style={styles.loadingGif}>
      {loadingRecent && <Image source={require('../../assets/images/loading_horse_green.gif')}  style={{width: 72, height: 47}} />}
      </View>
      
       <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={loadingRecent} 
            onRefresh={onLoadRecent} 
            tintColor="transparent"
            colors={['transparent']}
            style={{backgroundColor: 'transparent'}}
          />
        }
        onScroll={({nativeEvent}) => {
          let {layoutMeasurement, contentOffset, contentSize} = nativeEvent
          
          if(!isInBottomZone(nativeEvent)){
            alreadyInBottomZone = false
          }

          if(!alreadyInBottomZone && isInBottomZone(nativeEvent)){
            alreadyInBottomZone = true
            onLoadNext()
          }
        }}
        scrollEventThrottle={400}
       >
        <Post 
          type="image"
          photoURL="https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg"
          username="Jeff B." date="21/06/2020" nbLikes={2} nbComments={14}
          text="Hello what's up everyone"
          image="https://cdn.radiofrance.fr/s3/cruiser-production/2019/06/f7b16196-c9e4-400e-975b-e6cf10b1ca00/870x489_a3878acdc3ef.jpg"
          />
          <Post 
          type="bet"
          photoURL="https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg"
          username="Jeff B." date="21/06/2020" nbLikes={2} nbComments={14}
          betLocationCode="C1"
          betRaceCode="R2"
          betActionUrl={"https://www.pmu.fr/turf/R4/C9"}
          text="This is my bet"
          betTitle= "PRIX VALLEE VESUBIE"
          betRaceDate={new Date().toISOString()}
          betRaceCategory= "Plat"
          betCategory="désordre"
          betDistance={2066}
          betNbContenders={11}
          betLocation="VINCENNES"
          betType="quinté"
          betResults= {[5, 2, 7, 2, 1]}
          bet= {[5, 2, 7, 1, 2]}
          nbCopiedBet={5}
          />
          
          <Post 
          type="survey"
          photoURL="https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg"
          username="Jeff B." date="21/06/2020" nbLikes={2} nbComments={14}
          text="Ca va?"
          responses={{'oui': 545, 'non': 120, 'peut être' : 60}}
          expirationDate={new Date('2021-01-28T12:00:00')}
          userVote={1}
          />
          <View style={styles.loadingGif}>
            {loadingNext && <Image source={require('../../assets/images/loading_horse_green.gif')}  style={{width: 72, height: 47}} />}
          </View>
      </ScrollView>
      */}
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5E5E5',
    height: '100%',
  },
  loadingGif: {
    flex: 1,
    alignItems: 'center',
    height: 50,
    backgroundColor: 'transparent'
  }
})