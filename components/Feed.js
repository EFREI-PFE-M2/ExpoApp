import React, {useRef, useEffect} from 'react'

let alreadyInBottomZone = false;

export default function Feed(props) {

  const { posts, loadRecent, loadNext, isLoadingRecent, isLoadingNext, isReachedEnd} = props

  
  return (
    <View style={styles.container}>
      <View style={styles.loadingGif}>
      {refreshing && <Image source={require('../../assets/images/loading_horse_green.gif')}  style={{width: 72, height: 47}} />}
      </View>
       <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="transparent"
            colors={['transparent']}
            style={{backgroundColor: 'transparent'}}
          />
        }
       >
        <FlatList
            data={posts}
            renderItem={({post}) => (
                  
            )}
        />
      </ScrollView>
    </View>
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
    height: 50
  }
})