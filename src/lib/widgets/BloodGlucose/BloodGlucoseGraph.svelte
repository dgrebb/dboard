<script lang="ts">
  import * as echarts from 'echarts';
  import { onMount } from 'svelte';
  import type { EChartOption } from 'echarts';
  import type { ChartSeriesGlucose } from '$lib/types';

  export let data: number[] = [];
  export let mainColor: string = '#fefefe';
  export let areaColor: string = mainColor.toString();
  let maxMeasurable: number = 400;

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
        max: maxMeasurable,
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
          data,
          type: 'line',
          lineStyle: {
            color: mainColor,
            opacity: 0.3,
          },
          itemStyle: {
            show: false,
            opacity: 0,
          },
          areaStyle: {
            color: areaColor,
            opacity: 0.3,
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
