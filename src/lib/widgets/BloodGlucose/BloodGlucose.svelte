<script lang="ts">
  import * as echarts from 'echarts';
  import { onMount } from 'svelte';
  import type { EChartOption } from 'echarts';

  export let series: {};

  function extractBGValues(data) {
    return data.map((item) => item.sgv);
  }

  onMount(() => {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom, 'dark');
    var option: EChartOption;

    option = {
      xAxis: {
        type: 'category',
        axisLabel: {
          show: false,
        },
        data: [
          '55m',
          '50m',
          '45m',
          '40m',
          '35m',
          '30m',
          '25m',
          '20m',
          '15m',
          '10m',
          '5m',
        ],
      },
      yAxis: {
        max: '400',
        type: 'value',
        axisLabel: {
          show: false,
        },
      },
      grid: {
        show: false,
      },
      series: [
        {
          data: extractBGValues(series).reverse(),
          type: 'line',
        },
      ],
      backgroundColor: 'transparent',
    };

    option && myChart.setOption(option);

    window.addEventListener('resize', function () {
      myChart.resize();
    });
  });
</script>

<div class="graph-container">
  <div id="main" class="bg-graph" style="width: 100%; height: 100%;"></div>
</div>

<style>
  .graph-container {
    height: 11rem;
    width: 100%;
    z-index: 1;
    position: relative;
    flex-grow: 1;
    display: flex;
    align-items: center;
    height: 100%;
  }
  .bg-graph {
    width: 100%;
    min-height: 100%;
    & canvas {
      height: 100%;
      width: 100%;
      padding: 0;
      margin: 0;
    }
  }
</style>
