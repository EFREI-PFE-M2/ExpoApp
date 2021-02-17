import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Avatar, Surface } from 'react-native-paper';

export default function CardResult({ caracteristic, score , name, win, cardPicture, userPicture }) {
  const color = win ? '#53EC7E' : '#EC5353'
  return (
    <Surface style={styles.container}>
      <Image
        source={{
          uri: cardPicture,
        }}
        style={styles.background}
      />
      <Text style={styles.title}>{name}</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flex: 1,
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.char}>{caracteristic}</Text>
          <Text style={[styles.number, {color}]}>{score}</Text>
        </View>
        <Avatar.Image
          source={{
            uri: userPicture
          }}
          size={48}
          style={styles.avatar}
        />
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    width: 300,
    height: 175,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
  },
  background: {
    width: '100%',
    height: 110,
  },
  title: {
    backgroundColor: '#fff',
    borderRadius: 30,
    position: 'absolute',
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontSize: 24,
    alignSelf: 'center',
    top: 60,
  },
  char: {
    fontSize: 24,
    marginLeft: 10,
  },
  number: { fontSize: 24, marginLeft: 10, fontWeight: 'bold' },
  avatar: { marginRight: 10 },
});
