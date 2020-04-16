import { Navigation } from 'react-native-navigation'

import React from 'react'
import App from './src/ScreenHome'
import { Provider as PaperProvider } from 'react-native-paper'

export default function AppWrappers() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  )
}

Navigation.registerComponent('root', () => AppWrappers)
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'root',
            },
          },
        ],
      },
    },
  })
})
