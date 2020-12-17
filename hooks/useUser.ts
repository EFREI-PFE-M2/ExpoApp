import { useSelector } from 'react-redux'
import { selectCurrent } from '../store/userSlice'
import { User } from './../types'

export default function (): User {
  const user = useSelector(selectCurrent)

  return user
}
