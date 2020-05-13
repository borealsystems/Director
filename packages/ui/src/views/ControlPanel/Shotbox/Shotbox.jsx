import React from 'react'
import { useQuery, useMutation } from 'urql'
import { Button, Grid, Row, Column, Loading, ToastNotification } from 'carbon-components-react'

const arrayChunk = (array, chunkSize) => {
  var R = []
  for (var i = 0; i < array.length; i += chunkSize) { R.push(array.slice(i, i + chunkSize)) }
  return R
}

const padRowTo4 = (row) => {
  var padding = []
  var padsToAdd = 4 - row.length
  for (var i = 0; i < padsToAdd; i++) {
    padding.push({ padding: true })
  }
  return row.concat(padding)
}

const Shotbox = () => {
  const [result] = useQuery({
    query: `query getStacks {
      getStacks {
        id
        name
        description
      }
    }`,
    pollInterval: 1000
  })

  const executeStackMutationGQL = `mutation executeStack($executeID: String) {
    executeStack(id: $executeID)
  }`

  // eslint-disable-next-line no-unused-vars
  var [executeStackMutationResult, executeStackMutation] = useMutation(executeStackMutationGQL)

  if (result.error) {
    return (
      <ToastNotification
        caption={result.error.message}
        hideCloseButton={true}
        kind="error"
        lowContrast
        notificationType="toast"
        role="alert"
        style={{
          marginBottom: '.5rem',
          minWidth: '30rem'
        }}
        subtitle="The Director UI cannot communicate with the server or the server encountered an error. Please check your network connection then contact your system administrator."
        timeout={0}
        title="GraphQL Error"
      />
    )
  }
  if (result.fetching) return <Loading />
  if (result.data) {
    return (
      <div>
        <h1
          style={{
            margin: '0 0 32px 0'
          }}
        >
          Shotbox
        </h1>
        <Grid condensed>
          { arrayChunk(result.data.getStacks, 4).map((row, rowIndex) => {
            return (
              <React.Fragment key={rowIndex}>
                <Row className="bx--text-input__field-wrapper">
                  { padRowTo4(row).map((item, itemIndex) => {
                    return (
                      <Column className="bx--button__field-wrapper" key={itemIndex}>
                        { item.id &&
                          <Button onClick={() => { executeStackMutation({ executeID: item.id }) }} style={{ width: '20.7em', height: '5em' }} size='default' kind="primary">
                            <>
                              <h4>{item.name}</h4>
                              <br></br>
                              <p>{item.description}</p>
                            </>
                          </Button>
                        }
                        { !item.id &&
                          <Button disabled style={{ width: '20.7em' }} size='default' kind="primary">
                            {item.name}
                          </Button>
                        }
                      </Column>
                    )
                  })
                  }
                </Row>
                {/* <br /> */}
              </React.Fragment>
            )
          })}
        </Grid>
      </div>
    )
  }
}

export default Shotbox
