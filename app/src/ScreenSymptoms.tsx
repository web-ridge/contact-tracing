// WebRidge Design

import React, { useState } from 'react'
import { Linking, ScrollView, View, StyleSheet } from 'react-native'
import { Text, TouchableRipple } from 'react-native-paper'
import { Checkbox, Button } from 'react-native-paper'
import { Translate } from 'react-translated'
import { Navigation } from 'react-native-navigation'
import { commitMutation, graphql } from 'react-relay'

import ScreenSymptomsSendButton from './ScreenSymptomsSendButton'

import Header from './Header'
import { screenQRCode, defaultOptions } from './Screens'

import RelayEnvironment from './RelayEnvironment'
import { ScreenSymptomsFakeMutation } from './__generated__/ScreenSymptomsFakeMutation.graphql'

const generateFakeCreateMutation = graphql`
  mutation ScreenSymptomsFakeMutation {
    createInfectionCreateKeyUnauthorized {
      key
      password
    }
  }
`

export default function ScreenSymptons({
  componentId,
}: {
  componentId: string
}) {
  const [checkedSympton, setCheckedSympton] = useState<'symptons' | 'tested'>(
    'symptons'
  )
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false)
  const [keyAndPass, setKeyAndPass] = useState<{
    key: string
    password: string
  }>({ key: '', password: '' })

  const [generateState, setGenerateState] = useState<'' | 'loading' | 'error'>(
    ''
  )

  const generateFakePressed = () => {
    setGenerateState('loading')
    commitMutation<ScreenSymptomsFakeMutation>(RelayEnvironment, {
      mutation: generateFakeCreateMutation,
      variables: {},
      onCompleted: async (response, errors) => {
        if (errors) {
          console.log({ errors })
          setGenerateState('error')
        } else {
          setKeyAndPass({
            key: response.createInfectionCreateKeyUnauthorized?.key || '',
            password:
              response.createInfectionCreateKeyUnauthorized?.password || '',
          })
          setGenerateState('')
        }
      },
      onError: (err) => {
        setGenerateState('error')
      },
    })
  }

  return (
    <>
      <Header
        componentId={componentId}
        title={<Translate text="infectedTitle" />}
      ></Header>
      <ScrollView>
        {keyAndPass.key && keyAndPass.password ? (
          <>
            <Button
              mode="outlined"
              onPress={() =>
                Linking.openURL(
                  'https://www.contactentraceren.nl/Privacyverklaring.pdf'
                )
              }
              style={styles.privacyButton}
            >
              <Translate text="permissionTrustPrivacyTermsClickText" />
            </Button>
            <View
              style={[styles.symptonItemRoot, { margin: 12, elevation: 0 }]}
            >
              <TouchableRipple onPress={() => setAcceptedTerms(!acceptedTerms)}>
                <View
                  style={[
                    styles.symptonItemInner,
                    { backgroundColor: 'transparent' },
                  ]}
                >
                  <View style={styles.symptonItemInnerContent}>
                    <Text>
                      <Translate text="permissionText" />{' '}
                      <Text style={styles.permissionTrust}>
                        <Translate text="permissionTrust" />
                      </Text>
                      {/* <Translate text="permissionTrustPrivacyTermsText" /> */}
                    </Text>
                  </View>
                  <View
                    style={styles.symptonItemInnerRight}
                    pointerEvents="none"
                  >
                    <Checkbox.Android
                      status={acceptedTerms ? 'checked' : 'unchecked'}
                      color="#242648"
                      uncheckedColor="#242648"
                    />
                  </View>
                </View>
              </TouchableRipple>
            </View>

            <View style={styles.sendButtonContainer}>
              <ScreenSymptomsSendButton
                disabled={!acceptedTerms}
                createKey={keyAndPass.key}
                password={keyAndPass.password}
              />
            </View>
          </>
        ) : (
          <View style={{ padding: 24 }}>
            <Text>
              <Translate text="pickQRLetter" />
            </Text>
            <View style={{ height: 12 }}></View>
            <Button
              mode="contained"
              uppercase={false}
              icon="qrcode-scan"
              onPress={() => {
                Navigation.push(componentId, {
                  component: {
                    name: screenQRCode,
                    options: defaultOptions,
                    passProps: {
                      onScanned: (key: string, password: string) => {
                        setKeyAndPass({ key, password })
                      },
                    },
                  },
                })
              }}
            >
              <Translate text="scanQRButtonText" />
            </Button>
            <View style={{ height: 24 }}></View>
            <Text>
              <Translate text="fakeText" />
            </Text>
            <View style={{ height: 12 }}></View>
            {generateState === 'error' && (
              <Text>
                <Translate text="fakeFailed" />
              </Text>
            )}
            <Button
              loading={generateState === 'loading'}
              mode="outlined"
              uppercase={false}
              onPress={generateFakePressed}
            >
              <Translate text="scanFakeButtonText" />
            </Button>
          </View>
        )}
      </ScrollView>
    </>
  )
}

/* 
<CheckItem
    onPress={() => setCheckedSympton('symptons')}
    checked={checkedSympton === 'symptons'}
  >
    <Text style={{ fontWeight: 'bold' }}>
      <Translate text="symptomIntroduction" />
    </Text>

    <Text>
      <Translate text="symptomText" />
    </Text>
  </CheckItem>

  <Text style={styles.orText}>
    <Translate text="orText" />
  </Text>
  <CheckItem
    onPress={() => setCheckedSympton('tested')}
    checked={checkedSympton === 'tested'}
  >
    <Text>
      <Translate text="testedText" />
    </Text>
  </CheckItem> 
    

function CheckItem({
  children,
  onPress,
  checked,
}: {
  checked: boolean
  children: any
  onPress: () => any
}) {
  return (
    <View style={styles.symptonItemRoot}>
      <TouchableRipple onPress={onPress}>
        <View style={styles.symptonItemInner}>
          <View style={styles.symptonItemInnerContent}>{children}</View>
          <View style={styles.symptonItemInnerRight} pointerEvents="none">
            <RadioButton.Android
              status={checked ? 'checked' : 'unchecked'}
              color="#242648"
              uncheckedColor="#242648"
              value=""
            />
          </View>
        </View>
      </TouchableRipple>
    </View>
  )
}*/

const styles = StyleSheet.create({
  symptonItemRoot: {
    margin: 12,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 10,
  },
  symptonItemInner: {
    padding: 12,
    overflow: 'hidden',
    // borderWidth: 1,
    // borderColor: '#242648',
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  symptonItemInnerContent: { flex: 1, justifyContent: 'center' },
  symptonItemInnerRight: { justifyContent: 'center' },
  orText: { fontWeight: 'bold', textAlign: 'center', fontSize: 19 },
  sendButtonContainer: { margin: 24, marginTop: 12 },
  permissionTrust: {
    fontWeight: 'bold',
  },
  privacyButton: {
    margin: 12,
    marginBottom: 0,
  },
})
