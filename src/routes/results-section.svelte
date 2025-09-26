<script lang="ts">
  interface Props {
    results: string;
    loading: boolean;
  }

  let { results, loading }: Props = $props();
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