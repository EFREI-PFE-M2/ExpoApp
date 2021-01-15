const MONTHS = ['janvier','février','mars','avril','mai','juin','juillet','août',
'septembre','octobre','novembre','décembre']


/**
 * Returns formatted time difference between today and param time
 * @param {string} date
 * @returns {string} time difference 
 */
export default function timeAgoFormat(date){
 
  date = new Date(date)
  let today = new Date()

  let yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1);

  let diffMs = (today - date); 
  let diffHrs = Math.floor((diffMs % 86400000) / 3600000) // hours
  let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000) // minutes

  

  if(date.getFullYear() === today.getFullYear()){
    if(date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && 
    date.getFullYear() === today.getFullYear()){//today
    	if(diffHrs === 0){//within hour
      	return `${diffMins}m`
      }else{
      	return `${diffHrs}h`
      }
    }else if(date.getDate() === yesterday.getDate()){//yesterday
    	return `Hier, à ${fillZero(date.getHours())}:${fillZero(date.getMinutes())}`
    }else{
    	return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${fillZero(date.getHours())}:${fillZero(date.getMinutes())}`
    }
  }else{
		return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${fillZero(date.getHours())}:${fillZero(date.getMinutes())}`
  }
}

/**
 * Fills a zero if single digit number for date string
 * @param {number} date
 * @returns {string} formatted number
 */
function fillZero(value){
	return value < 10 ? `0${value}` : value
}