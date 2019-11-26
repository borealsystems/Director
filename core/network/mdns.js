const mdns = require('mdns')

const directorUI = mdns.createAdvertisement(mdns.tcp('director-ui'), 3000)
const directorGQL = mdns.createAdvertisement(mdns.tcp('director-gql'), 3001)

directorUI.start()
directorGQL.start()
