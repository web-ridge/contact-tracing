import { Navigation, Options } from 'react-native-navigation'
import ScreenInfected from './ScreenInfected'
import ScreenSymptons from './ScreenSymptoms'

const screenInfectedRoute = 'com.contacttracing.infectedScreenRoute'
const screenSymptonsRoute = 'com.contacttracing.symptomsRoute'

Navigation.registerComponent(screenInfectedRoute, () => ScreenInfected)
Navigation.registerComponent(screenSymptonsRoute, () => ScreenSymptons)

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
