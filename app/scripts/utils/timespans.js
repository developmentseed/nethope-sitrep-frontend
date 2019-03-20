'use strict'
import { stringify } from 'qs'

export const now = new Date()
export const recent = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30)

// Shortcut to export a QS for emergency queries
export const recentQs = stringify({
  disaster_start_date__gt: recent,
  ordering: '-disaster_start_date',
  limit: 100
})
