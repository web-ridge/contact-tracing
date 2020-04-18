/* tslint:disable */
/* eslint-disable */
/* @relayHash 1c8dda6f99c878489c59051d93a99da6 */

import { ConcreteRequest } from "relay-runtime";
export type Risk = "HIGH_RISK" | "LOW_RISK" | "MIDDLE_RISK" | "%future added value";
export type InfectionAlertsQueryVariables = {
    uniqueDeviceId: string;
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
  $uniqueDeviceId: String!
) {
  infectedEncounters(hash: $uniqueDeviceId) {
    howManyEncounters
    risk
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "uniqueDeviceId",
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
        "variableName": "uniqueDeviceId"
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
    "text": "query InfectionAlertsQuery(\n  $uniqueDeviceId: String!\n) {\n  infectedEncounters(hash: $uniqueDeviceId) {\n    howManyEncounters\n    risk\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '38d8f116f5f92e79b2f8c8e1dd365b68';
export default node;
