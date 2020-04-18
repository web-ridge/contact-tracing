import { Environment, Network, RecordSource, Store } from 'relay-runtime'
// import { RelayTransactionLogger } from './RelayTransactionLogger'

// Export a singleton instance of Relay Environment configured with our network function:
const env = new Environment({
  network: Network.create(fetchGraphQL),
  store: new Store(new RecordSource(), {
    // @ts-ignore
    gcReleaseBufferSize: 2000,
  }),
}) as any

async function fetchGraphQL(params: any, variables: any, _cacheConfig: any) {
  let headers: any = {
    'Content-Type': 'application/json',
  }

  const response = await fetch('https://api.contactentraceren.nl/graphql', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  })
  // Get the response as JSON
  const json = await response.json()

  // GraphQL returns exceptions (for example, a missing required variable) in the "errors"
  // property of the response. If any exceptions occurred when processing the request,
  // throw an error to indicate to the developer what went wrong.
  if (Array.isArray(json.errors)) {
    console.log(json.errors)
    // throw new Error(
    //   `Error fetching GraphQL query '${
    //     params.name
    //   }' with variables '${JSON.stringify(variables)}': ${JSON.stringify(
    //     json.errors
    //   )}`
    // )
  }

  // Otherwise, return the full payload.
  return json
}

export default env
