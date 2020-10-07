const createRealmMutationGQL = `
mutation createRealm($realm: realmInputType) {
  createRealm(realm: $realm)
}`

const deleteRealmMutationGQL = `
mutation deleteRealm($realm: realmInputType) {
  deleteRealm(realm: $realm)
}`

const updateRealmMutationGQL = `
mutation updateRealm($realm: realmInputType) {
  updateRealm(realm: $realm)
}`

const realmsQueryGQL = `{ 
  realms {
    id
    label
    description
    notes
    coreID
    coreLabel
  }
  thisCore {
    id
    label
  }
 }`

export { createRealmMutationGQL, deleteRealmMutationGQL, updateRealmMutationGQL, realmsQueryGQL }
