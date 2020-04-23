/* tslint:disable */
/* eslint-disable */
/* @relayHash 5de8628e5514e7c8bbd7c160d9688a63 */

import { ConcreteRequest } from "relay-runtime";
export type Risk = "HIGH_RISK" | "LOW_RISK" | "MIDDLE_RISK" | "%future added value";
export type DeviceKeyParam = {
    hash: string;
    password: string;
};
export type BackgroundInfectionCheckerQueryVariables = {
    deviceHashesOfMyOwn: Array<DeviceKeyParam>;
};
export type BackgroundInfectionCheckerQueryResponse = {
    readonly infectedEncounters: ReadonlyArray<{
        readonly howManyEncounters: number;
        readonly risk: Risk;
    } | null>;
};
export type BackgroundInfectionCheckerQuery = {
    readonly response: BackgroundInfectionCheckerQueryResponse;
    readonly variables: BackgroundInfectionCheckerQueryVariables;
};



/*
query BackgroundInfectionCheckerQuery(
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
    "name": "BackgroundInfectionCheckerQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "BackgroundInfectionCheckerQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "BackgroundInfectionCheckerQuery",
    "id": null,
    "text": "query BackgroundInfectionCheckerQuery(\n  $deviceHashesOfMyOwn: [DeviceKeyParam!]!\n) {\n  infectedEncounters(deviceHashesOfMyOwn: $deviceHashesOfMyOwn) {\n    howManyEncounters\n    risk\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '03c97fd289ed6db42d3c44f45ac20d96';
export default node;
