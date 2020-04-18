import { Navigation } from 'react-native-navigation'

import { defaultOptions, screenHomeRoute } from './src/Screens'
import 'react-native-get-random-values'

Navigation.setDefaultOptions(defaultOptions)

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
})
