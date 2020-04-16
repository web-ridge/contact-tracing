import { Navigation } from 'react-native-navigation'

import React from 'react'
import App from './src/ScreenHome'
import { Provider as PaperProvider } from 'react-native-paper'

export default function AppWrappers(props) {
  return (
    <PaperProvider>
      <App {...props} />
    </PaperProvider>
  )
}
Navigation.setDefaultOptions({
  statusBar: {
    backgroundColor: '#4d089a',
  },
  topBar: {
    title: {
      color: 'white',
    },
    backButton: {
      color: 'white',
    },
    background: {
      color: '#4d089a',
    },
  },
})
Navigation.registerComponent('com.contacttracing.Root', () => AppWrappers)
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        options: {
          statusBar: {
            backgroundColor: '#4d089a',
          },
          topBar: {
            title: {
              color: 'white',
            },
            backButton: {
              color: 'white',
            },
            background: {
              color: '#4d089a',
            },
          },
        },
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
