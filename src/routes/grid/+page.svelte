<script lang="ts">
  import { DEFAULT_TEMPO, LATITUDE, LONGITUDE } from '../../.config/GLOBALS';
  import Main from '../(layouts)/Main.svelte';
  import Grid from 'svelte-grid';
  import gridHelp from 'svelte-grid/build/helper/index.mjs';
  import { pullToRefresh } from '$lib/actions/pullToRefresh';
  import ForegroundFrame from '$lib/components/Board/ForegroundFrame.svelte';
  import BackgroundFrame from '$lib/components/Board/BackgroundFrame.svelte';
  import ClearOrCloudy from '$lib/components/Board/Backgrounds/ClearOrCloudy.svelte';
  import updateBackgroundColorGradient from '$lib/layout/background';
  import { onMount } from 'svelte';

  const COLS = 12;

  const id = () => '_' + Math.random().toString(36).substr(2, 12);

  const randomNumberInRange = (min, max) => Math.random() * (max - min) + min;

  let items = [
    {
      [COLS]: gridHelp.item({
        x: 0,
        y: 0,
        w: 2,
        h: 2,
      }),
      id: id(),
    },

    {
      [COLS]: gridHelp.item({
        x: 2,
        y: 0,
        w: 2,
        h: 2,
      }),
      id: id(),
    },
  ];

  const cols = [[1080, 12]];

  function add() {
    let newItem = {
      12: gridHelp.item({
        w: Math.round(randomNumberInRange(1, 4)),
        h: Math.round(randomNumberInRange(1, 4)),
        x: 0,
        y: 0,
      }),
      id: id(),
    };

    let findOutPosition = gridHelp.findSpace(newItem, items, COLS);

    newItem = {
      ...newItem,
      [COLS]: {
        ...newItem[COLS],
        ...findOutPosition,
      },
    };

    items = [...items, ...[newItem]];
  }

  const addAt = () => {
    let newItem = {
      12: gridHelp.item({
        w: Math.round(randomNumberInRange(1, 4)),
        h: Math.round(randomNumberInRange(1, 4)),
        x: 0,
        y: 0,
      }),
      id: id(),
    };

    items = [...[newItem], ...items];

    items = gridHelp.normalize(items, COLS);
  };

  const remove = (item) => {
    items = items.filter((value) => value.id !== item.id);

    if (adjustAfterRemove) {
      items = gridHelp.adjust(items, COLS);
    }
  };

  let adjustAfterRemove = false;

  onMount(async () => {
    updateBackgroundColorGradient(LATITUDE, LONGITUDE);
  });
</script>

<ForegroundFrame />
<BackgroundFrame component={ClearOrCloudy} />
<main class="dboard">
  <div class="grid-container">
    <button on:click={add}>Add (random size)</button>
    <button on:click={addAt}>Add random (x=0,y=0)</button>
    <label>
      <input type="checkbox" bind:checked={adjustAfterRemove} />
      Adjust elements after removing an item
    </label>
    <Grid
      bind:items
      rowHeight={111}
      let:item
      let:dataItem
      {cols}
      gap={[11, 11]}
    >
      <div class="grid-widget">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span
          on:pointerdown={(e) => e.stopPropagation()}
          on:click={() => remove(dataItem)}
          class="remove"
        >
          ✕
        </span>
        <div class="relative bg-transparent">
          <h2>Smol label</h2>
          <h1>big name</h1>
        </div>
      </div>
    </Grid>
  </div>
</main>

<style>
  .dboard {
    padding: 11px;
  }
  .grid-widget {
    background: #f1f1f1;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .grid-container {
    width: 100%;
  }

  .remove {
    cursor: pointer;
    position: absolute;
    right: 5px;
    top: 3px;
    user-select: none;
  }
</style>
