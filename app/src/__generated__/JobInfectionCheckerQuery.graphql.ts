/* tslint:disable */
/* eslint-disable */
/* @relayHash 5740b1d8d08acb21a00cc2338c0261f8 */

import { ConcreteRequest } from "relay-runtime";
export type Risk = "HIGH_RISK" | "LOW_RISK" | "MIDDLE_RISK" | "%future added value";
export type DeviceKeyParam = {
    hash: string;
    password: string;
};
export type JobInfectionCheckerQueryVariables = {
    deviceHashesOfMyOwn: Array<DeviceKeyParam>;
};
export type JobInfectionCheckerQueryResponse = {
    readonly infectedEncounters: ReadonlyArray<{
        readonly howManyEncounters: number;
        readonly risk: Risk;
    } | null>;
};
export type JobInfectionCheckerQuery = {
    readonly response: JobInfectionCheckerQueryResponse;
    readonly variables: JobInfectionCheckerQueryVariables;
};



/*
query JobInfectionCheckerQuery(
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
    "name": "JobInfectionCheckerQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "JobInfectionCheckerQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "JobInfectionCheckerQuery",
    "id": null,
    "text": "query JobInfectionCheckerQuery(\n  $deviceHashesOfMyOwn: [DeviceKeyParam!]!\n) {\n  infectedEncounters(deviceHashesOfMyOwn: $deviceHashesOfMyOwn) {\n    howManyEncounters\n    risk\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'd3052d679bf162ec5bd58a5b0fb47983';
export default node;
