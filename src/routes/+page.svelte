<script lang="ts">
  import {
    ConnectButton,
    testnetWalletAdapter as walletAdapter
  } from '@builders-of-stuff/svelte-sui-wallet-adapter';
  import { Transaction } from '@mysten/sui/transactions';

  import { Button } from '$lib/components/ui/button';

  import ResultsSection from './results-section.svelte';
  import { PACKAGE_ID } from '$lib/shared/contracts.constants';
  import type { SuiObjectData } from '@mysten/sui/client';

  let results = $state('');
  let ownedObjects = $state<SuiObjectData[]>([]);
  let loading = $state(false);

  async function createThing() {
    if (!walletAdapter.isConnected || !walletAdapter.currentAccount) {
      results = 'Wallet not connected';
      return;
    }

    loading = true;

    const tx = new Transaction();

    const thing = tx.moveCall({
      target: `${PACKAGE_ID}::main::new_thing`,
      arguments: []
    });

    tx.transferObjects([thing], walletAdapter.currentAccount.address);

    try {
      const { bytes, signature } = await walletAdapter.signTransaction(tx as any, {});

      const executedTx = await walletAdapter.executeTransaction({
        bytes,
        signature
      });

      console.log('response: ', executedTx);
    } catch (error) {
      results = `Error: ${error}`;
    } finally {
      loading = false;
    }
  }

  async function updateThing() {
    if (!walletAdapter.isConnected || !walletAdapter.currentAccount) {
      results = 'Wallet not connected';
      return;
    }

    loading = true;
    try {
      const accountInfo = {
        address: walletAdapter.currentAccount.address,
        publicKey: walletAdapter.currentAccount.publicKey,
        chains: walletAdapter.currentAccount.chains
      };
      results = JSON.stringify(accountInfo, null, 2);
    } catch (error) {
      results = `Error: ${error}`;
    } finally {
      loading = false;
    }
  }

  async function signMessage() {
    if (!walletAdapter.isConnected) {
      results = 'Wallet not connected';
      return;
    }

    loading = true;
    try {
      const message = 'Hello from Enoki Play!';
      const signedMessage = await walletAdapter.signPersonalMessage({
        message: new TextEncoder().encode(message)
      });
      results = JSON.stringify({ message, signature: signedMessage }, null, 2);
    } catch (error) {
      results = `Error: ${error}`;
    } finally {
      loading = false;
    }
  }

  async function getOwnedObjects() {
    if (!walletAdapter.isConnected || !walletAdapter.currentAccount) {
      results = 'Wallet not connected';
      return;
    }

    loading = true;
    try {
      const objects = await walletAdapter.suiClient.getOwnedObjects({
        owner: walletAdapter.currentAccount.address,
        options: { showContent: true }
      });
      results = JSON.stringify(objects, null, 2);
    } catch (error) {
      results = `Error: ${error}`;
    } finally {
      loading = false;
    }
  }

  async function getOwnedObjectsFromPackage() {
    if (!walletAdapter.isConnected || !walletAdapter.currentAccount) {
      results = 'Wallet not connected';
      ownedObjects = [];
      return;
    }

    loading = true;
    try {
      const response = await walletAdapter.suiClient.getOwnedObjects({
        owner: walletAdapter.currentAccount.address,
        filter: {
          Package: PACKAGE_ID
        },
        options: {
          showContent: true,
          showDisplay: true,
          showType: true
        }
      });

      ownedObjects = response.data.map(obj => obj.data!).filter(Boolean);
      results = '';
    } catch (error) {
      results = `Error: ${error}`;
      ownedObjects = [];
    } finally {
      loading = false;
    }
  }
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
          <Button onclick={createThing} disabled={loading} variant="default">
            Create thing
          </Button>

          <Button onclick={updateThing} disabled={loading} variant="secondary">
            Update thing
          </Button>

          <Button onclick={getOwnedObjectsFromPackage} disabled={loading} variant="outline">
            Get My Objects
          </Button>
        </div>

        <!-- Results Section -->
        <ResultsSection {results} {loading} {ownedObjects} />
      </div>
    </div>
  </main>
</div>
