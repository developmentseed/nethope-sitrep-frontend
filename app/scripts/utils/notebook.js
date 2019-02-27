'use strict'
import { get } from 'object-path'

const imgMimes = [ 'image/jpeg', 'image/png' ]
const imgTypes = [ 'jpeg', 'png' ]

// https://nbformat.readthedocs.io/en/latest/format_description.html#display-data
export function getImageFromOutput (output) {
  if (!output || output['output_type'] !== 'display_data') {
    return false
  }
  for (let i = 0; i < imgTypes.length; ++i) {
    if (output.hasOwnProperty(imgTypes[i])) {
      return { dataUri: output[imgTypes[i]], mime: imgMimes[i] }
    }
  }
  if (output.hasOwnProperty('data')) {
    for (let i = 0; i < imgMimes.length; ++i) {
      if (output.data.hasOwnProperty(imgMimes[i])) {
        return { dataUri: output.data[imgMimes[i]], mime: imgMimes[i] }
      }
    }
  }
  return false
}

export function getFirstImageOutput (report) {
  const cells = get(report, 'content.cells', [])
  for (let i = 0; i < cells.length; ++i) {
    let c = cells[i]
    if (!Array.isArray(c.outputs)) { continue }
    let imageOutput = c.outputs.find(getImageFromOutput)
    if (imageOutput) {
      return getImageFromOutput(imageOutput)
    }
  }
}

export function getAuthorFromEmail (email) {
  let split = email.split('@')
  return split[0] || 'Author'
}
