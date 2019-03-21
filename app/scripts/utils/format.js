'use strict'
export const nope = '--'
export function n (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function reportTitle (report) {
  return `${cap(report['report_type'])}: ${report.name}`
}

export function cap (string) {
  return string.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1, s.length).toLowerCase())
    .join(' ')
}
