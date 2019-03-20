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

function extractMarkdownImageFromString (markdown) {
  const regex = /(?:!\[(.*?)\]\((.*?)\))/g
  const result = regex.exec(markdown)
  return result && result[2]
}

export function getReportLeadImage (report) {
  const cells = get(report, 'content.cells', [])
  // special handling for reports we've created in this platform.
  // TODO this might not make sense when report creation UI gets better.
  if (cells.length === 2 && cells[1]['cell_type'] === 'markdown') {
    const imageUri = extractMarkdownImageFromString(cells[1].source[0])
    return imageUri && { imageUri }
  } else {
    for (let i = cells.length - 1; i >= 0; i -= 1) {
      let c = cells[i]
      if (!Array.isArray(c.outputs)) { continue }
      let imageOutput = c.outputs.find(getImageFromOutput)
      if (imageOutput) {
        return getImageFromOutput(imageOutput)
      }
    }
  }
}

export function getAuthorFromEmail (email) {
  let split = email.split('@')
  return split[0] || 'Author'
}
