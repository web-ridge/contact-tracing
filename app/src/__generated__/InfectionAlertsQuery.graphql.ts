/* tslint:disable */
/* eslint-disable */
/* @relayHash 6513e42ef67fa18cc28268edfc09fd20 */

import { ConcreteRequest } from "relay-runtime";
export type Risk = "HIGH_RISK" | "LOW_RISK" | "MIDDLE_RISK" | "%future added value";
export type DeviceKeyParam = {
    hash: string;
    password: string;
};
export type InfectionAlertsQueryVariables = {
    deviceHashesOfMyOwn: Array<DeviceKeyParam>;
};
export type InfectionAlertsQueryResponse = {
    readonly infectedEncounters: ReadonlyArray<{
        readonly howManyEncounters: number;
        readonly risk: Risk;
    } | null>;
};
export type InfectionAlertsQuery = {
    readonly response: InfectionAlertsQueryResponse;
    readonly variables: InfectionAlertsQueryVariables;
};



/*
query InfectionAlertsQuery(
  $deviceHashesOfMyOwn: [DeviceKeyParam!]!
) {
  infectedEncounters(deviceHashesOfMyOwn: $deviceHashesOfMyOwn) {
    howManyEncounters
    risk
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "deviceHashesOfMyOwn",
    "type": "[DeviceKeyParam!]!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "infectedEncounters",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "deviceHashesOfMyOwn",
        "variableName": "deviceHashesOfMyOwn"
      }
    ],
    "concreteType": "InfectionAlert",
    "plural": true,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "howManyEncounters",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "risk",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "InfectionAlertsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "InfectionAlertsQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "InfectionAlertsQuery",
    "id": null,
    "text": "query InfectionAlertsQuery(\n  $deviceHashesOfMyOwn: [DeviceKeyParam!]!\n) {\n  infectedEncounters(deviceHashesOfMyOwn: $deviceHashesOfMyOwn) {\n    howManyEncounters\n    risk\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '007e6bc74745311a328ec61fdc258c57';
export default node;
