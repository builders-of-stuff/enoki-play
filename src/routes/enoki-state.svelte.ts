import { testnetWalletAdapter as walletAdapter } from '@builders-of-stuff/svelte-sui-wallet-adapter';
import { Transaction } from '@mysten/sui/transactions';
import type { SuiObjectData } from '@mysten/sui/client';
import { PACKAGE_ID } from '$lib/shared/contracts.constants';

class EnokiState {
  results = $state('');
  ownedObjects = $state<SuiObjectData[]>([]);
  loading = $state(false);
  selectedObjectId = $state<string | null>(null);

  async createThing() {
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
    } catch (error) {
      this.results = `Error: ${error}`;
    } finally {
      this.loading = false;
    }
  }

  selectObject(objectId: string) {
    this.selectedObjectId = this.selectedObjectId === objectId ? null : objectId;
  }

  async updateThing() {
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
        tx.pure.u64(150),
        tx.pure.string('updated enoki')
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
    } catch (error) {
      this.results = `Error: ${error}`;
    } finally {
      this.loading = false;
    }
  }

  async getOwnedObjects() {
    console.log('1');
    if (!walletAdapter.isConnected || !walletAdapter.currentAccount) {
      this.results = 'Wallet not connected';
      this.ownedObjects = [];
      console.log('2');
      return;
    }

    console.log('3');
    this.loading = true;
    try {
      console.log('4');
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

      console.log('Owned objects response: ', response);

      this.ownedObjects = response.data.map((obj) => obj.data!).filter(Boolean);

      console.log('Owned objects: ', this.ownedObjects);
      this.results = '';
    } catch (error) {
      console.log('5');
      console.log('error: ', error);
      this.results = `Error: ${error}`;
      this.ownedObjects = [];
    } finally {
      this.loading = false;
    }
  }
}

export const enokiState = new EnokiState();
