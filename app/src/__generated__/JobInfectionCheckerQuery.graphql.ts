/* tslint:disable */
/* eslint-disable */
/* @relayHash fe8d0a360f47b0ef77048d11ba092969 */

import { ConcreteRequest } from "relay-runtime";
export type Risk = "HIGH_RISK" | "LOW_RISK" | "MIDDLE_RISK" | "%future added value";
export type JobInfectionCheckerQueryVariables = {
    bluetoothHash: string;
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
    "text": "query JobInfectionCheckerQuery(\n  $bluetoothHash: String!\n) {\n  infectedEncounters(hash: $bluetoothHash) {\n    howManyEncounters\n    risk\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'c41b8cb0df6e981578f0be0271debf51';
export default node;
