<script lang="ts">
  import {
    ConnectButton,
    testnetWalletAdapter as walletAdapter
  } from '@builders-of-stuff/svelte-sui-wallet-adapter';
  import { registerEnokiWallets } from '@mysten/enoki';
  import { isEnokiWallet } from '@mysten/enoki';

  import { env } from '$env/dynamic/public';

  import { Button } from '$lib/components/ui/button';

  import ResultsSection from '../results-section.svelte';
  import { enokiState } from '../enoki-state.svelte';

  let googleWallet = $state();
  let showAddress = $state(false);

  const registerEnokiWallet = () => {
    const { wallets } = registerEnokiWallets({
      client: walletAdapter.suiClient,
      network: 'testnet',
      apiKey: env.PUBLIC_ENOKI_API_KEY || '',
      providers: {
        google: {
          clientId: env.PUBLIC_GOOGLE_CLIENT_ID || ''
        }
      }
    });

    const _wallets = walletAdapter.wallets;
    googleWallet = wallets.google;

    console.log('wallets: ', wallets);
    _wallets.forEach((w) => console.log(w.name));
  };

  const showWalletAddress = () => {
    showAddress = !showAddress;
  };
</script>

<div class="min-h-screen bg-background">
  <!-- Header -->
  <header class="border-b border-border bg-card">
    <div class="container mx-auto flex items-center justify-between px-4 py-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Enoki Play - Sponsored</h1>
        <p class="text-sm text-muted-foreground">Sponsored Content Testing</p>
      </div>

      <!-- SUI Wallet Adapter in top right -->
      <div class="flex items-center gap-4">
        {#if googleWallet}
          <Button
            onclick={() => {
              walletAdapter.connectWallet({
                wallet: googleWallet
              });
            }}
            variant="outline"
          >
            Sign in with Google
          </Button>
        {/if}
        <ConnectButton {walletAdapter} />
      </div>
    </div>
  </header>

  <!-- Main Content Area -->
  <main class="container mx-auto px-4 py-8">
    <div class="mx-auto max-w-2xl space-y-8">
      <!-- Welcome Section -->
      <div class="space-y-4 text-center">
        <h2 class="text-3xl font-semibold text-foreground">
          Sponsored Testing Environment
        </h2>
        <p class="text-lg text-muted-foreground">
          Connect your wallet and test sponsored blockchain interactions
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-6">
        <div class="flex flex-wrap justify-center gap-4">
          <Button
            onclick={enokiState.createThingSponsored}
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

          <Button
            onclick={registerEnokiWallet}
            disabled={enokiState.loading}
            variant="outline"
          >
            Register Enoki Wallet
          </Button>
        </div>

        <div class="flex flex-wrap justify-center gap-4">
          <Button
            onclick={showWalletAddress}
            disabled={enokiState.loading}
            variant="outline"
          >
            {showAddress ? 'Hide' : 'Show'} Wallet Address
          </Button>
        </div>

        <!-- Wallet Info Section -->
        {#if showAddress}
          <div
            class="mx-auto max-w-md rounded-lg border border-border bg-card p-4 text-center"
          >
            <h3 class="mb-2 text-sm font-medium text-muted-foreground">
              Wallet Status
            </h3>
            {#if walletAdapter.isConnected && walletAdapter.currentAccount}
              <div class="space-y-2">
                <div class="text-sm text-green-600">✓ Connected</div>
                <div class="rounded bg-muted p-2 font-mono text-xs break-all">
                  {walletAdapter.currentAccount.address}
                </div>
              </div>
            {:else}
              <div class="text-sm text-muted-foreground">No wallet connected</div>
            {/if}
          </div>
        {/if}

        <!-- Results Section -->
        <ResultsSection />
      </div>
    </div>
  </main>
</div>
