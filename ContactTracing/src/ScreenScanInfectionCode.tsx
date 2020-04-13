import React, { useState } from 'react'
import { StyleSheet, View, StatusBar, Platform, Modal } from 'react-native'
import { BleManager } from 'react-native-ble-plx'
import { Checkbox, Text } from 'react-native-paper'
import { check, request, PERMISSIONS } from 'react-native-permissions'

function InfectionModal() {
  const [infectionModalOpen, setInfectionModalOpen] = useState(false)

  return <></>
}

const styles = StyleSheet.create({
  centeredView: {},
})

export default App
