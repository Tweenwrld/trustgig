import { MeshTxBuilder } from '@meshsdk/core';
import type { UTxO } from '@meshsdk/core';
import {
    ReputationDatum,
    ReputationRedeemer,
    serializeReputationDatum,
    serializeReputationRedeemer,
} from './types';

/**
 * Reputation transaction builder
 */
export class ReputationBuilder {
    private txBuilder: MeshTxBuilder;
    private reputationScriptAddress: string;
    private reputationScriptCbor: string;

    constructor(
        txBuilder: MeshTxBuilder,
        reputationScriptAddress: string,
        reputationScriptCbor: string
    ) {
        this.txBuilder = txBuilder;
        this.reputationScriptAddress = reputationScriptAddress;
        this.reputationScriptCbor = reputationScriptCbor;
    }

    /**
     * Initialize reputation for a new user
     */
    async initializeReputation(userPkh: string, minAda: bigint = 2000000n): Promise<string> {
        const datum: ReputationDatum = {
            userPkh,
            score: 100n, // Starting score
            totalJobs: 0n,
            completedJobs: 0n,
        };

        const serializedDatum = serializeReputationDatum(datum);

        this.txBuilder
            .txOut(this.reputationScriptAddress, [
                { unit: 'lovelace', quantity: minAda.toString() },
            ])
            .txOutInlineDatumValue(serializedDatum);

        return this.txBuilder.complete();
    }

    /**
     * Update reputation score
     */
    async updateScore(
        reputationUtxo: UTxO,
        datum: ReputationDatum,
        delta: bigint,
        signerPkh: string
    ): Promise<string> {
        const redeemer: ReputationRedeemer = { type: 'UpdateScore', delta };
        const serializedRedeemer = serializeReputationRedeemer(redeemer);

        // Calculate new score (ensure it doesn't go below 0)
        const newScore = datum.score + delta;
        const clampedScore = newScore < 0n ? 0n : newScore;

        const updatedDatum: ReputationDatum = {
            ...datum,
            score: clampedScore,
        };

        const serializedDatum = serializeReputationDatum(updatedDatum);

        this.txBuilder
            .spendingPlutusScript('V3')
            .txIn(
                reputationUtxo.input.txHash,
                reputationUtxo.input.outputIndex,
                reputationUtxo.output.amount,
                reputationUtxo.output.address
            )
            .txInScript(this.reputationScriptCbor)
            .txInInlineDatumPresent()
            .txInRedeemerValue(serializedRedeemer)
            .txOut(this.reputationScriptAddress, reputationUtxo.output.amount)
            .txOutInlineDatumValue(serializedDatum)
            .requiredSignerHash(signerPkh);

        return this.txBuilder.complete();
    }

    /**
     * Increment job counters
     */
    async incrementJobs(
        reputationUtxo: UTxO,
        datum: ReputationDatum,
        completed: boolean,
        signerPkh: string
    ): Promise<string> {
        const redeemer: ReputationRedeemer = { type: 'IncrementJobs' };
        const serializedRedeemer = serializeReputationRedeemer(redeemer);

        const updatedDatum: ReputationDatum = {
            ...datum,
            totalJobs: datum.totalJobs + 1n,
            completedJobs: completed ? datum.completedJobs + 1n : datum.completedJobs,
        };

        const serializedDatum = serializeReputationDatum(updatedDatum);

        this.txBuilder
            .spendingPlutusScript('V3')
            .txIn(
                reputationUtxo.input.txHash,
                reputationUtxo.input.outputIndex,
                reputationUtxo.output.amount,
                reputationUtxo.output.address
            )
            .txInScript(this.reputationScriptCbor)
            .txInInlineDatumPresent()
            .txInRedeemerValue(serializedRedeemer)
            .txOut(this.reputationScriptAddress, reputationUtxo.output.amount)
            .txOutInlineDatumValue(serializedDatum)
            .requiredSignerHash(signerPkh);

        return this.txBuilder.complete();
    }

    /**
     * Calculate reputation percentage (0-100)
     */
    static calculateReputationPercentage(score: bigint, maxScore: bigint = 1000n): number {
        if (maxScore === 0n) return 0;
        const percentage = (Number(score) / Number(maxScore)) * 100;
        return Math.min(100, Math.max(0, percentage));
    }

    /**
     * Get completion rate (0-100)
     */
    static getCompletionRate(datum: ReputationDatum): number {
        if (datum.totalJobs === 0n) return 100; // No jobs yet, perfect score
        return (Number(datum.completedJobs) / Number(datum.totalJobs)) * 100;
    }
}
