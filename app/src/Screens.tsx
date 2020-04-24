// WebRidge Design

import { Navigation, Options } from 'react-native-navigation'

import AppHOC from './App'
import ScreenSymptoms from './ScreenSymptoms'
import ScreenHome from './ScreenHome'
import { ScreenDataRemoval } from './ScreenDataRemoval'
import ScreenScanQRCode from './ScreenScanQRCode'
import ScreenOnboardingSecureLock from './ScreenOnboardingSecureLock'
import ScreenOnboardingPermission from './ScreenOnboardingPermission'

export const screenHomeRoute = 'com.contacttracing.home'
const screenSymptomsRoute = 'com.contacttracing.symptomsRoute'
const screenDataRemoval = 'com.contacttracing.dataRemoval'
const screenSecureLock = 'com.contacttracing.secureLock'
const screenPermission = 'com.contacttracing.permission'

export const screenQRCode = 'com.contacttracing.screenQRCode'

Navigation.registerComponent(screenHomeRoute, () => AppHOC(ScreenHome))
Navigation.registerComponent(screenSymptomsRoute, () => AppHOC(ScreenSymptoms))
Navigation.registerComponent(screenDataRemoval, () => AppHOC(ScreenDataRemoval))
Navigation.registerComponent(screenQRCode, () => AppHOC(ScreenScanQRCode))
Navigation.registerComponent(screenSecureLock, () =>
  AppHOC(ScreenOnboardingSecureLock)
)
Navigation.registerComponent(screenPermission, () =>
  AppHOC(ScreenOnboardingPermission)
)

export const goToOnboardingSecureLockScreen = (componentId: string) => {
  Navigation.push(componentId, {
    component: {
      name: screenSecureLock,
      options: defaultOptions,
    },
  })
}
export const goToOnboardingPermissionScreen = (componentId: string) => {
  Navigation.push(componentId, {
    component: {
      name: screenPermission,
      options: defaultOptions,
    },
  })
}

export const goToQRCodeScreen = (componentId: string) => {
  Navigation.push(componentId, {
    component: {
      name: screenQRCode,
      options: defaultOptions,
    },
  })
}

export const goToDataRemovalScreen = (componentId: string) => {
  Navigation.push(componentId, {
    component: {
      name: screenDataRemoval,
      options: defaultOptions,
    },
  })
}

export const goToSymptomsScreen = (componentId: string) => {
  Navigation.push(componentId, {
    component: {
      name: screenSymptomsRoute,
      options: defaultOptions,
    },
  })
}

export const defaultOptions: Options = {
  statusBar: {
    backgroundColor: '#ffffff',
    style: 'dark',
  },
  topBar: {
    visible: false,
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
    backgroundColor: '#ffffff',
  },
}
