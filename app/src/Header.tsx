import React from 'react'
import { Appbar } from 'react-native-paper'
import { Navigation } from 'react-native-navigation'

export default function Header({
  componentId,
  title,
  light,
}: {
  title: any
  componentId: string
  light?: boolean
}) {
  return (
    <Appbar.Header
      dark={light ? true : false}
      style={{ backgroundColor: 'transparent', elevation: 0 }}
    >
      <Appbar.BackAction
        accessibilityLabel="Go back"
        onPress={() => {
          Navigation.pop(componentId)
        }}
      />
      <Appbar.Content title={title}></Appbar.Content>
    </Appbar.Header>
  )
}
