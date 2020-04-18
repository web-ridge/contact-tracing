/* tslint:disable */
/* eslint-disable */
/* @relayHash 01962d0ceb05d8cb909be94bcdd9e74d */

import { ConcreteRequest } from 'relay-runtime'
export type Risk =
  | 'HIGH_RISK'
  | 'LOW_RISK'
  | 'MIDDLE_RISK'
  | '%future added value'
export type DeviceKeyParam = {
  hash: string
  password: string
}
export type EncounterInput = {
  hash: string
  rssi: number
  hits: number
  time: number
  duration: number
}
export type InfectionAlertsQueryVariables = {
  deviceHashesOfMyOwn: Array<DeviceKeyParam>
  optionalEncounters?: Array<EncounterInput> | null
}
export type InfectionAlertsQueryResponse = {
  readonly infectedEncounters: ReadonlyArray<{
    readonly howManyEncounters: number
    readonly risk: Risk
  } | null>
}
export type InfectionAlertsQuery = {
  readonly response: InfectionAlertsQueryResponse
  readonly variables: InfectionAlertsQueryVariables
}

/*
query InfectionAlertsQuery(
  $deviceHashesOfMyOwn: [DeviceKeyParam!]!
  $optionalEncounters: [EncounterInput!]
) {
  infectedEncounters(deviceHashesOfMyOwn: $deviceHashesOfMyOwn, optionalEncounters: $optionalEncounters) {
    howManyEncounters
    risk
  }
}
*/

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        kind: 'LocalArgument',
        name: 'deviceHashesOfMyOwn',
        type: '[DeviceKeyParam!]!',
        defaultValue: null,
      },
      {
        kind: 'LocalArgument',
        name: 'optionalEncounters',
        type: '[EncounterInput!]',
        defaultValue: null,
      },
    ],
    v1 = [
      {
        kind: 'LinkedField',
        alias: null,
        name: 'infectedEncounters',
        storageKey: null,
        args: [
          {
            kind: 'Variable',
            name: 'deviceHashesOfMyOwn',
            variableName: 'deviceHashesOfMyOwn',
          },
          {
            kind: 'Variable',
            name: 'optionalEncounters',
            variableName: 'optionalEncounters',
          },
        ],
        concreteType: 'InfectionAlert',
        plural: true,
        selections: [
          {
            kind: 'ScalarField',
            alias: null,
            name: 'howManyEncounters',
            args: null,
            storageKey: null,
          },
          {
            kind: 'ScalarField',
            alias: null,
            name: 'risk',
            args: null,
            storageKey: null,
          },
        ],
      },
    ]
  return {
    kind: 'Request',
    fragment: {
      kind: 'Fragment',
      name: 'InfectionAlertsQuery',
      type: 'Query',
      metadata: null,
      argumentDefinitions: v0 /*: any*/,
      selections: v1 /*: any*/,
    },
    operation: {
      kind: 'Operation',
      name: 'InfectionAlertsQuery',
      argumentDefinitions: v0 /*: any*/,
      selections: v1 /*: any*/,
    },
    params: {
      operationKind: 'query',
      name: 'InfectionAlertsQuery',
      id: null,
      text:
        'query InfectionAlertsQuery(\n  $deviceHashesOfMyOwn: [DeviceKeyParam!]!\n  $optionalEncounters: [EncounterInput!]\n) {\n  infectedEncounters(deviceHashesOfMyOwn: $deviceHashesOfMyOwn, optionalEncounters: $optionalEncounters) {\n    howManyEncounters\n    risk\n  }\n}\n',
      metadata: {},
    },
  }
})()
;(node as any).hash = '613ada24cff6aaaa4099c92d8473ea9e'
export default node
