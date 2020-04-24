// WebRidge Design

import React from 'react'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider as TranslateProvider } from 'react-translated'

import translations from './translations'
import { QRCodeProvider } from './QRCodeContext'
import { deviceLanguageShort } from './Utils'

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
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    )
  }
}
