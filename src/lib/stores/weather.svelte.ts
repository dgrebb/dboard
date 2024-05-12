// export function createWeatherInstance() {
//   let weather = $state({});

//   return {
//     get weather() { return weather },
//     update: (data) => weather = data
//   }
// }

export default function createWeatherInstance(initial) {
  let weather = $state(initial);
  return {
    ...initial,
    get weather() {
      return weather;
    },
    set weather(data) {
      weather = data;
    },
  };
}