import { MeshTxBuilder } from '@meshsdk/core';
import type { UTxO } from '@meshsdk/core';
import {
    MultisigDatum,
    MultisigRedeemer,
    serializeMultisigDatum,
    serializeMultisigRedeemer,
} from './types';

/**
 * Multisig transaction builder
 */
export class MultisigBuilder {
    private txBuilder: MeshTxBuilder;
    private multisigScriptAddress: string;
    private multisigScriptCbor: string;

    constructor(
        txBuilder: MeshTxBuilder,
        multisigScriptAddress: string,
        multisigScriptCbor: string
    ) {
        this.txBuilder = txBuilder;
        this.multisigScriptAddress = multisigScriptAddress;
        this.multisigScriptCbor = multisigScriptCbor;
    }

    /**
     * Create a new multisig proposal
     */
    async createProposal(
        committee: string[],
        threshold: bigint,
        proposalId: string,
        proposalHash: string,
        minAda: bigint = 2000000n
    ): Promise<string> {
        const datum: MultisigDatum = {
            committee,
            threshold,
            proposalId,
            proposalHash,
            signatures: [],
            executed: false,
        };

        const serializedDatum = serializeMultisigDatum(datum);

        this.txBuilder
            .txOut(this.multisigScriptAddress, [
                { unit: 'lovelace', quantity: minAda.toString() },
            ])
            .txOutInlineDatumValue(serializedDatum);

        return this.txBuilder.complete();
    }

    /**
     * Sign a proposal
     */
    async signProposal(
        proposalUtxo: UTxO,
        datum: MultisigDatum,
        signerPkh: string
    ): Promise<string> {
        // Check if already signed
        if (datum.signatures.includes(signerPkh)) {
            throw new Error('Already signed by this committee member');
        }

        const redeemer: MultisigRedeemer = { type: 'Sign' };
        const serializedRedeemer = serializeMultisigRedeemer(redeemer);

        const updatedDatum: MultisigDatum = {
            ...datum,
            signatures: [...datum.signatures, signerPkh],
        };

        const serializedDatum = serializeMultisigDatum(updatedDatum);

        this.txBuilder
            .spendingPlutusScript('V3')
            .txIn(
                proposalUtxo.input.txHash,
                proposalUtxo.input.outputIndex,
                proposalUtxo.output.amount,
                proposalUtxo.output.address
            )
            .txInScript(this.multisigScriptCbor)
            .txInInlineDatumPresent()
            .txInRedeemerValue(serializedRedeemer)
            .txOut(this.multisigScriptAddress, proposalUtxo.output.amount)
            .txOutInlineDatumValue(serializedDatum)
            .requiredSignerHash(signerPkh);

        return this.txBuilder.complete();
    }

    /**
     * Execute a proposal (after threshold is met)
     */
    async executeProposal(
        proposalUtxo: UTxO,
        datum: MultisigDatum,
        recipientAddress: string
    ): Promise<string> {
        // Check if threshold is met
        if (BigInt(datum.signatures.length) < datum.threshold) {
            throw new Error('Threshold not met');
        }

        const redeemer: MultisigRedeemer = { type: 'Execute' };
        const serializedRedeemer = serializeMultisigRedeemer(redeemer);

        const updatedDatum: MultisigDatum = {
            ...datum,
            executed: true,
        };

        const serializedDatum = serializeMultisigDatum(updatedDatum);

        this.txBuilder
            .spendingPlutusScript('V3')
            .txIn(
                proposalUtxo.input.txHash,
                proposalUtxo.input.outputIndex,
                proposalUtxo.output.amount,
                proposalUtxo.output.address
            )
            .txInScript(this.multisigScriptCbor)
            .txInInlineDatumPresent()
            .txInRedeemerValue(serializedRedeemer)
            .txOut(recipientAddress, proposalUtxo.output.amount);

        // Add all committee members as required signers
        datum.signatures.forEach((signerPkh) => {
            this.txBuilder.requiredSignerHash(signerPkh);
        });

        return this.txBuilder.complete();
    }

    /**
     * Cancel a proposal
     */
    async cancelProposal(
        proposalUtxo: UTxO,
        datum: MultisigDatum,
        returnAddress: string
    ): Promise<string> {
        const redeemer: MultisigRedeemer = { type: 'Cancel' };
        const serializedRedeemer = serializeMultisigRedeemer(redeemer);

        this.txBuilder
            .spendingPlutusScript('V3')
            .txIn(
                proposalUtxo.input.txHash,
                proposalUtxo.input.outputIndex,
                proposalUtxo.output.amount,
                proposalUtxo.output.address
            )
            .txInScript(this.multisigScriptCbor)
            .txInInlineDatumPresent()
            .txInRedeemerValue(serializedRedeemer)
            .txOut(returnAddress, proposalUtxo.output.amount);

        // Require majority of committee to cancel
        const requiredSigners = Math.ceil(datum.committee.length / 2);
        for (let i = 0; i < requiredSigners && i < datum.committee.length; i++) {
            this.txBuilder.requiredSignerHash(datum.committee[i]);
        }

        return this.txBuilder.complete();
    }

    /**
     * Calculate required signatures
     */
    static calculateThreshold(committeeSize: number, percentage: number): bigint {
        return BigInt(Math.ceil((committeeSize * percentage) / 100));
    }

    /**
     * Common threshold configurations
     */
    static readonly ThresholdPresets = {
        UNANIMOUS: (size: number) => BigInt(size), // 100%
        SUPERMAJORITY: (size: number) => MultisigBuilder.calculateThreshold(size, 67), // 2/3
        MAJORITY: (size: number) => MultisigBuilder.calculateThreshold(size, 51), // >50%
        QUORUM: (size: number) => MultisigBuilder.calculateThreshold(size, 33), // 1/3
    };
}
