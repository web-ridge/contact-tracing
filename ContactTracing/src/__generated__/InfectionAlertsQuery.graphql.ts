/* tslint:disable */
/* eslint-disable */
/* @relayHash bdb99e7f9ebe20ff16d4472652ae0561 */

import { ConcreteRequest } from "relay-runtime";
export type Risk = "HIGH_RISK" | "LOW_RISK" | "MIDDLE_RISK" | "%future added value";
export type InfectionAlertsQueryVariables = {
    bluetoothHash: string;
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
  $bluetoothHash: String!
) {
  infectedEncounters(hash: $bluetoothHash) {
    howManyEncounters
    risk
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "bluetoothHash",
    "type": "String!",
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
        "name": "hash",
        "variableName": "bluetoothHash"
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
    "text": "query InfectionAlertsQuery(\n  $bluetoothHash: String!\n) {\n  infectedEncounters(hash: $bluetoothHash) {\n    howManyEncounters\n    risk\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '55736a3d06bb991f330575833c94feb1';
export default node;
