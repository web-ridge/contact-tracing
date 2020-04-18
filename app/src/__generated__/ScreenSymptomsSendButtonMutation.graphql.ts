/* tslint:disable */
/* eslint-disable */
/* @relayHash 80e444dddf4b821a1e36033c634036c9 */

import { ConcreteRequest } from "relay-runtime";
export type InfectedEncountersCreateInput = {
    infectedEncounters: Array<InfectedEncounterCreateInput>;
};
export type InfectedEncounterCreateInput = {
    possibleInfectedHash: string;
    rssi: number;
    hits: number;
    time: number;
    duration: number;
};
export type ScreenSymptomsSendButtonMutationVariables = {
    infectedEncounters: InfectedEncountersCreateInput;
};
export type ScreenSymptomsSendButtonMutationResponse = {
    readonly createInfectedEncounters: {
        readonly ok: boolean;
    };
};
export type ScreenSymptomsSendButtonMutation = {
    readonly response: ScreenSymptomsSendButtonMutationResponse;
    readonly variables: ScreenSymptomsSendButtonMutationVariables;
};



/*
mutation ScreenSymptomsSendButtonMutation(
  $infectedEncounters: InfectedEncountersCreateInput!
) {
  createInfectedEncounters(input: $infectedEncounters) {
    ok
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "infectedEncounters",
    "type": "InfectedEncountersCreateInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "createInfectedEncounters",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "infectedEncounters"
      }
    ],
    "concreteType": "OkPayload",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "ok",
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
    "name": "ScreenSymptomsSendButtonMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ScreenSymptomsSendButtonMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "ScreenSymptomsSendButtonMutation",
    "id": null,
    "text": "mutation ScreenSymptomsSendButtonMutation(\n  $infectedEncounters: InfectedEncountersCreateInput!\n) {\n  createInfectedEncounters(input: $infectedEncounters) {\n    ok\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '350a922fb2596da8c414deb4b0e51e79';
export default node;
