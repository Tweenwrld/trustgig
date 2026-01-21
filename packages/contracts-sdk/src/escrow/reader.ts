import type { UTxO } from '@meshsdk/core';
import type { Data } from '@meshsdk/common';
import { EscrowDatum, deserializeEscrowDatum } from './types';

/**
 * Escrow UTXO reader
 */
export class EscrowReader {
    /**
     * Read escrow datum from UTXO
     */
    static readDatum(utxo: UTxO): EscrowDatum | null {
        if (!utxo.output.plutusData) {
            return null;
        }

        try {
            // The plutusData can be a string (CBOR hex) or a Data object
            const data: Data = typeof utxo.output.plutusData === 'string'
                ? JSON.parse(utxo.output.plutusData)
                : utxo.output.plutusData as Data;
            return deserializeEscrowDatum(data);
        } catch (error) {
            console.error('Failed to deserialize escrow datum:', error);
            return null;
        }
    }

    /**
     * Find escrow UTXOs by job ID
     */
    static findByJobId(utxos: UTxO[], jobId: string): UTxO[] {
        return utxos.filter((utxo) => {
            const datum = this.readDatum(utxo);
            return datum?.jobId === jobId;
        });
    }

    /**
     * Find escrow UTXOs by client
     */
    static findByClient(utxos: UTxO[], clientPkh: string): UTxO[] {
        return utxos.filter((utxo) => {
            const datum = this.readDatum(utxo);
            return datum?.client === clientPkh;
        });
    }

    /**
     * Find escrow UTXOs by worker
     */
    static findByWorker(utxos: UTxO[], workerPkh: string): UTxO[] {
        return utxos.filter((utxo) => {
            const datum = this.readDatum(utxo);
            return datum?.worker === workerPkh;
        });
    }

    /**
     * Check if all milestones are completed and approved
     */
    static areAllMilestonesComplete(datum: EscrowDatum): boolean {
        return datum.milestones.every((m) => m.completed && m.approved);
    }

    /**
     * Get total locked amount
     */
    static getTotalAmount(utxo: UTxO): bigint {
        const lovelaceAsset = utxo.output.amount.find((a) => a.unit === 'lovelace');
        return lovelaceAsset ? BigInt(lovelaceAsset.quantity) : 0n;
    }
}
