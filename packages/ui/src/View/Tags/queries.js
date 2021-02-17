const tagsQueryGQL = `query tags($realm: String, $core: String ) {
  tags(core: $core, realm: $realm) {
    id
    label
    core
    realm
    colour {
      id
      label
    }
  }
  globalColours {
    id
    label
  }
}`

const updateTagMutationGQL = `mutation updateTag($tag: tagInputType) {
  updateTag(tag:$tag) {
    id
  }
}`

const deleteTagMutationGQL = `mutation deleteTag($id: String) {
  deleteTag(id: $id)
}`

export { tagsQueryGQL, updateTagMutationGQL, deleteTagMutationGQL }
