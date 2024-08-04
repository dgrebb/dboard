<script lang="ts">
  import type { DebugData } from '@types';
  import './debugger.css';

  interface Props {
    debugData: DebugData;
    title: string;
  }

  let { debugData, title }: Props = $props();

  // Create a store to keep track of the expanded state of each node
  let expanded = $state<Record<string, boolean>>({ root: false });

  function toggleDebugDetail(key: string) {
    expanded = { ...expanded, [key]: !expanded[key] };
  }

  function isObject(value: unknown) {
    return typeof value === 'object' && value !== null;
  }

  function isExpandable(value: unknown) {
    return Array.isArray(value) || isObject(value);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<h1 onclick={() => toggleDebugDetail('root')} class="toggle">
  {title}
  {#if expanded['root']}▼{:else}▶{/if}
</h1>

{#if expanded['root']}
  <ul>
    {#each Object.entries(debugData) as [key, value]}
      <li>
        {#if isObject(value)}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div class="toggle" onclick={() => toggleDebugDetail(key)}>
            {key}
            {#if expanded[key]}▼{:else}▶{/if}
          </div>
          {#if expanded[key]}
            <ul>
              {#each Object.entries(value) as [nestedKey, nestedValue]}
                <li>
                  {#if isExpandable(nestedValue)}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                      class="toggle"
                      onclick={() => toggleDebugDetail(`${key}.${nestedKey}`)}
                    >
                      {nestedKey}
                      {#if expanded[`${key}.${nestedKey}`]}▼{:else}▶{/if}
                    </div>
                    {#if expanded[`${key}.${nestedKey}`]}
                      <ul>
                        {#each Object.entries(nestedValue) as [subKey, subValue]}
                          <li>
                            {subKey}: {JSON.stringify(subValue)}
                          </li>
                        {/each}
                      </ul>
                    {/if}
                  {:else}
                    {nestedKey}: {JSON.stringify(nestedValue)}
                  {/if}
                </li>
              {/each}
            </ul>
          {/if}
        {:else}
          {key}: {JSON.stringify(value)}
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  .toggle {
    cursor: pointer;
  }
  ul {
    padding-left: 20px;
    list-style-type: none;
  }
  li {
    margin: 4px 0;
  }
</style>
