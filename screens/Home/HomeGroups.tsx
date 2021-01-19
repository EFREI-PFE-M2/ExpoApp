import React from 'react'
import { useSelector } from 'react-redux'
import GroupCard from '../../components/GroupCards'
import { View } from '../../components/Themed'
import { getUserGroup } from '../../store/groupSlice'
import { selectCurrentUser } from '../../store/userSlice'

export default function HomeGroups() {
  const groups = useSelector(({ group }) => group.groups)

  return (
    <View>
      {Object.keys(groups)?.map((id, key) => (
        <GroupCard key={key} groupID={id} />
      ))}
    </View>
  )
}
