import React from 'react'
// import nav from './nav'
class App extends React.Component {
  render () {
    return (
      <React.Fragment>
        <main>
          {this.props.children || null}
        </main>
      </React.Fragment>
    )
  }
}
export default App
