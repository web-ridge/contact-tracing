import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { Translate } from 'react-translated'
import { useSafeArea } from 'react-native-safe-area-context'

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 20,
  },
  fill: { flex: 1 },
})

export default function ScreenOnboardingFooter({
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
  const insets = useSafeArea()

  return (
    <View
      style={[
        styles.root,
        {
          paddingBottom: insets.bottom + 16,
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
        },
      ]}
    >
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
