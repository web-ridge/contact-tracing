// WebRidge Design

import { Platform, NativeModules } from 'react-native'

import { Provider as TranslateProvider } from 'react-translated'
import React from 'react'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'

import translations from './translations'
import { QRCodeProvider } from './QRCodeContext'

const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
    : NativeModules.I18nManager.localeIdentifier

const deviceLanguageShort =
  deviceLanguage.length > 2 ? deviceLanguage.substring(0, 2) : deviceLanguage

const theme = {
  ...DefaultTheme,
  roundness: 20,
  colors: {
    ...DefaultTheme.colors,
    primary: '#242648',
    accent: '#F27188',
    text: '#242648',
  },
}
export default function HOC(WrappedComponent: any) {
  return function (props: { componentId: string }) {
    return (
      <TranslateProvider
        language={deviceLanguageShort}
        translation={translations}
      >
        <PaperProvider theme={theme}>
          <QRCodeProvider>
            <WrappedComponent {...props} />
          </QRCodeProvider>
        </PaperProvider>
      </TranslateProvider>
    )
  }
}
