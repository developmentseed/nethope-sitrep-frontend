'use strict'
import React from 'react'
import mapboxgl from 'mapbox-gl'

import { mbtoken } from '../config'

mapboxgl.accessToken = mbtoken
function map (container) {
  const map = new mapboxgl.Map({
    container: container,
    style: 'mapbox://styles/go-ifrc/cjkdzcum95m7l2sqgo3i7cv4q',
    zoom: 1.2,
    center: [0, 25],
    minZoom: 1,
    maxZoom: 6,
    scrollZoom: false,
    pitchWithRotate: false,
    dragRotate: false,
    renderWorldCopies: false,
    attributionControl: false,
    preserveDrawingBuffer: true
  })
  map.addControl(new mapboxgl.NavigationControl(), 'top-right')

  // Disable map rotation using right click + drag.
  map.dragRotate.disable()

  // Disable map rotation using touch rotation gesture.
  map.touchZoomRotate.disableRotation()

  return map
}

const mapStyle = {
  height: '600px'
}

class Map extends React.Component {
  constructor (props) {
    super(props)
    this.container = React.createRef()
    this.renderAssets = () => {
      const { sources, layers } = this.props

      // Load sources
      Object.keys(sources).forEach(key => {
        this.map.addSource(key, sources[key])
      })

      // Add layers, including dependencies
      layers.forEach(({ layer, dependencies }) => {
        if (dependencies) {
          this.map.loadImage(dependencies.image, (e, image) => {
            this.map.addImage(dependencies.key, image)
            this.map.addLayer(layer)
          })
        } else this.map.addLayer(layer)
      })
    }
  }

  componentDidMount () {
    this.map = map(this.container.current)
    this.map.on('load', () => {
      if (this.props.sources && this.props.layers) {
        this.renderAssets()
      }
    })
  }

  componentDidUpdate (prevProps) {
    if (this.props.sources && this.props.layers && !prevProps.sources && !prevProps.layers) {
      this.renderAssets()
    }
  }

  componentWillUnmount () {
    if (this.map) {
      this.map.remove()
    }
  }

  render () {
    return (
      <React.Fragment>
        <div className='map__cont'>
          <div className='map' style={mapStyle} ref={this.container} />
        </div>
        {this.props.children}
      </React.Fragment>
    )
  }
}

export default Map
