import { Animated } from "react-native"

export function GetRoomTitleShort(title: string) {
  if (title.length > 25) return title.substring(0, 25) + '...'
  else return title
}

export function GetMessageShort(comment: string) {
  if (comment.length > 35) return comment.substring(0, 34) + '...'
  else return comment
}

export function GetPublishedDate(dt: Date) {
  let now = new Date()
  let yesterday = new Date()
  yesterday.setDate(now.getDate()-1)

  let hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()
  let mins = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes()
  let oclock = hours + 'h' + mins

  if (dt.getFullYear() == now.getFullYear() && dt.getMonth() == now.getMonth() && dt.getDate() == now.getDate()) 
    return `Aujourd'hui, à ${oclock}`
  else if (yesterday.getDate() == dt.getDate()) return `Hier, à ${oclock}`
  else {
    let weekdays = [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ]
    let months = [
      'Jan',
      'Fev',
      'Mars',
      'Avr',
      'Mai',
      'Juin',
      'Jui',
      'Aout',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    let weekday = weekdays[dt.getDay()]
    let day = dt.getDate()
    let month = months[dt.getMonth()]
    let year =
      now.getFullYear() === dt.getFullYear() ? '' : ' ' + dt.getFullYear()
    return `${weekday} ${day} ${month}${year}, à ${oclock}`
  }
}

export const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const wait = (timeout: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export const fadeIn = (fadeAnimation: Animated.Value | Animated.ValueXY) => {
  // Will change fadeAnimation value to 1 in 500 ms
  Animated.timing(fadeAnimation, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true
  }).start();
};

export const fadeOut = (fadeAnimation: Animated.Value | Animated.ValueXY) => {
  // Will change fadeAnimation value to 0 in 500 ms
  Animated.timing(fadeAnimation, {
    toValue: 0,
    duration: 500,
    useNativeDriver: true
  }).start();
};

export function sortChatFunction(a: any, b: any) {
  const aLastMessage = a.data.lastMessage
  const aLength = Object.keys(aLastMessage).length
  const bLastMessage = b.data.lastMessage
  const bLength = Object.keys(bLastMessage).length

  if (aLength && bLength) {
    return (
      aLastMessage.createdAt['seconds'] -
      bLastMessage.createdAt['seconds']
    )
  } else {
    const aCreatedAt = a.data.createdAt
    const bCreatedAt = b.data.createdAt
    if (bLength) {
      return aCreatedAt['seconds'] - bLastMessage.createdAt['seconds']
    } else if (aLength) {
      return aLastMessage.createdAt['seconds'] - bCreatedAt['seconds']
    } else {
      return aCreatedAt['seconds'] - bCreatedAt['seconds']
    }
  }
}

import constants from '../constants/ChatConstants'

export function checkMessageType (type1: string, type2: string) {
  switch(type1) {
    case(constants.message.type.text):
    case(constants.message.type.image):
    case(constants.message.type.audio):
    case(constants.message.type.edited):
    case(constants.message.type.deleted):
      return type1 === type2
    default:
      return false
  }
}