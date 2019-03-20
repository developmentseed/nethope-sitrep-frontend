'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { stringify } from 'qs'
import _groupBy from 'lodash.groupby'
import { get } from 'object-path'

import { getReports, getFeaturedEmergencies, getEmergencies } from '../actions'
import { lastWeek } from '../utils/timespans'
import { getCentroid } from '../utils/centroids'

import AsyncStatus from '../components/async-status'
import Map from '../components/map'
import EmergencyList from '../components/emergency-list'

function geojsonPoint (coordinates, properties) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates
    },
    properties
  }
}

function geojsonFeatureCollection (features) {
  return {
    type: 'FeatureCollection',
    features
  }
}

const notebookIconSrc = 'https://raw.githubusercontent.com/developmentseed/nethope-sitrep-frontend/develop/app/graphics/content/icon-notebook.png'

class Emergencies extends React.Component {
  componentDidMount () {
    if (!this.props.featured.length) {
      this.props.getFeaturedEmergencies()
    }
    if (this.props.qs && !this.props.emergencies) {
      this.props.getEmergencies({ qs: this.props.qs })
    }

    // TODO this should use a query that limits the responses
    // to just those created in the last week.
    this.props.getReports()
  }

  componentDidUpdate () {
    if (this.props.qs && !this.props.emergencies) {
      this.props.getEmergencies({ qs: this.props.qs })
    }
  }

  getMapAssets () {
    const { reports, featuredEmergencies, countries } = this.props
    if (!reports.length || !featuredEmergencies.length) {
      return { sources: null, layers: null }
    }
    const reportGroups = _groupBy(reports.filter(d => d.country), 'country')
    const reportLocations = Object.values(reportGroups).map(group => {
      let country = countries[group[0].country]
      let coordinates = getCentroid(country.iso)
      let properties = {
        reportIDs: group.map(d => d.id).join(','),
        numReports: group.length
      }
      return geojsonPoint(coordinates, properties)
    })

    const emergencyGroups = _groupBy(featuredEmergencies.filter(d => get(d, 'countries.0.iso')), 'countries.0.iso')
    const emergencyLocations = Object.values(emergencyGroups).map(group => {
      let coordinates = getCentroid(group[0].countries[0].iso)
      let properties = {
        emergencyIDs: group.map(d => d.id).join(','),
        numEmergencies: group.length
      }
      return geojsonPoint(coordinates, properties)
    })

    const sources = {
      'notebook-centroids': {
        type: 'geojson',
        data: geojsonFeatureCollection(reportLocations)
      },
      'emergency-centroids': {
        type: 'geojson',
        data: geojsonFeatureCollection(emergencyLocations)
      }
    }

    const markerLayer = {
      dependencies: {
        image: notebookIconSrc,
        key: 'notebook'
      },
      layer: {
        id: 'notebook-marker-layer',
        type: 'symbol',
        source: 'notebook-centroids',
        layout: {
          'icon-image': 'notebook',
          'icon-size': 0.4,
          'icon-allow-overlap': true
        },
        paint: {
          'icon-opacity': 0.85
        }
      }
    }

    const circleLayer = {
      layer: {
        id: 'emergency-circle-layer',
        type: 'circle',
        source: 'emergency-centroids',
        layout: {
        },
        paint: {
          'circle-radius': 7,
          'circle-color': '#ff8308',
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-opacity': 0.4,
          'circle-stroke-width': 1
        }
      }
    }

    const layers = [markerLayer, circleLayer]
    return { sources, layers }
  }

  render () {
    const { emergencies } = this.props
    const { sources, layers } = this.getMapAssets()
    return (
      <div className='page page__ees'>
        <div className='page__header'>
          <div className='inner'>
            <h2 className='page__title'>Active Emergencies</h2>
          </div>
        </div>
        <Map layers={layers} sources={sources}>
          <div className='inner map__legend__cont'>
            <ul className='map__legend'>
              <li className='map__legend__item'>
                <span className='legend__figure'><img src={notebookIconSrc} /></span> Recent report
              </li>
              <li className='map__legend__item'>
                <span className='legend__figure legend__figure__circle legend__figure__circle--orange' /> Featured emergency
              </li>
            </ul>
          </div>
        </Map>
        <div className='section'>
          <div className='inner'>
            <AsyncStatus />
            { emergencies && <EmergencyList data={emergencies.data} title='Recent Emergencies' showCountry={true} /> }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { countries, featured } = state
  const qs = featured.length ? stringify({
    id__in: featured.join(','),
    limit: 100
  }) : null

  const emergencies = state.emergencies[qs]
  const featuredEmergencies = emergencies && Array.isArray(emergencies.data) &&
    emergencies.data.filter(d => featured.indexOf(d.id) >= 0)

  const timespan = lastWeek.getTime()
  const reports = state.reports.filter(d => d['created_at'] >= timespan)

  return {
    countries,
    featured,
    qs,
    emergencies,
    reports,
    featuredEmergencies: featuredEmergencies || []
  }
}

const mapDispatch = { getReports, getFeaturedEmergencies, getEmergencies }

export default connect(mapStateToProps, mapDispatch)(Emergencies)
