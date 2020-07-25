import { createClient } from 'urql'
import log from '../utils/log'

let director = null

const initGQLClient = (address) => {
  director = createClient({
    url: address,
    requestPolicy: 'network-only',
    maskTypename: true
  })

  const query = `{
    getStatus
  }`

  director.query(query)
    .toPromise()
    .then(result => {
      if (result.data.getStatus[0] === 'success') {
        log('info', 'link/src/network/graphql', 'Connected Successfully')
      }
    })
}

export { initGQLClient, director }
