<script lang="ts">
  import * as echarts from 'echarts';
  import { onMount } from 'svelte';
  import type { EChartsOption } from 'echarts';

  interface Props {
    series: number[];
    mainColor: string;
    backgroundColor: string;
    maxMeasurable: number;
  }

  let { maxMeasurable, series, backgroundColor }: Props = $props();

  let nightScoutGraph: echarts.ECharts;

  let option: EChartsOption = $derived({
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

    if (option) {
      nightScoutGraph.setOption(option);
    }

    window.addEventListener('resize', function () {
      nightScoutGraph.resize();
    });
  });

  $effect(() => {
    return () => {
      nightScoutGraph.setOption(option);
    };
  });
</script>

<div class="graph-container">
  <div
    id="main"
    class="bg-graph"
    style="width: 100%; height: 100%; min-height: 100%;"
  ></div>
</div>
