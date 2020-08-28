import React from 'react'
import { UnorderedList, ListItem, Link } from 'carbon-components-react'

const Contributers = () => {
  return (
    <div>
      <h1>Contributers And Supporters</h1>
      <p>Huge thank you to all the contributers and supporters who help make this project a reality.</p>
      <br/><br/>
      <h4>Contributers</h4>
      <p>These people have put in the time and effort to design and develop Director:</p>
      <UnorderedList>
        <ListItem>Oliver Herrmann <Link href='github.com/monoxane/'>@monoxane</Link></ListItem>
        <ListItem>Mark Amber</ListItem>
      </UnorderedList>
      <br/><br/>
      <h4>Gold Supporters</h4>
      <p>These people put $25 a month towards making this a reality:</p>
      <UnorderedList>
        <ListItem>Davis M (Since 2020-08-28</ListItem>
      </UnorderedList>
    </div>
  )
}

export default Contributers
