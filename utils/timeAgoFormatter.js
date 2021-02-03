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

  let dayAfterOrBefore = new Date()
  
  let isFuture = false;

  let diffMs = (today - date); 
  
  if(diffMs < 0){
  	isFuture = true
    dayAfterOrBefore.setDate(dayAfterOrBefore.getDate() + 1);
    diffMs = Math.abs(diffMs)
  }else{
  	isFuture = false
  	dayAfterOrBefore.setDate(dayAfterOrBefore.getDate() - 1);
  }

  
  let diffHrs = Math.floor((diffMs % 86400000) / 3600000) // hours
  let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000) // minutes

  

  if(date.getFullYear() === today.getFullYear()){
    if(date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && 
    date.getFullYear() === today.getFullYear()){//today
    	if(diffHrs === 0){//within hour
      	return `${isFuture ? 'dans' : 'il y a'} ${diffMins}m`
      }else{
      	return `${isFuture ? 'dans' : 'il y a'} ${diffHrs}h`
      }
    }else if(date.getDate() === dayAfterOrBefore.getDate()){//yesterday or tomorrow 
    	return `${isFuture ? 'demain' : 'hier'}, à ${fillZero(date.getHours())}:${fillZero			(date.getMinutes())}`
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