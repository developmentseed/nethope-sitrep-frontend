import React from 'react'
import Nav from './nav'
class App extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Nav />
        <main className='main'>
          {this.props.children || null}
        </main>
      </React.Fragment>
    )
  }
}
export default App
