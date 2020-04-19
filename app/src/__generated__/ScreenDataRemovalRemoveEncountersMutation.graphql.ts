/* tslint:disable */
/* eslint-disable */
/* @relayHash 6aea372107843b4db6874abc212b3e57 */

import { ConcreteRequest } from "relay-runtime";
export type DeviceKeyParam = {
    hash: string;
    password: string;
};
export type ScreenDataRemovalRemoveEncountersMutationVariables = {
    deviceHashesOfMyOwn: Array<DeviceKeyParam>;
};
export type ScreenDataRemovalRemoveEncountersMutationResponse = {
    readonly deleteInfectedEncountersOnKeys: {
        readonly ok: boolean;
    };
};
export type ScreenDataRemovalRemoveEncountersMutation = {
    readonly response: ScreenDataRemovalRemoveEncountersMutationResponse;
    readonly variables: ScreenDataRemovalRemoveEncountersMutationVariables;
};



/*
mutation ScreenDataRemovalRemoveEncountersMutation(
  $deviceHashesOfMyOwn: [DeviceKeyParam!]!
) {
  deleteInfectedEncountersOnKeys(keys: $deviceHashesOfMyOwn) {
    ok
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
    "name": "deleteInfectedEncountersOnKeys",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "keys",
        "variableName": "deviceHashesOfMyOwn"
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
    "name": "ScreenDataRemovalRemoveEncountersMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ScreenDataRemovalRemoveEncountersMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "ScreenDataRemovalRemoveEncountersMutation",
    "id": null,
    "text": "mutation ScreenDataRemovalRemoveEncountersMutation(\n  $deviceHashesOfMyOwn: [DeviceKeyParam!]!\n) {\n  deleteInfectedEncountersOnKeys(keys: $deviceHashesOfMyOwn) {\n    ok\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'e5d53324d1910bcf0bbb261662755a18';
export default node;
