<script lang="ts">
  import ObjectCard from '$lib/components/object-card.svelte';
  import type { SuiObjectData } from '@mysten/sui/client';

  interface Props {
    results: string;
    loading: boolean;
    ownedObjects: any;
    selectedObjectId: string | null;
    onSelectObject: (objectId: string) => void;
  }

  let { results, loading, ownedObjects, selectedObjectId, onSelectObject }: Props = $props();
</script>

<div class="rounded-lg border border-border bg-card">
  <div class="border-b border-border p-4">
    <h3 class="text-lg font-medium text-card-foreground">Results</h3>
  </div>
  <div class="p-4">
    {#if loading}
      <div class="flex items-center gap-2 text-muted-foreground">
        <div
          class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        ></div>
        Loading...
      </div>
    {:else if ownedObjects.length > 0}
      <div class="space-y-4">
        <div class="text-sm text-muted-foreground">
          Found {ownedObjects.length} object{ownedObjects.length === 1 ? '' : 's'} from your
          package
        </div>
        <div class="space-y-4">
          {#each ownedObjects as object (object.objectId)}
            <ObjectCard {object} {selectedObjectId} {onSelectObject} />
          {/each}
        </div>
      </div>
    {:else if results}
      <pre
        class="max-h-96 overflow-auto rounded-md bg-muted/20 p-4 font-mono text-sm whitespace-pre-wrap">{results}</pre>
    {:else}
      <p class="py-8 text-center text-muted-foreground">
        Connect your wallet and click a button to see results
      </p>
    {/if}
  </div>
</div>
