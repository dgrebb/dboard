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
      grid: {
        left: '0',
        right: '0',
        top: 0,
        bottom: 0,
        show: false,
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          show: false,
        },
      },
      yAxis: {
        max: '300',
        type: 'value',
        axisLabel: {
          show: false,
        },
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
    height: 100%;
    width: 100%;
    z-index: 1;
    position: relative;
    flex-grow: 1;
    display: flex;
    /* align-items: center; */
    height: 100%;
  }
  .bg-graph {
    width: 100%;
    min-height: 200px;
    box-sizing: border-box;
    inset: 0;
    & canvas {
      padding: 0;
      margin: 0;
      inset: 0;
      position: absolute;
    }
  }
</style>
