import { Navigation } from 'react-native-navigation'
import ScreenInfected from './ScreenInfected'

const screenInfectedRoute = 'com.contacttracing.infectedScreenRoute'
Navigation.registerComponent(screenInfectedRoute, () => ScreenInfected)

export const goToInfectedScreen = (componentId: string) => {
  console.log({ componentId })
  Navigation.push(componentId, {
    component: {
      name: screenInfectedRoute,
    },
  })
}
