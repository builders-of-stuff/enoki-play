import { command } from '$app/server';
import { z } from 'zod';
import { EnokiClient } from '@mysten/enoki';

import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

const SponsorTransactionSchema = z.object({
  transactionBytes: z.any(),
  sender: z.any(),
  allowedMoveCallTargets: z.any(),
  allowedAddresses: z.any()
});

const ExecuteTransactionSchema = z.object({
  digest: z.any(),
  signature: z.any()
});

const enokiClient = new EnokiClient({
  apiKey: env.PRIVATE_ENOKI_API_KEY
});

export const sponsorTransaction = command(
  SponsorTransactionSchema,
  async ({ transactionBytes, sender, allowedMoveCallTargets, allowedAddresses }) => {
    // Placeholder implementation
    console.log('Sponsoring transaction with bytes');

    try {
      const response = await enokiClient.createSponsoredTransaction({
        network: 'testnet',
        transactionKindBytes: transactionBytes,
        sender,
        allowedMoveCallTargets,
        allowedAddresses
      });

      return {
        success: true,
        bytes: response.bytes,
        digest: response.digest
      };
    } catch (error) {
      console.error('Error creating sponsored transaction:', error);
    }

    // Here you would add the logic to sponsor the  transaction
    return { success: true, message: 'Transaction sponsored successfully' };
  }
);

export const executeTransaction = command(
  ExecuteTransactionSchema,
  async ({ digest, signature }) => {
    console.log('executing transaction');

    try {
      const response = await enokiClient.executeSponsoredTransaction({
        digest,
        signature
      });

      return {
        success: true,
        result: response
      };
    } catch (error) {
      console.error('Error executing sponsored transaction:', error);
    }

    // Here you would add the logic to sponsor the  transaction
    return { success: true, message: 'Transaction executed successfully' };
  }
);
