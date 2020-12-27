import React from 'react'
import { Text } from '../components/Themed'

const types = {
  simple: Simple,
  quinte: Quinte,
}

export default function useRaceType(type) {
  if (!type in types) return
  return types[type]
}

function Quinte() {
  return <Text>Quinte</Text>
}

function Simple() {
  return <Text>Simple</Text>
}
