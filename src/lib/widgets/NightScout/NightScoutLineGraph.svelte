<script lang="ts">
  import * as echarts from 'echarts';
  import { onMount } from 'svelte';
  import type { EChartOption } from 'echarts';

  type Props = {
    series: number[];
    mainColor: string;
    backgroundColor: string;
    maxMeasurable: number;
  };

  let { maxMeasurable, series, mainColor, backgroundColor }: Props = $props();

  let nightScoutGraph: echarts.ECharts;

  let option: EChartOption = $derived({
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
        data: series,
        type: 'line',
        lineStyle: {
          color: backgroundColor,
          opacity: 0.8,
        },
        itemStyle: {
          show: false,
          opacity: 0,
        },
        areaStyle: {
          color: backgroundColor,
          opacity: 0.5,
        },
      },
    ],
    backgroundColor: 'transparent',
  });

  onMount(() => {
    const renderPoint = document.getElementById('main');

    if (!renderPoint) {
      throw new Error('Render point not found');
    }

    const chartDom = renderPoint as HTMLDivElement | HTMLCanvasElement;
    nightScoutGraph = echarts.init(chartDom, 'dark');

    option && nightScoutGraph.setOption(option);

    window.addEventListener('resize', function () {
      nightScoutGraph.resize();
    });
  });

  $effect(() => {
    nightScoutGraph.setOption(option);
  });
</script>

<!-- svelte-ignore css_unused_selector -->
<div class="graph-container">
  <div
    id="main"
    class="bg-graph"
    style="width: 100%; height: 100%; min-height: 100%;"
  ></div>
</div>
