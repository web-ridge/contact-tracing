import { Platform, NativeModules } from 'react-native'

import { Navigation } from 'react-native-navigation'
import { Provider as TranslateProvider } from 'react-translated'
import React from 'react'
import App from './src/ScreenHome'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import translations from './src/translations'
import { defaultOptions } from './src/Screens'

const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
    : NativeModules.I18nManager.localeIdentifier

const deviceLanguageShort =
  deviceLanguage.length > 2 ? deviceLanguage.substring(0, 2) : deviceLanguage

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#242648',
    accent: '#F27188',
  },
}

export default function AppWrappers(props: { componentId: string }) {
  return (
    <TranslateProvider
      language={deviceLanguageShort}
      translation={translations}
    >
      <PaperProvider theme={theme}>
        <App {...props} />
      </PaperProvider>
    </TranslateProvider>
  )
}
Navigation.setDefaultOptions(defaultOptions)
Navigation.registerComponent('com.contacttracing.Root', () => AppWrappers)
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        options: defaultOptions,
        children: [
          {
            component: {
              name: 'com.contacttracing.Root',
            },
          },
        ],
      },
    },
  })
})
