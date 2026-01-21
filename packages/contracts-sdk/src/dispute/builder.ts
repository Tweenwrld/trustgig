import { MeshTxBuilder } from '@meshsdk/core';
import type { UTxO } from '@meshsdk/core';
import {
    DisputeDatum,
    DisputeRedeemer,
    DisputeStatus,
    serializeDisputeDatum,
    serializeDisputeRedeemer,
} from './types';

/**
 * Dispute transaction builder
 */
export class DisputeBuilder {
    private txBuilder: MeshTxBuilder;
    private disputeScriptAddress: string;
    private disputeScriptCbor: string;

    constructor(
        txBuilder: MeshTxBuilder,
        disputeScriptAddress: string,
        disputeScriptCbor: string
    ) {
        this.txBuilder = txBuilder;
        this.disputeScriptAddress = disputeScriptAddress;
        this.disputeScriptCbor = disputeScriptCbor;
    }

    /**
     * Open a new dispute
     */
    async openDispute(
        jobId: string,
        clientPkh: string,
        workerPkh: string,
        mediatorPkh: string,
        disputeReason: string,
        totalAmount: bigint,
        minAda: bigint = 2000000n
    ): Promise<string> {
        const currentTime = BigInt(Date.now());
        const datum: DisputeDatum = {
            jobId,
            clientPkh,
            workerPkh,
            mediatorPkh,
            disputeReason,
            status: DisputeStatus.Open,
            clientPercentage: 0n,
            workerPercentage: 0n,
            totalAmount,
            createdAt: currentTime,
            resolvedAt: 0n,
        };

        const serializedDatum = serializeDisputeDatum(datum);

        this.txBuilder
            .txOut(this.disputeScriptAddress, [
                { unit: 'lovelace', quantity: (totalAmount + minAda).toString() },
            ])
            .txOutInlineDatumValue(serializedDatum);

        return this.txBuilder.complete();
    }

    /**
     * Resolve a dispute
     */
    async resolveDispute(
        disputeUtxo: UTxO,
        datum: DisputeDatum,
        clientPercentage: bigint,
        workerPercentage: bigint,
        clientAddress: string,
        workerAddress: string,
        mediatorPkh: string
    ): Promise<string> {
        // Validate percentages
        if (clientPercentage + workerPercentage !== 100n) {
            throw new Error('Percentages must sum to 100');
        }

        const redeemer: DisputeRedeemer = {
            type: 'Resolve',
            clientPercentage,
            workerPercentage,
        };
        const serializedRedeemer = serializeDisputeRedeemer(redeemer);

        // Calculate distribution
        const clientAmount = (datum.totalAmount * clientPercentage) / 100n;
        const workerAmount = (datum.totalAmount * workerPercentage) / 100n;

        const txBuilder = this.txBuilder
            .spendingPlutusScript('V3')
            .txIn(
                disputeUtxo.input.txHash,
                disputeUtxo.input.outputIndex,
                disputeUtxo.output.amount,
                disputeUtxo.output.address
            )
            .txInScript(this.disputeScriptCbor)
            .txInInlineDatumPresent()
            .txInRedeemerValue(serializedRedeemer);

        // Add outputs for client and worker
        if (clientAmount > 0n) {
            txBuilder.txOut(clientAddress, [
                { unit: 'lovelace', quantity: clientAmount.toString() },
            ]);
        }

        if (workerAmount > 0n) {
            txBuilder.txOut(workerAddress, [
                { unit: 'lovelace', quantity: workerAmount.toString() },
            ]);
        }

        txBuilder.requiredSignerHash(mediatorPkh);

        return txBuilder.complete();
    }

    /**
     * Reject a dispute (invalid or withdrawn)
     */
    async rejectDispute(
        disputeUtxo: UTxO,
        datum: DisputeDatum,
        returnAddress: string,
        mediatorPkh: string
    ): Promise<string> {
        const redeemer: DisputeRedeemer = { type: 'Reject' };
        const serializedRedeemer = serializeDisputeRedeemer(redeemer);

        this.txBuilder
            .spendingPlutusScript('V3')
            .txIn(
                disputeUtxo.input.txHash,
                disputeUtxo.input.outputIndex,
                disputeUtxo.output.amount,
                disputeUtxo.output.address
            )
            .txInScript(this.disputeScriptCbor)
            .txInInlineDatumPresent()
            .txInRedeemerValue(serializedRedeemer)
            .txOut(returnAddress, disputeUtxo.output.amount)
            .requiredSignerHash(mediatorPkh);

        return this.txBuilder.complete();
    }

    /**
     * Calculate fair split based on milestone completion
     */
    static calculateFairSplit(completedMilestones: number, totalMilestones: number): {
        clientPercentage: bigint;
        workerPercentage: bigint;
    } {
        if (totalMilestones === 0) {
            return { clientPercentage: 50n, workerPercentage: 50n };
        }

        const workerPercentage = BigInt(Math.round((completedMilestones / totalMilestones) * 100));
        const clientPercentage = 100n - workerPercentage;

        return { clientPercentage, workerPercentage };
    }

    /**
     * Common resolution presets
     */
    static readonly ResolutionPresets = {
        FULL_CLIENT: { clientPercentage: 100n, workerPercentage: 0n },
        FULL_WORKER: { clientPercentage: 0n, workerPercentage: 100n },
        EVEN_SPLIT: { clientPercentage: 50n, workerPercentage: 50n },
        MOSTLY_CLIENT: { clientPercentage: 75n, workerPercentage: 25n },
        MOSTLY_WORKER: { clientPercentage: 25n, workerPercentage: 75n },
    };
}
