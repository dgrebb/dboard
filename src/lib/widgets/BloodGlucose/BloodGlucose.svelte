<script>
  import * as echarts from 'echarts';
  import { onMount } from 'svelte';

  // Draw the chart

  onMount(() => {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom, 'dark');
    var option;

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
    };

    option && myChart.setOption(option);
  });
</script>

<div class="graph-container">
  <div id="main" class="bg-graph" style="width: 100%; height: 100%;"></div>
  <p>chart</p>
</div>

<style>
  .graph-container {
    height: 7rem;
    width: 100%;
    z-index: 1;
    position: relative;
  }
  .bg-graph {
    width: 100%;
    min-height: 100%;
  }
</style>
