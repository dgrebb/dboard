<script lang="ts">
  import Icon from '@iconify/svelte';

  interface Props {
    loved: boolean;
    size: number;
  }

  let { loved, size = 33 }: Props = $props();

  function bounceIn(node: Node, { delay = 0, duration = 400 } = {}) {
    return {
      delay,
      duration,
      css: (t: number) => {
        const scale = t;
        return `
          transform: scale(${scale});
          opacity: ${t};
        `;
      },
    };
  }

  function bounceOut(node: Node, { delay = 0, duration = 400 } = {}) {
    return {
      delay,
      duration,
      css: (t: number) => {
        const scale = 1 - t;
        return `
          transform: scale(${scale});
          opacity: ${1 - t};
        `;
      },
    };
  }
</script>

{#if loved === true}
  <div class="loved" in:bounceIn out:bounceOut>
    <Icon
      icon="emojione-monotone:heart-decoration"
      width={size}
      height={size}
      class="loved-heart"
    />
  </div>
{/if}
