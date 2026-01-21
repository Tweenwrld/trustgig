import type { UTxO } from '@meshsdk/core';
import { CredentialDatum, CredentialType, deserializeCredentialDatum } from './types';

/**
 * Credentials UTXO reader
 */
export class CredentialsReader {
    /**
     * Read credential datum from UTXO
     */
    static readDatum(utxo: UTxO): CredentialDatum | null {
        if (!utxo.output.plutusData) {
            return null;
        }

        try {
            return deserializeCredentialDatum(utxo.output.plutusData);
        } catch (error) {
            console.error('Failed to deserialize credential datum:', error);
            return null;
        }
    }

    /**
     * Find all credentials for a holder
     */
    static findByHolder(utxos: UTxO[], holderPkh: string): UTxO[] {
        return utxos.filter((utxo) => {
            const datum = this.readDatum(utxo);
            return datum?.holderPkh === holderPkh;
        });
    }

    /**
     * Find credentials by issuer
     */
    static findByIssuer(utxos: UTxO[], issuerPkh: string): UTxO[] {
        return utxos.filter((utxo) => {
            const datum = this.readDatum(utxo);
            return datum?.issuerPkh === issuerPkh;
        });
    }

    /**
     * Find credentials by type
     */
    static findByType(utxos: UTxO[], credentialType: CredentialType): UTxO[] {
        return utxos.filter((utxo) => {
            const datum = this.readDatum(utxo);
            return datum?.credentialType === credentialType;
        });
    }

    /**
     * Check if credential is valid (not revoked and not expired)
     */
    static isValid(datum: CredentialDatum): boolean {
        if (datum.revoked) return false;
        const currentTime = BigInt(Date.now());
        return currentTime <= datum.expiresAt;
    }

    /**
     * Check if credential is expired
     */
    static isExpired(datum: CredentialDatum): boolean {
        const currentTime = BigInt(Date.now());
        return currentTime > datum.expiresAt;
    }

    /**
     * Get all valid (active) credentials for a holder
     */
    static getValidCredentials(utxos: UTxO[], holderPkh: string): UTxO[] {
        return this.findByHolder(utxos, holderPkh).filter((utxo) => {
            const datum = this.readDatum(utxo);
            return datum && this.isValid(datum);
        });
    }

    /**
     * Get remaining days until expiration
     */
    static getDaysUntilExpiry(datum: CredentialDatum): number {
        const currentTime = BigInt(Date.now());
        if (currentTime >= datum.expiresAt) return 0;
        const remainingMs = datum.expiresAt - currentTime;
        return Math.floor(Number(remainingMs) / (24 * 60 * 60 * 1000));
    }

    /**
     * Get credential type name
     */
    static getTypeName(credentialType: CredentialType): string {
        switch (credentialType) {
            case CredentialType.Education:
                return 'Education';
            case CredentialType.Certification:
                return 'Certification';
            case CredentialType.Experience:
                return 'Experience';
            case CredentialType.Skill:
                return 'Skill';
            default:
                return 'Unknown';
        }
    }

    /**
     * Count credentials by type for a holder
     */
    static countByType(
        utxos: UTxO[],
        holderPkh: string,
        credentialType: CredentialType
    ): number {
        return this.findByHolder(utxos, holderPkh).filter((utxo) => {
            const datum = this.readDatum(utxo);
            return datum?.credentialType === credentialType && this.isValid(datum);
        }).length;
    }
}
