<script lang="ts">
  import {
    ConnectButton,
    testnetWalletAdapter as walletAdapter
  } from '@builders-of-stuff/svelte-sui-wallet-adapter';

  import { Button } from '$lib/components/ui/button';

  import ResultsSection from './results-section.svelte';
  import { enokiState } from './enoki-state.svelte';
</script>

<div class="min-h-screen bg-background">
  <!-- Header -->
  <header class="border-b border-border bg-card">
    <div class="container mx-auto flex items-center justify-between px-4 py-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Enoki Play</h1>
        <p class="text-sm text-muted-foreground">Testing Environment</p>
      </div>

      <!-- SUI Wallet Adapter in top right -->
      <div class="flex items-center gap-4">
        <ConnectButton {walletAdapter} />
      </div>
    </div>
  </header>

  <!-- Main Content Area -->
  <main class="container mx-auto px-4 py-8">
    <div class="mx-auto max-w-2xl space-y-8">
      <!-- Welcome Section -->
      <div class="space-y-4 text-center">
        <h2 class="text-3xl font-semibold text-foreground">Testing Environment</h2>
        <p class="text-lg text-muted-foreground">
          Connect your wallet and test blockchain interactions
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-6">
        <div class="flex flex-wrap justify-center gap-4">
          <Button
            onclick={enokiState.createThing}
            disabled={enokiState.loading}
            variant="default"
          >
            Create thing
          </Button>

          <Button
            onclick={enokiState.updateThing}
            disabled={enokiState.loading}
            variant="secondary"
          >
            Update thing
          </Button>

          <Button
            onclick={enokiState.getOwnedObjects}
            disabled={enokiState.loading}
            variant="outline"
          >
            Get My Objects
          </Button>
        </div>

        <!-- Results Section -->
        <ResultsSection />
      </div>
    </div>
  </main>
</div>
