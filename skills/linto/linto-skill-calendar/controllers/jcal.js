const debug = require('debug')('linto:skill:v2:linto-skill:calendar:controllers:jcal')
const uuidv1 = require('uuid/v1')
const ical = require('ical.js')

module.exports = function (host, event, mail) {
  let iCalendarData = [
    'BEGIN:VCALENDAR',
    'BEGIN:VEVENT',
    'UID:' + uuidv1(),
    'CLASS:PUBLIC',
    'TRANSP:OPAQUE'
  ]
  let dateStart = new Date(event.date)
  let dateEnd = new Date(event.date)
  dateEnd = new Date(dateEnd.setHours(dateEnd.getHours() + 1))

  iCalendarData.push('DTSTART;TZID=Europe/Berlin:' + formatDate(dateStart))
  iCalendarData.push('DTEND;TZID=Europe/Berlin:' + formatDate(dateEnd))
  iCalendarData.push('SUMMARY:' + event.title)
  iCalendarData.push('ORGANIZER:mailto:' + mail)

  if (event.isVisio) {
    iCalendarData.push('X-OPENPAAS-VIDEOCONFERENCE:' + host + '/videoconf/' + uuidv1())
  } else {
    iCalendarData.push('LOCATION:' + event.location)
  }
  if (event.attendee) {
    for (let attendee of event.attendee) {
      iCalendarData.push('ATTENDEE:mailto:' + attendee)
    }
  }
  // iCalendarData.push('ATTENDEE:mailto:' + mail)

  iCalendarData.push('END:VEVENT')
  iCalendarData.push('END:VCALENDAR')
  iCalendarData = iCalendarData.join('\r\n')
  const jcalData = ical.parse(iCalendarData)

  return jcalData
}

function formatDate(date) {
  let formatedDate = (date.toISOString().replace(/-/g, '').replace(/:/g, '').split('.')[0])
  return formatedDate
}