import { MeshTxBuilder } from '@meshsdk/core';
import type { UTxO } from '@meshsdk/core';
import {
    CredentialDatum,
    CredentialRedeemer,
    CredentialType,
    serializeCredentialDatum,
    serializeCredentialRedeemer,
} from './types';

/**
 * Credentials transaction builder
 */
export class CredentialsBuilder {
    private txBuilder: MeshTxBuilder;
    private credentialsScriptAddress: string;
    private credentialsScriptCbor: string;

    constructor(
        txBuilder: MeshTxBuilder,
        credentialsScriptAddress: string,
        credentialsScriptCbor: string
    ) {
        this.txBuilder = txBuilder;
        this.credentialsScriptAddress = credentialsScriptAddress;
        this.credentialsScriptCbor = credentialsScriptCbor;
    }

    /**
     * Issue a new credential
     */
    async issueCredential(
        holderPkh: string,
        issuerPkh: string,
        credentialType: CredentialType,
        credentialHash: string,
        validityPeriod: bigint, // in milliseconds
        minAda: bigint = 2000000n
    ): Promise<string> {
        const currentTime = BigInt(Date.now());
        const datum: CredentialDatum = {
            holderPkh,
            issuerPkh,
            credentialType,
            credentialHash,
            issuedAt: currentTime,
            expiresAt: currentTime + validityPeriod,
            revoked: false,
        };

        const serializedDatum = serializeCredentialDatum(datum);

        this.txBuilder
            .txOut(this.credentialsScriptAddress, [
                { unit: 'lovelace', quantity: minAda.toString() },
            ])
            .txOutInlineDatumValue(serializedDatum)
            .requiredSignerHash(issuerPkh);

        return this.txBuilder.complete();
    }

    /**
     * Revoke a credential
     */
    async revokeCredential(
        credentialUtxo: UTxO,
        datum: CredentialDatum,
        issuerPkh: string
    ): Promise<string> {
        const redeemer: CredentialRedeemer = { type: 'Revoke' };
        const serializedRedeemer = serializeCredentialRedeemer(redeemer);

        const updatedDatum: CredentialDatum = {
            ...datum,
            revoked: true,
        };

        const serializedDatum = serializeCredentialDatum(updatedDatum);

        this.txBuilder
            .spendingPlutusScript('V3')
            .txIn(
                credentialUtxo.input.txHash,
                credentialUtxo.input.outputIndex,
                credentialUtxo.output.amount,
                credentialUtxo.output.address
            )
            .txInScript(this.credentialsScriptCbor)
            .txInInlineDatumPresent()
            .txInRedeemerValue(serializedRedeemer)
            .txOut(this.credentialsScriptAddress, credentialUtxo.output.amount)
            .txOutInlineDatumValue(serializedDatum)
            .requiredSignerHash(issuerPkh);

        return this.txBuilder.complete();
    }

    /**
     * Verify a credential (consumes it as proof)
     */
    async verifyCredential(
        credentialUtxo: UTxO,
        datum: CredentialDatum,
        holderPkh: string,
        returnAddress: string
    ): Promise<string> {
        const redeemer: CredentialRedeemer = { type: 'Verify' };
        const serializedRedeemer = serializeCredentialRedeemer(redeemer);

        // Return the locked ADA to the holder
        this.txBuilder
            .spendingPlutusScript('V3')
            .txIn(
                credentialUtxo.input.txHash,
                credentialUtxo.input.outputIndex,
                credentialUtxo.output.amount,
                credentialUtxo.output.address
            )
            .txInScript(this.credentialsScriptCbor)
            .txInInlineDatumPresent()
            .txInRedeemerValue(serializedRedeemer)
            .txOut(returnAddress, credentialUtxo.output.amount)
            .requiredSignerHash(holderPkh);

        return this.txBuilder.complete();
    }

    /**
     * Helper: Get validity period in days
     */
    static getValidityPeriod(days: number): bigint {
        return BigInt(days * 24 * 60 * 60 * 1000);
    }

    /**
     * Helper: Common validity periods
     */
    static readonly ValidityPeriods = {
        ONE_YEAR: CredentialsBuilder.getValidityPeriod(365),
        TWO_YEARS: CredentialsBuilder.getValidityPeriod(730),
        FIVE_YEARS: CredentialsBuilder.getValidityPeriod(1825),
        LIFETIME: BigInt(Number.MAX_SAFE_INTEGER), // Effectively never expires
    };
}
