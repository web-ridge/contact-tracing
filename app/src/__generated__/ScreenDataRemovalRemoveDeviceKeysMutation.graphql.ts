/* tslint:disable */
/* eslint-disable */
/* @relayHash daf45d0b1d103d1e673b62144aa378f0 */

import { ConcreteRequest } from "relay-runtime";
export type DeviceKeyParam = {
    hash: string;
    password: string;
};
export type ScreenDataRemovalRemoveDeviceKeysMutationVariables = {
    deviceHashesOfMyOwn: Array<DeviceKeyParam>;
};
export type ScreenDataRemovalRemoveDeviceKeysMutationResponse = {
    readonly removeDeviceKeys: {
        readonly ok: boolean;
    };
};
export type ScreenDataRemovalRemoveDeviceKeysMutation = {
    readonly response: ScreenDataRemovalRemoveDeviceKeysMutationResponse;
    readonly variables: ScreenDataRemovalRemoveDeviceKeysMutationVariables;
};



/*
mutation ScreenDataRemovalRemoveDeviceKeysMutation(
  $deviceHashesOfMyOwn: [DeviceKeyParam!]!
) {
  removeDeviceKeys(keys: $deviceHashesOfMyOwn) {
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
    "name": "removeDeviceKeys",
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
    "name": "ScreenDataRemovalRemoveDeviceKeysMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ScreenDataRemovalRemoveDeviceKeysMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "ScreenDataRemovalRemoveDeviceKeysMutation",
    "id": null,
    "text": "mutation ScreenDataRemovalRemoveDeviceKeysMutation(\n  $deviceHashesOfMyOwn: [DeviceKeyParam!]!\n) {\n  removeDeviceKeys(keys: $deviceHashesOfMyOwn) {\n    ok\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '5104cfa4ebb11d488d2dfb6e2c1fb0c7';
export default node;
