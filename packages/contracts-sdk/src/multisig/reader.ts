import type { UTxO } from '@meshsdk/core';
import { MultisigDatum, deserializeMultisigDatum } from './types';

/**
 * Multisig UTXO reader
 */
export class MultisigReader {
    /**
     * Read multisig datum from UTXO
     */
    static readDatum(utxo: UTxO): MultisigDatum | null {
        if (!utxo.output.plutusData) {
            return null;
        }

        try {
            return deserializeMultisigDatum(utxo.output.plutusData);
        } catch (error) {
            console.error('Failed to deserialize multisig datum:', error);
            return null;
        }
    }

    /**
     * Find proposal by ID
     */
    static findByProposalId(utxos: UTxO[], proposalId: string): UTxO | null {
        for (const utxo of utxos) {
            const datum = this.readDatum(utxo);
            if (datum?.proposalId === proposalId) {
                return utxo;
            }
        }
        return null;
    }

    /**
     * Find all active (not executed) proposals
     */
    static findActive(utxos: UTxO[]): UTxO[] {
        return utxos.filter((utxo) => {
            const datum = this.readDatum(utxo);
            return datum && !datum.executed;
        });
    }

    /**
     * Find proposals where a member has not yet signed
     */
    static findPendingSignature(utxos: UTxO[], memberPkh: string): UTxO[] {
        return utxos.filter((utxo) => {
            const datum = this.readDatum(utxo);
            return (
                datum &&
                !datum.executed &&
                datum.committee.includes(memberPkh) &&
                !datum.signatures.includes(memberPkh)
            );
        });
    }

    /**
     * Check if threshold is met
     */
    static isThresholdMet(datum: MultisigDatum): boolean {
        return BigInt(datum.signatures.length) >= datum.threshold;
    }

    /**
     * Check if a member has signed
     */
    static hasSigned(datum: MultisigDatum, memberPkh: string): boolean {
        return datum.signatures.includes(memberPkh);
    }

    /**
     * Get signature progress (e.g., "3/5")
     */
    static getSignatureProgress(datum: MultisigDatum): string {
        return `${datum.signatures.length}/${datum.threshold}`;
    }

    /**
     * Get signature percentage
     */
    static getSignaturePercentage(datum: MultisigDatum): number {
        if (datum.threshold === 0n) return 0;
        return (datum.signatures.length / Number(datum.threshold)) * 100;
    }

    /**
     * Get remaining signatures needed
     */
    static getRemainingSignatures(datum: MultisigDatum): number {
        const remaining = Number(datum.threshold) - datum.signatures.length;
        return Math.max(0, remaining);
    }

    /**
     * Check if a member is part of the committee
     */
    static isCommitteeMember(datum: MultisigDatum, memberPkh: string): boolean {
        return datum.committee.includes(memberPkh);
    }

    /**
     * Get all proposals ready for execution (threshold met, not executed)
     */
    static findReadyForExecution(utxos: UTxO[]): UTxO[] {
        return utxos.filter((utxo) => {
            const datum = this.readDatum(utxo);
            return datum && !datum.executed && this.isThresholdMet(datum);
        });
    }
}
