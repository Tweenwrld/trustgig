import { type Data } from '@meshsdk/common';

/**
 * Credential type enum
 */
export enum CredentialType {
    Education = 0,
    Certification = 1,
    Experience = 2,
    Skill = 3,
}

/**
 * Credential datum structure
 */
export interface CredentialDatum {
    holderPkh: string;
    issuerPkh: string;
    credentialType: CredentialType;
    credentialHash: string; // IPFS hash or other identifier
    issuedAt: bigint;
    expiresAt: bigint;
    revoked: boolean;
}

/**
 * Credential redeemer types
 */
export type CredentialRedeemer =
    | { type: 'Issue' }
    | { type: 'Revoke' }
    | { type: 'Verify' };

/**
 * Serialize credential datum to Data
 */
export function serializeCredentialDatum(datum: CredentialDatum): Data {
    return {
        alternative: 0,
        fields: [
            datum.holderPkh,
            datum.issuerPkh,
            datum.credentialType,
            datum.credentialHash,
            datum.issuedAt,
            datum.expiresAt,
            datum.revoked ? 1 : 0,
        ],
    };
}

/**
 * Deserialize credential datum from Data
 */
export function deserializeCredentialDatum(plutusData: Data): CredentialDatum {
    if (typeof plutusData === 'object' && 'fields' in plutusData && Array.isArray(plutusData.fields)) {
        return {
            holderPkh: plutusData.fields[0] as string,
            issuerPkh: plutusData.fields[1] as string,
            credentialType: plutusData.fields[2] as CredentialType,
            credentialHash: plutusData.fields[3] as string,
            issuedAt: BigInt(plutusData.fields[4] as number | bigint),
            expiresAt: BigInt(plutusData.fields[5] as number | bigint),
            revoked: (plutusData.fields[6] as number) === 1,
        };
    }
    throw new Error('Invalid CredentialDatum format');
}

/**
 * Serialize credential redeemer to Data
 */
export function serializeCredentialRedeemer(redeemer: CredentialRedeemer): Data {
    if (redeemer.type === 'Issue') {
        return { alternative: 0, fields: [] };
    } else if (redeemer.type === 'Revoke') {
        return { alternative: 1, fields: [] };
    } else {
        return { alternative: 2, fields: [] };
    }
}
