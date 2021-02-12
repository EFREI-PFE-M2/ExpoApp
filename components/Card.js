import React, { useEffect, useState, Component } from 'react'
import {View, Animated, StyleSheet, Button, Text, 
  Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';
import StarGroup from './StarGroup'

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.animation = new Animated.ValueXY({x: 0, y: 0})
    const inputRange = [0, 1]
    const outputRange = ['0deg', '90deg']
    this.rotateX = this.animation.x.interpolate({inputRange, outputRange})
    this.rotateY = this.animation.y.interpolate({inputRange, outputRange})
    this.state = {front: this.props.initialFaceIsFront}
  }

  componentWillReceiveProps = (nextProps) => {
    if(this.state.front !== nextProps.showFront){
      this.flip()
    }
  }



  flip = () => {
    this.animation['y'].setValue(0);
    Animated.timing(this.animation['y'], {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
        this.setState({front: !this.state.front})
        this.flipSecondHalf()
    });
  };

  flipSecondHalf = () => {
    this.animation['y'].setValue(1);
    Animated.timing(this.animation['y'], {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  

  render() {
    const {rotateX, rotateY} = this;
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={()=> this.props.rotateOnPress && this.flip()}>
          <Animated.View
            style={{
              ...styles.card,
              transform: [{rotateX}, {rotateY}, {perspective: 500}],
            }}
          >
              {
                  this.state.front ?
                  <PaperCard elevation={0} style={{flex: 1}}>
                    <PaperCard.Cover source={{ uri: this.props.picture }} />
                    <PaperCard.Content>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{fontSize: 22}}>{this.props.title}</Text>
                        </View>
                        <StarGroup star={this.props.rarity}/>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{fontSize: 10, color: '#757575', marginBottom: 3}}>{this.props.desc}</Text>
                        </View>
                    </PaperCard.Content>
                    <TouchableOpacity onPress={()=> 
                      this.props.chooseLineOnPress &&
                      this.props.chooseCaracteristic('corde_gauche')}>
                        <View style={[styles.line, {backgroundColor: '#D6D6D6'}]}>
                                <Text style={{fontSize: 20}}>Corde gauche</Text>
                                <Text style={{fontSize: 20}}>{this.props.caracteristics.corde_gauche}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> 
                      this.props.chooseLineOnPress &&
                      this.props.chooseCaracteristic('corde_droite')}>
                        <View style={[styles.line]}>
                                <Text style={{fontSize: 20}}>Corde droite</Text>
                                <Text style={{fontSize: 20}}>{this.props.caracteristics.corde_droite}</Text>
                        </View>
                    </TouchableOpacity>
            
                    <TouchableOpacity onPress={()=> 
                      this.props.chooseLineOnPress &&
                      this.props.chooseCaracteristic('herbe')}>
                        <View style={[styles.line, {backgroundColor: '#D6D6D6'}]}>
                                <Text style={{fontSize: 20}}>Herbe</Text>
                                <Text style={{fontSize: 20}}>{this.props.caracteristics.herbe}</Text>
                        </View>
                    </TouchableOpacity>
            
                    <TouchableOpacity onPress={()=> 
                      this.props.chooseLineOnPress &&
                      this.props.chooseCaracteristic('psf')}>
                        <View style={[styles.line]}>
                                <Text style={{fontSize: 20}}>PSF</Text>
                                <Text style={{fontSize: 20}}>{this.props.caracteristics.psf}</Text>
                        </View>
                    </TouchableOpacity>
                    
            
                </PaperCard>
                  :
                  <View style={styles.backContent}>
                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                      <Text style={{color: '#fff'}}>Votre carte</Text>
                      <Image source={require('../assets/images/logo3.png')} style={{width:200, height: 200}}/>
                    </View>
                    
                  </View>
              }
              
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  card: {
    height: 420,
    width: 300,
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 10,
  },
  frontContent: {
    
  },
  backContent: {
    flex: 1,
    backgroundColor: '#194A4C',
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  line: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5,
    paddingHorizontal: 5
  }
});