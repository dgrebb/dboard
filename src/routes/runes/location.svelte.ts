// export type Weather = {
//   apparent_temperature: number;
//   weather_code?: number;
//   cloud_cover?: number;
// };

// export type Time = {
//   seconds: number;
//   is_day: number;
//   sunrise: number;
//   sunset: number;
//   hours?: number;
//   minutes?: number;
//   totalMinutes?: number;
//   totalSeconds?: number;
// };

// interface Location {
//   weather: Weather;
//   time: Time;
// }

// export default function createLocation(initial: Location) {
//   let weather = $state(initial.weather);
//   let time = $state(initial.time);
//   return {
//     ...initial,

//     get weather() {
//       return weather;
//     },

//     set weather(data) {
//       weather = data;
//     },

//     set time(newTime: Time) {
//       time = newTime;
//     },

//     get time() {
//       return time;
//     },
//   };
// }

// function createCounter() {
//   let count = $state(0);

//   function increment() {
//     count += 1;
//   }

//   return {
//     get count() {
//       return count;
//     },
//     increment,
//   };
// }

// export const counter = createCounter();

// // TODO: createTime

// // TODO: createMusic
