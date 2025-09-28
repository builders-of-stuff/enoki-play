import { testnetWalletAdapter as walletAdapter } from '@builders-of-stuff/svelte-sui-wallet-adapter';
import { Transaction } from '@mysten/sui/transactions';
import type { SuiObjectData } from '@mysten/sui/client';
import { PACKAGE_ID } from '$lib/shared/contracts.constants';

class EnokiState {
  results = $state('');
  ownedObjects = $state<SuiObjectData[]>([]);
  loading = $state(false);
  selectedObjectId = $state<string | null>(null);

  createThing = async () => {
    if (!walletAdapter.isConnected || !walletAdapter.currentAccount) {
      this.results = 'Wallet not connected';
      return;
    }

    this.loading = true;

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
      this.results = `Thing created successfully! Transaction: ${executedTx.digest}`;

      // Auto-refresh objects to show newly created object
      await this.getOwnedObjects();
    } catch (error) {
      this.results = `Error: ${error}`;
    } finally {
      this.loading = false;
    }
  };

  selectObject(objectId: string) {
    this.selectedObjectId = this.selectedObjectId === objectId ? null : objectId;
  }

  updateThing = async () => {
    if (!walletAdapter.isConnected || !walletAdapter.currentAccount) {
      this.results = 'Wallet not connected';
      return;
    }

    if (this.ownedObjects.length === 0) {
      this.results = 'No Thing objects found. Create a Thing first.';
      return;
    }

    this.loading = true;

    const tx = new Transaction();

    let thingToUpdate = this.ownedObjects[0];
    if (this.selectedObjectId) {
      const selectedObject = this.ownedObjects.find(
        (obj) => obj.objectId === this.selectedObjectId
      );
      if (selectedObject) {
        thingToUpdate = selectedObject;
      }
    }

    tx.moveCall({
      target: `${PACKAGE_ID}::main::update_thing`,
      arguments: [
        tx.object(thingToUpdate.objectId),
        tx.pure.u64(Math.floor(Math.random() * 1000)),
        tx.pure.string(new Date().toISOString().slice(0, 16).replace('T', ' '))
      ]
    });

    try {
      const { bytes, signature } = await walletAdapter.signTransaction(tx as any, {});

      const executedTx = await walletAdapter.executeTransaction({
        bytes,
        signature
      });

      console.log('Update response: ', executedTx);
      this.results = `Thing updated successfully! Transaction: ${executedTx.digest}`;

      // Auto-refresh objects to show updated data
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.getOwnedObjects();
    } catch (error) {
      this.results = `Error: ${error}`;
    } finally {
      this.loading = false;
    }
  };

  getOwnedObjects = async () => {
    if (!walletAdapter.isConnected || !walletAdapter.currentAccount) {
      this.results = 'Wallet not connected';
      this.ownedObjects = [];
      return;
    }

    this.loading = true;
    try {
      const response = (await walletAdapter.suiClient.getOwnedObjects({
        owner: walletAdapter.currentAccount.address,
        filter: {
          Package: PACKAGE_ID
        },
        options: {
          showContent: true,
          showDisplay: true,
          showType: true
        }
      })) as any;

      this.ownedObjects = response.data.map((obj: any) => obj.data!).filter(Boolean);
      this.results = '';
    } catch (error) {
      this.results = `Error: ${error}`;
      this.ownedObjects = [];
    } finally {
      this.loading = false;
    }
  };
}

export const enokiState = new EnokiState();
