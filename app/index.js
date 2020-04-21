import { Navigation } from 'react-native-navigation'

import { defaultOptions, screenHomeRoute } from './src/Screens'
import 'react-native-get-random-values'

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        options: defaultOptions,
        children: [
          {
            component: {
              name: screenHomeRoute,
            },
          },
        ],
      },
    },
  })
  Navigation.setDefaultOptions(defaultOptions)
})
