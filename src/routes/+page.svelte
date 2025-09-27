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
  let selectedObjectId = $state<string | null>(null);

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

  function handleObjectSelect(objectId: string) {
    selectedObjectId = selectedObjectId === objectId ? null : objectId;
  }

  async function updateThing() {
    if (!walletAdapter.isConnected || !walletAdapter.currentAccount) {
      results = 'Wallet not connected';
      return;
    }

    // Get owned objects first to find a Thing to update
    if (ownedObjects.length === 0) {
      results = 'No Thing objects found. Create a Thing first.';
      return;
    }

    loading = true;

    const tx = new Transaction();

    // Use selected object or fallback to first one if none selected
    let thingToUpdate = ownedObjects[0]; // default fallback
    if (selectedObjectId) {
      const selectedObject = ownedObjects.find(obj => obj.objectId === selectedObjectId);
      if (selectedObject) {
        thingToUpdate = selectedObject;
      }
    }

    tx.moveCall({
      target: `${PACKAGE_ID}::main::update_thing`,
      arguments: [
        tx.object(thingToUpdate.objectId),
        tx.pure.u64(150), // hardcoded health value
        tx.pure.string("updated enoki") // hardcoded name value
      ]
    });

    try {
      const { bytes, signature } = await walletAdapter.signTransaction(tx as any, {});

      const executedTx = await walletAdapter.executeTransaction({
        bytes,
        signature
      });

      console.log('Update response: ', executedTx);
      results = `Thing updated successfully! Transaction: ${executedTx.digest}`;
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

      ownedObjects = response.data.map((obj) => obj.data!).filter(Boolean);
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

          <Button
            onclick={getOwnedObjectsFromPackage}
            disabled={loading}
            variant="outline"
          >
            Get My Objects
          </Button>
        </div>

        <!-- Results Section -->
        <ResultsSection {results} {loading} {ownedObjects} {selectedObjectId} onSelectObject={handleObjectSelect} />
      </div>
    </div>
  </main>
</div>
