'use strict'
export const now = new Date()
export const recent = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30)
