'use strict'
export const nope = '--'
export function n (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
