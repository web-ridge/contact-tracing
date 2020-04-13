import React from 'react'
import { AppRegistry } from 'react-native'
import App from './src/ScreenHome'
import { name as appName } from './app.json'
import { Provider as PaperProvider } from 'react-native-paper'

export default function AppWrappers() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  )
}

AppRegistry.registerComponent(appName, () => AppWrappers)
