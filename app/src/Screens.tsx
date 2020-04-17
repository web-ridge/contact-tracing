import { Navigation, Options } from 'react-native-navigation'

import AppHOC from './App'
import ScreenSymptons from './ScreenSymptoms'
import ScreenHome from './ScreenHome'

const screenSymptonsRoute = 'com.contacttracing.symptomsRoute'
export const screenHomeRoute = 'com.contacttracing.home'

Navigation.registerComponent(screenHomeRoute, () => AppHOC(ScreenHome))
Navigation.registerComponent(screenSymptonsRoute, () => AppHOC(ScreenSymptons))

export const goToSymptonsScreen = (componentId: string) => {
  Navigation.push(componentId, {
    component: {
      name: screenSymptonsRoute,
      options: defaultOptions,
    },
  })
}
export const defaultOptions: Options = {
  statusBar: {
    backgroundColor: '#7FADF2',
    style: 'dark',
  },
  topBar: {
    elevation: 0,
    title: {
      color: '#242648',
    },
    backButton: {
      color: '#242648',
    },
    background: {
      color: '#7FADF2',
    },
  },
  layout: {
    backgroundColor: '#7FADF2',
  },
}