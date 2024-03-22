<script lang="ts">
  import * as echarts from 'echarts';
  import { onMount } from 'svelte';
  import type { EChartOption } from 'echarts';

  export let series: { sgv: number }[];

  function extractBGValues(data: { sgv: number }[]) {
    return data.map((item) => item.sgv);
  }

  onMount(() => {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom, 'dark');
    var option: EChartOption;
    var BGSeries = extractBGValues(series).reverse();
    var maxMeasurable = 400;
    var maxSeries = Math.max(...BGSeries);
    var max = 400;
    var areaColor = '#fefefe';

    switch (true) {
      case maxSeries < 70:
        areaColor = '#ff0000';
        max = 100;
        break;
      case maxSeries < 100:
        max = 100;
        areaColor = '#2a5c2c';
        break;
      case maxSeries < 160:
        areaColor = '#2a5c2c';
        max = 200;
        break;
      case maxSeries < 190:
        areaColor = '#6c8246';
        max = 200;
        break;
      case maxSeries < 300:
        areaColor = '#fff700';
        max = 300;
        break;

      default:
        max = 400;
        areaColor = '#ff00f7';
        break;
    }

    option = {
      grid: {
        left: '0',
        right: '0',
        top: 0,
        bottom: 0,
        show: false,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        show: false,
        axisLabel: {
          show: false,
          inside: true,
        },
      },
      yAxis: {
        max,
        type: 'value',
        show: false,
        boundaryGap: false,
        axisLabel: {
          show: false,
          inside: true,
        },
      },
      series: [
        {
          data: BGSeries,
          type: 'line',
          lineStyle: {
            color: '#8c0808',
          },
          itemStyle: {
            color: 'rgba(143, 143, 143,0.5)',
          },
          areaStyle: {
            color: areaColor,
            opacity: 0.5,
          },
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
  <div
    id="main"
    class="bg-graph"
    style="width: 100%; height: 100%; min-height: 100%;"
  ></div>
</div>

<style>
  .graph-container {
    width: 100%;
    z-index: 1;
    position: absolute;
    height: 100%;
    min-height: 100%;
    inset: 0;
  }
  .bg-graph {
    width: 100%;
    min-height: 100%;
    height: 100%;
    position: absolute;
    box-sizing: border-box;
    inset: 0;
    & canvas {
      padding: 0;
      margin: 0;
      inset: 0;
      position: absolute;
      min-height: 100%;
      height: 100%;
    }
  }
</style>
