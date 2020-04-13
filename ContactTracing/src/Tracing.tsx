import { Platform } from 'react-native'
import BackgroundService from 'react-native-background-actions'
// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
const scanForBluetoothDevices = async (taskDataArguments) => {
  // Example of an infinite loop task
  const { delay } = taskDataArguments
  await new Promise((resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log(i)
      await sleep(delay)
    }
  })
}

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask desc',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  parameters: {
    delay: 1000,
  },
}

export default function startTracing() {
  return BackgroundService.start(scanForBluetoothDevices, {
    taskName: 'ContactTracing',
    taskTitle: 'Corona onder controle',
    taskDesc: 'Samen krijgen we Corona onder controle',
    color: 'blue',
    taskIconOptions: {
      name: '',
      type: '',
      package: '',
    },
  })
}
