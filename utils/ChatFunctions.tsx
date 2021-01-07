export function GetRoomTitleShort(title: string) {
  if (title.length > 25) return title.substring(0, 25) + '...'
  else return title
}

export function GetMessageShort(comment: string) {
  if (comment.length > 35) return comment.substring(0, 34) + '...'
  else return comment
}

export function GetPublishedDate(dt: Date) {
  let now = new Date()
  let secondByMs = 1000
  let minuteByMs = 60 * secondByMs
  let hourByMs = 60 * minuteByMs

  let duration = (now.getTime() - dt.getTime()) / hourByMs
  let hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()
  let mins = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes()
  let oclock = hours + 'h' + mins
  if (duration < 24) return `Aujourd'hui, à ${oclock}`
  else if (24 <= duration && duration < 48) return `Hier, à ${oclock}`
  else {
    let weekdays = [
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
      'Dimanche',
    ]
    let months = [
      'Jan',
      'Fev',
      'Mars',
      'Avr',
      'Mai',
      'Juin',
      'Jui',
      'Aout',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    let weekday = weekdays[dt.getDay()]
    let day = dt.getDate()
    let month = months[dt.getMonth()]
    let year =
      now.getFullYear() === dt.getFullYear() ? '' : ' ' + dt.getFullYear()
    return `${weekday} ${day} ${month}${year}, à ${oclock}`
  }
}

export const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
