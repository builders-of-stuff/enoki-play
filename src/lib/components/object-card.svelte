<script lang="ts">
  import type { SuiObjectData } from '@mysten/sui/client';

  interface Props {
    object: SuiObjectData;
    selectedObjectId: string | null;
    onSelectObject: (objectId: string) => void;
  }

  let { object, selectedObjectId, onSelectObject }: Props = $props();

  const isSelected = $derived(selectedObjectId === object.objectId);

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
  class="w-full border rounded-lg bg-card p-6 space-y-4 cursor-pointer transition-all hover:shadow-md {isSelected ? 'border-primary bg-primary/5' : 'border-border'}"
  onclick={() => onSelectObject(object.objectId)}
>
  <!-- Header Row -->
  <div class="flex items-center justify-between border-b border-border pb-3">
    <div class="flex items-center gap-4">
      <span class="text-sm font-medium text-card-foreground">Object</span>
      <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
        {getObjectType(object.type)}
      </span>
      {#if isSelected}
        <span class="text-xs bg-green-500/20 text-green-700 px-2 py-1 rounded font-medium">
          Selected
        </span>
      {/if}
    </div>
  </div>

  <!-- Object ID Row -->
  <div class="flex items-center gap-4">
    <div class="w-20 text-xs font-medium text-muted-foreground uppercase tracking-wide">
      Object ID
    </div>
    <div class="flex items-center gap-3 flex-1">
      <div class="flex-1 bg-muted/30 p-3 rounded font-mono text-sm break-all">
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
          <div class="w-20 text-xs font-medium text-muted-foreground uppercase tracking-wide pt-3">
            {key}
          </div>
          <div class="flex-1 bg-muted/30 p-3 rounded font-mono text-sm break-words">
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
