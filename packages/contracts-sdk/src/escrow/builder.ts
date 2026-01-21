import { MeshTxBuilder, Asset } from '@meshsdk/core';
import type { UTxO } from '@meshsdk/core';
import {
    EscrowDatum,
    EscrowRedeemer,
    serializeEscrowDatum,
    serializeEscrowRedeemer,
    JobStatus,
    Milestone,
} from './types';

/**
 * Escrow transaction builder
 */
export class EscrowBuilder {
    private txBuilder: MeshTxBuilder;
    private escrowScriptAddress: string;
    private escrowScriptCbor: string;

    constructor(
        txBuilder: MeshTxBuilder,
        escrowScriptAddress: string,
        escrowScriptCbor: string
    ) {
        this.txBuilder = txBuilder;
        this.escrowScriptAddress = escrowScriptAddress;
        this.escrowScriptCbor = escrowScriptCbor;
    }

    /**
     * Create escrow transaction - lock funds
     */
    async createEscrow(
        clientPkh: string,
        workerPkh: string,
        amount: bigint,
        jobId: string,
        milestones: Milestone[],
        deadline: bigint
    ): Promise<string> {
        const datum: EscrowDatum = {
            client: clientPkh,
            worker: workerPkh,
            amount,
            jobId,
            milestones,
            status: JobStatus.Active,
            deadline,
        };

        const serializedDatum = serializeEscrowDatum(datum);

        this.txBuilder
            .txOut(this.escrowScriptAddress, [
                { unit: 'lovelace', quantity: amount.toString() },
            ])
            .txOutInlineDatumValue(serializedDatum);

        return this.txBuilder.complete();
    }

    /**
     * Release funds to worker
     */
    async releaseFunds(
        escrowUtxo: UTxO,
        workerAddress: string,
        datum: EscrowDatum
    ): Promise<string> {
        const redeemer: EscrowRedeemer = { type: 'Release' };
        const serializedRedeemer = serializeEscrowRedeemer(redeemer);

        this.txBuilder
            .spendingPlutusScript('V3')
            .txIn(
                escrowUtxo.input.txHash,
                escrowUtxo.input.outputIndex,
                escrowUtxo.output.amount,
                escrowUtxo.output.address
            )
            .txInScript(this.escrowScriptCbor)
            .txInInlineDatumPresent()
            .txInRedeemerValue(serializedRedeemer)
            .txOut(workerAddress, [
                { unit: 'lovelace', quantity: datum.amount.toString() },
            ])
            .requiredSignerHash(datum.client);

        return this.txBuilder.complete();
    }

    /**
     * Refund to client
     */
    async refundClient(
        escrowUtxo: UTxO,
        clientAddress: string,
        datum: EscrowDatum
    ): Promise<string> {
        const redeemer: EscrowRedeemer = { type: 'Refund' };
        const serializedRedeemer = serializeEscrowRedeemer(redeemer);

        this.txBuilder
            .spendingPlutusScript('V3')
            .txIn(
                escrowUtxo.input.txHash,
                escrowUtxo.input.outputIndex,
                escrowUtxo.output.amount,
                escrowUtxo.output.address
            )
            .txInScript(this.escrowScriptCbor)
            .txInInlineDatumPresent()
            .txInRedeemerValue(serializedRedeemer)
            .txOut(clientAddress, [
                { unit: 'lovelace', quantity: datum.amount.toString() },
            ])
            .requiredSignerHash(datum.client);

        return this.txBuilder.complete();
    }

    /**
     * Complete a milestone
     */
    async completeMilestone(
        escrowUtxo: UTxO,
        milestoneIndex: number,
        datum: EscrowDatum,
        signerPkh: string
    ): Promise<string> {
        const redeemer: EscrowRedeemer = {
            type: 'CompleteMilestone',
            milestoneIndex,
        };
        const serializedRedeemer = serializeEscrowRedeemer(redeemer);

        // Update milestone in datum
        const updatedMilestones = [...datum.milestones];
        if (!updatedMilestones[milestoneIndex].completed) {
            updatedMilestones[milestoneIndex].completed = true;
        } else {
            updatedMilestones[milestoneIndex].approved = true;
        }

        const updatedDatum: EscrowDatum = {
            ...datum,
            milestones: updatedMilestones,
        };

        const serializedDatum = serializeEscrowDatum(updatedDatum);

        this.txBuilder
            .spendingPlutusScript('V3')
            .txIn(
                escrowUtxo.input.txHash,
                escrowUtxo.input.outputIndex,
                escrowUtxo.output.amount,
                escrowUtxo.output.address
            )
            .txInScript(this.escrowScriptCbor)
            .txInInlineDatumPresent()
            .txInRedeemerValue(serializedRedeemer)
            .txOut(this.escrowScriptAddress, escrowUtxo.output.amount)
            .txOutInlineDatumValue(serializedDatum)
            .requiredSignerHash(signerPkh);

        return this.txBuilder.complete();
    }

    /**
     * Initiate dispute
     */
    async initiateDispute(
        escrowUtxo: UTxO,
        datum: EscrowDatum,
        signerPkh: string
    ): Promise<string> {
        const redeemer: EscrowRedeemer = { type: 'Dispute' };
        const serializedRedeemer = serializeEscrowRedeemer(redeemer);

        const updatedDatum: EscrowDatum = {
            ...datum,
            status: JobStatus.Disputed,
        };

        const serializedDatum = serializeEscrowDatum(updatedDatum);

        this.txBuilder
            .spendingPlutusScript('V3')
            .txIn(
                escrowUtxo.input.txHash,
                escrowUtxo.input.outputIndex,
                escrowUtxo.output.amount,
                escrowUtxo.output.address
            )
            .txInScript(this.escrowScriptCbor)
            .txInInlineDatumPresent()
            .txInRedeemerValue(serializedRedeemer)
            .txOut(this.escrowScriptAddress, escrowUtxo.output.amount)
            .txOutInlineDatumValue(serializedDatum)
            .requiredSignerHash(signerPkh);

        return this.txBuilder.complete();
    }
}
