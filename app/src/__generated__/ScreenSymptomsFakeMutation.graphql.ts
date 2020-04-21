/* tslint:disable */
/* eslint-disable */
/* @relayHash f849669f932a5f5bf1f1b3af19063bf7 */

import { ConcreteRequest } from "relay-runtime";
export type ScreenSymptomsFakeMutationVariables = {};
export type ScreenSymptomsFakeMutationResponse = {
    readonly createInfectionCreateKeyUnauthorized: {
        readonly key: string;
        readonly password: string;
    } | null;
};
export type ScreenSymptomsFakeMutation = {
    readonly response: ScreenSymptomsFakeMutationResponse;
    readonly variables: ScreenSymptomsFakeMutationVariables;
};



/*
mutation ScreenSymptomsFakeMutation {
  createInfectionCreateKeyUnauthorized {
    key
    password
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "createInfectionCreateKeyUnauthorized",
    "storageKey": null,
    "args": null,
    "concreteType": "InfectionCreateKey",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "key",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "password",
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
    "name": "ScreenSymptomsFakeMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ScreenSymptomsFakeMutation",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "ScreenSymptomsFakeMutation",
    "id": null,
    "text": "mutation ScreenSymptomsFakeMutation {\n  createInfectionCreateKeyUnauthorized {\n    key\n    password\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '0887186ec858286817692579d8873877';
export default node;
