import type { ChartSeriesGlucose, DBoardItem, FetchOptions } from '../types';

export const createNightscout = function createNightscout() {
  let nightscout = $state('butts');
  let tempoId: number | NodeJS.Timeout | null;

  async function loadNightscout(): Promise<void> {
    const requestOptions: FetchOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    await fetch('/api/v1/nightscout', requestOptions)
      .then(function (res) {
        return res.json();
      })
      .then((json) => {
        nightscout = json.nightscout.items.series;
        // console.log('🚀 ~ .then ~ json:', json);
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  function setTempo(time: number) {
    if (tempoId) {
      clearInterval(tempoId);
    }
    tempoId = setInterval(function () {
      // console.log('nightscouting');
      loadNightscout();
    }, time);
  }

  return {
    get data() {
      // console.log('🚀 ~ getdata ~ nightscout:', nightscout);
      return nightscout?.data | null;
    },
    get items() {
      return nightscout?.items | null;
    },
    loadNightscout,
    setTempo,
  };
};

export const nightscout = createNightscout();
