<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { page } from '$app/stores';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-background">
  <!-- Navigation Tabs -->
  <nav class="border-b border-border bg-card">
    <div class="container mx-auto px-4 py-2">
      <div class="flex gap-2">
        <a
          href="/"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors {$page.url.pathname === '/'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
        >
          Main
        </a>
        <a
          href="/sponsored"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors {$page.url.pathname === '/sponsored'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
        >
          Sponsored
        </a>
      </div>
    </div>
  </nav>

  <!-- Page Content -->
  {@render children?.()}
</div>
