import { Navigation } from 'react-native-navigation'
import ScreenInfected from './ScreenInfected'

const screenInfectedRoute = 'com.contacttracing.infectedScreenRoute'
Navigation.registerComponent(screenInfectedRoute, () => ScreenInfected)

export const goToInfectedScreen = (componentId: string) => {
  console.log({ componentId })
  Navigation.push(componentId, {
    component: {
      name: screenInfectedRoute,
      options: defaultOptions,
    },
  })
}

export const defaultOptions = {
  statusBar: {
    backgroundColor: '#7FADF2',
    style: 'dark',
  },
  topBar: {
    elevation: 0,
    title: {
      color: 'white',
    },
    backButton: {
      color: 'white',
    },
    background: {
      color: '#7FADF2',
    },
  },
}
