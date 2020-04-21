import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { Translate } from 'react-translated'

const styles = StyleSheet.create({
  root: { flexDirection: 'row', padding: 24, alignItems: 'center' },
  fill: { flex: 1 },
})

export function DefaultFooter({
  onPressOk,
  onPressInfo,
  onPressOkLabel,
  loading,
}: {
  onPressInfo: () => any
  onPressOk: () => any
  onPressOkLabel?: any
  loading?: boolean
}) {
  return (
    <View style={styles.root}>
      <Button mode="outlined" uppercase={false} onPress={onPressInfo}>
        <Translate text={'onboardingMoreInfo'} />
      </Button>
      <View style={styles.fill} />
      <Button
        loading={loading}
        mode="contained"
        uppercase={false}
        onPress={onPressOk}
      >
        {onPressOkLabel || <Translate text={'onboardingNext'} />}
      </Button>
    </View>
  )
}
