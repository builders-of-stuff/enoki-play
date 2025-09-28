<script lang="ts">
  import type { SuiObjectData } from '@mysten/sui/client';
  import { enokiState } from '../../routes/enoki-state.svelte';

  interface Props {
    object: SuiObjectData;
  }

  let { object }: Props = $props();

  const isSelected = $derived(enokiState.selectedObjectId === object.objectId);

  function getObjectType(type: string | null | undefined) {
    if (!type) return 'Unknown';
    const parts = type.split('::');
    return parts[parts.length - 1] || type;
  }

  function getContentFields(content: any) {
    if (!content || !content.fields) return {};
    return content.fields;
  }
</script>

<div
  class="w-full cursor-pointer space-y-4 rounded-lg p-6 transition-all {isSelected
    ? 'border-2 border-primary bg-primary/15 shadow-lg shadow-primary/20'
    : 'border border-border bg-card hover:border-primary/50 hover:shadow-md'}"
  onclick={() => enokiState.selectObject(object.objectId)}
  role="button"
  tabindex="0"
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      enokiState.selectObject(object.objectId);
    }
  }}
>
  <!-- Header Row -->
  <div class="flex items-center justify-between border-b border-border pb-3">
    <div class="flex items-center gap-4">
      <span class="text-sm font-medium text-card-foreground">Object</span>
      <span class="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
        {getObjectType(object.type)}
      </span>
      {#if isSelected}
        <span
          class="rounded-full border border-green-700 bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
        >
          ✓ Selected
        </span>
      {/if}
    </div>
  </div>

  <!-- Object ID Row -->
  <div class="flex items-center gap-4">
    <div class="w-20 text-xs font-medium tracking-wide text-muted-foreground uppercase">
      Object ID
    </div>
    <div class="flex flex-1 items-center gap-3">
      <div class="flex-1 rounded bg-muted/30 p-3 font-mono text-sm break-all">
        {object.objectId}
      </div>
      <button
        class="rounded bg-primary/10 px-3 py-2 text-sm text-primary transition-colors hover:bg-primary/20"
        onclick={() => navigator.clipboard.writeText(object.objectId)}
      >
        Copy
      </button>
    </div>
  </div>

  <!-- Content Fields Rows -->
  {#if object.content}
    {@const fields = getContentFields(object.content)}
    {#if Object.keys(fields).length > 0}
      {#each Object.entries(fields) as [key, value]}
        <div class="flex items-start gap-4">
          <div
            class="w-20 pt-3 text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            {key}
          </div>
          <div class="flex-1 rounded bg-muted/30 p-3 font-mono text-sm break-words">
            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
          </div>
        </div>
      {/each}
    {:else}
      <div class="flex items-center gap-4">
        <div class="w-20"></div>
        <div class="text-sm text-muted-foreground italic">No fields available</div>
      </div>
    {/if}
  {:else}
    <div class="flex items-center gap-4">
      <div class="w-20"></div>
      <div class="text-sm text-muted-foreground italic">No content available</div>
    </div>
  {/if}
</div>
