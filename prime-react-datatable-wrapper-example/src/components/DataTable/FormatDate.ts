import { format, differenceInDays, isSameMonth, isSameYear, isThisYear } from 'date-fns'

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  };
  return date.toLocaleDateString('en-US', options);
};

export const formatTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleTimeString('en-US', options);
};

export const formatDateTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleString('en-US', options);
};

export const formatEventDateRange = (start: Date, end: Date): string => {
  const sameMonth = isSameMonth(start, end)
  const sameYear = isSameYear(start, end)
  const bothThisYear = isThisYear(start) && isThisYear(end)

  if (sameMonth && sameYear) {
    // Format: "Jan 25-26 '25" (if not this year)
    // or "Jan 25-26" (if this year)
    return `${format(start, 'MMM')} ${format(start, 'd')}-${format(end, 'd')}${
      bothThisYear ? '' : format(start, " ''yy")
    }`
  } else {
    // Format: "Jan 25 - Feb 26 '25" (if not this year)
    // or "Jan 25 - Feb 26" (if this year)
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}${
      bothThisYear ? '' : format(start, " ''yy")
    }`
  }
};

export const getDaysLeft = (end: Date): string => {
  const daysLeft = differenceInDays(end, new Date())
  if (daysLeft < 0) return "time expired"
  if (daysLeft === 0) return "last day!"
  return `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`
};
