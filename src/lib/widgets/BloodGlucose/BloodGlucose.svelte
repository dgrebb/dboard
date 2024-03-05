<script lang="ts">
  import * as echarts from 'echarts';
  import { onMount } from 'svelte';
  import type { EChartOption } from 'echarts';

  // Draw the chart

  onMount(() => {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom, 'dark');
    var option: EChartOption;

    option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
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
