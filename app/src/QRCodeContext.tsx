import React, { Component, createContext } from 'react'

const QRContext = createContext({
  key: '',
  password: '',
  updateKey: (key: string) => {},
  updatePassword: (password: string) => {},
})

export class QRCodeProvider extends Component {
  updateKey = (key: string) => {
    this.setState({ key })
  }
  updatePassword = (password: string) => {
    this.setState({ password })
  }
  state = {
    key: '',
    password: '',
    updateKey: this.updateKey,
    updatePassword: this.updatePassword,
  }

  render() {
    return (
      <QRContext.Provider value={this.state}>
        {this.props.children}
      </QRContext.Provider>
    )
  }
}
export const QRCodeConsumer = QRContext.Consumer
