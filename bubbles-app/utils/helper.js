// Miscellaneous helper functions

export const dateToTimestamp = (date, time) => {
  const scheduleDate = new Date(date);
  scheduleDate.setHours(time.getHours());
  scheduleDate.setMinutes(time.getMinutes());
  scheduleDate.setSeconds(0);
  scheduleDate.setMilliseconds(0);

  return scheduleDate;
};
