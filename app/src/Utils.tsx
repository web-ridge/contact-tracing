//getAnonymizedTimestamp removes hours seconds and milli seconds so only date is left
// this is more anonymous since nobody can possible prove that you met someone on that specific time
// only the date
export function getAnonymizedTimestamp(): number {
  let date = new Date()
  date.setHours(0, 0, 0, 0) // remove hours, minutes, seconds and miliseconds to anonomize timestamp
  return dateToUnix(date)
}

const twoWeeksInJavascript = 12096e5

export function getStartOfRiskUnix(): number {
  const date = new Date(Date.now() - twoWeeksInJavascript)
  date.setHours(0, 0, 0, 0) // remove hours, minutes, seconds and miliseconds to anonomize timestamp
  return dateToUnix(date)
}

// dateToUnix ..
export function dateToUnix(date: Date): number {
  return Math.round(date.getTime() / 1000)
}
