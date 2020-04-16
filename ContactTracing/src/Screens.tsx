import { Navigation, Options } from 'react-native-navigation'

import AppHOC from './App'
import ScreenInfected from './ScreenInfected'
import ScreenSymptons from './ScreenSymptoms'
import ScreenHome from './ScreenHome'

const screenInfectedRoute = 'com.contacttracing.infectedScreenRoute'
const screenSymptonsRoute = 'com.contacttracing.symptomsRoute'
export const screenHomeRoute = 'com.contacttracing.home'

Navigation.registerComponent(screenHomeRoute, () => AppHOC(ScreenHome))
Navigation.registerComponent(screenInfectedRoute, () => AppHOC(ScreenInfected))
Navigation.registerComponent(screenSymptonsRoute, () => AppHOC(ScreenSymptons))

export const goToInfectedScreen = (componentId: string) => {
  Navigation.push(componentId, {
    component: {
      name: screenInfectedRoute,
      options: defaultOptions,
    },
  })
}

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
