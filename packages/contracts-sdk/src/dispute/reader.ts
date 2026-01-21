import type { UTxO } from '@meshsdk/core';
import { DisputeDatum, DisputeStatus, deserializeDisputeDatum } from './types';

/**
 * Dispute UTXO reader
 */
export class DisputeReader {
    /**
     * Read dispute datum from UTXO
     */
    static readDatum(utxo: UTxO): DisputeDatum | null {
        if (!utxo.output.plutusData) {
            return null;
        }

        try {
            return deserializeDisputeDatum(utxo.output.plutusData);
        } catch (error) {
            console.error('Failed to deserialize dispute datum:', error);
            return null;
        }
    }

    /**
     * Find dispute by job ID
     */
    static findByJobId(utxos: UTxO[], jobId: string): UTxO | null {
        for (const utxo of utxos) {
            const datum = this.readDatum(utxo);
            if (datum?.jobId === jobId) {
                return utxo;
            }
        }
        return null;
    }

    /**
     * Find all disputes involving a client
     */
    static findByClient(utxos: UTxO[], clientPkh: string): UTxO[] {
        return utxos.filter((utxo) => {
            const datum = this.readDatum(utxo);
            return datum?.clientPkh === clientPkh;
        });
    }

    /**
     * Find all disputes involving a worker
     */
    static findByWorker(utxos: UTxO[], workerPkh: string): UTxO[] {
        return utxos.filter((utxo) => {
            const datum = this.readDatum(utxo);
            return datum?.workerPkh === workerPkh;
        });
    }

    /**
     * Find all disputes assigned to a mediator
     */
    static findByMediator(utxos: UTxO[], mediatorPkh: string): UTxO[] {
        return utxos.filter((utxo) => {
            const datum = this.readDatum(utxo);
            return datum?.mediatorPkh === mediatorPkh;
        });
    }

    /**
     * Find disputes by status
     */
    static findByStatus(utxos: UTxO[], status: DisputeStatus): UTxO[] {
        return utxos.filter((utxo) => {
            const datum = this.readDatum(utxo);
            return datum?.status === status;
        });
    }

    /**
     * Get all open disputes
     */
    static getOpenDisputes(utxos: UTxO[]): UTxO[] {
        return this.findByStatus(utxos, DisputeStatus.Open);
    }

    /**
     * Get all resolved disputes
     */
    static getResolvedDisputes(utxos: UTxO[]): UTxO[] {
        return this.findByStatus(utxos, DisputeStatus.Resolved);
    }

    /**
     * Get dispute status name
     */
    static getStatusName(status: DisputeStatus): string {
        switch (status) {
            case DisputeStatus.Open:
                return 'Open';
            case DisputeStatus.UnderReview:
                return 'Under Review';
            case DisputeStatus.Resolved:
                return 'Resolved';
            case DisputeStatus.Rejected:
                return 'Rejected';
            default:
                return 'Unknown';
        }
    }

    /**
     * Get dispute age in days
     */
    static getDisputeAge(datum: DisputeDatum): number {
        const currentTime = BigInt(Date.now());
        const ageMs = currentTime - datum.createdAt;
        return Math.floor(Number(ageMs) / (24 * 60 * 60 * 1000));
    }

    /**
     * Get time to resolution in days
     */
    static getResolutionTime(datum: DisputeDatum): number | null {
        if (datum.resolvedAt === 0n) return null;
        const resolutionMs = datum.resolvedAt - datum.createdAt;
        return Math.floor(Number(resolutionMs) / (24 * 60 * 60 * 1000));
    }

    /**
     * Check if dispute is stale (open for too long)
     */
    static isStale(datum: DisputeDatum, maxDays: number = 30): boolean {
        if (datum.status !== DisputeStatus.Open) return false;
        return this.getDisputeAge(datum) > maxDays;
    }

    /**
     * Get distribution amounts
     */
    static getDistribution(datum: DisputeDatum): {
        clientAmount: bigint;
        workerAmount: bigint;
    } {
        const clientAmount = (datum.totalAmount * datum.clientPercentage) / 100n;
        const workerAmount = (datum.totalAmount * datum.workerPercentage) / 100n;
        return { clientAmount, workerAmount };
    }
}
