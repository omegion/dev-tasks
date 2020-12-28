import * as moment from 'moment'

import Vue from 'vue'

Vue.filter('humanize', value => {
  if (value) {
    return moment(String(value)).fromNow()
  }
})

Vue.filter('trim', (text, max) => {
  if (text) {
    return text.substr(0, max - 1) + (text.length > max ? '...' : '')
  }
})

Vue.filter('formatDate', value => {
  if (value) {
    return moment(String(value)).format('DD MMM YYYY')
  }
})

Vue.filter('formatDateTime', value => {
  if (value) {
    return moment(String(value)).format('DD MMM YYYY, hh:mm A')
  }
})
