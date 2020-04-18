/* tslint:disable */
/* eslint-disable */
/* @relayHash 6c6c759a27d2bbc29466f4f794630225 */

import { ConcreteRequest } from "relay-runtime";
export type DeviceKeyCreateInput = {
    hash: string;
    password: string;
    time: number;
};
export type DatabaseUtilsCreateDeviceKeyMutationVariables = {
    deviceKey: DeviceKeyCreateInput;
};
export type DatabaseUtilsCreateDeviceKeyMutationResponse = {
    readonly createDeviceKey: {
        readonly ok: boolean;
    };
};
export type DatabaseUtilsCreateDeviceKeyMutation = {
    readonly response: DatabaseUtilsCreateDeviceKeyMutationResponse;
    readonly variables: DatabaseUtilsCreateDeviceKeyMutationVariables;
};



/*
mutation DatabaseUtilsCreateDeviceKeyMutation(
  $deviceKey: DeviceKeyCreateInput!
) {
  createDeviceKey(input: $deviceKey) {
    ok
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "deviceKey",
    "type": "DeviceKeyCreateInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "createDeviceKey",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "deviceKey"
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
    "name": "DatabaseUtilsCreateDeviceKeyMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "DatabaseUtilsCreateDeviceKeyMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "DatabaseUtilsCreateDeviceKeyMutation",
    "id": null,
    "text": "mutation DatabaseUtilsCreateDeviceKeyMutation(\n  $deviceKey: DeviceKeyCreateInput!\n) {\n  createDeviceKey(input: $deviceKey) {\n    ok\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'f264dbd198fde19ae294583fdf821bd4';
export default node;
