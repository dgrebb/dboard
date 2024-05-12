export const setTime = async function setTime(t: Date) {
  const hours = t.getHours();
  const minutes = t.getMinutes();
  const seconds = t.getSeconds();
  const totalMinutes = hours * 60 + minutes;
  const totalSeconds = hours * 60 + minutes * 60 + seconds;
  return {
    seconds,
    is_day: 0,
    sunrise: 238972,
    sunset: 239823,
    hours,
    minutes,
    totalMinutes,
    totalSeconds,
  };
}